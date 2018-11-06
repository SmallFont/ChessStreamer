import { Component, OnInit, HostListener, SecurityContext, ViewChild, ElementRef } from '@angular/core';
import { ipcRenderer } from "electron";
import { userImage } from "../../../images";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit
{
  mouseX = 0;
  mouseY = 0;
  mouseCursor = "";

  pieces: any;
  highlights: any;
  arrows: any;

  gameOver: boolean = false;
  title: string;
  subtitleBold: string;
  subtitle: string;

  topPlayer: any = {
    grudge: "",
    arenaScore: "",
    arenaRank: "",
    img: "",
    tag: "",
    username: "",
    rating: "",
    flag: "",
    clockTime: "",
    clockActive: "",
    clockColor: "",
    captured: [],
    score: ""
  };

  bottomPlayer: any = {
    grudge: "",
    arenaScore: "",
    arenaRank: "",
    img: "",
    tag: "",
    username: "",
    rating: "",
    flag: "",
    clockTime: "",
    clockActive: "",
    clockColor: "",
    captured: [],
    score: ""
  };

  constructor(private sanitizer: DomSanitizer)
  { }

  boardClass: string = "wood";

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event)
  {
    if (event.key == "1")
    {
      this.boardClass = "default";
    }
    else if (event.key == "2")
    {
      this.boardClass = "wood";
    }
  }

  imageLoadError(event: any)
  {
    event.target.src = userImage;
  }

  ngOnInit()
  {
    ipcRenderer.on("update", (event, arg) =>
    {
      this.mouseX = arg.mouse.x;
      this.mouseY = arg.mouse.y;
      this.mouseCursor = arg.mouse.mouseCursor;

      this.pieces = arg.pieces;
      this.highlights = arg.highlights;
      this.arrows = arg.arrows;

      //build arrow styles 
      if (this.arrows)
      {
        this.arrows.forEach(arrow =>
        {
          arrow.style = 'transform: translate(' + arrow.tx * 800 + 'px,' + arrow.ty * 800 + 'px) rotate(' + arrow.r + ') scale(' + arrow.sx + ',' + arrow.sy + '); transform-origin: ' + arrow.tox + ' ' + arrow.toy + ' ' + arrow.toz + ';';
          arrow.style = this.sanitizer.bypassSecurityTrustStyle(arrow.style);
        });

        console.log(this.arrows);
      }
    });

    ipcRenderer.on("topUpdate", (event, arg) =>
    {
      this.topPlayer = arg;
    });

    ipcRenderer.on("bottomUpdate", (event, arg) =>
    {
      this.bottomPlayer = arg;
    });

    ipcRenderer.on("gameOver", (event, arg) =>
    {
      //show game over
      this.gameOver = true;
      this.title = arg.title;
      this.subtitleBold = arg.subtitleBold;
      this.subtitle = arg.subtitle;
    });

    ipcRenderer.on("gameStart", (event, arg) =>
    {
      //remove game over if displayed
      this.gameOver = false;
    });

    //request player update 
    ipcRenderer.send("requestPlayers");
  }
}