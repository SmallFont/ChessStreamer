import { Component, OnInit } from '@angular/core';
import { ipcRenderer } from "electron";

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

  constructor() { }

  ngOnInit()
  {
    ipcRenderer.on("update", (event, arg) =>
    {
      this.mouseX = arg.mouse.x;
      this.mouseY = arg.mouse.y;
      this.mouseCursor = arg.mouse.mouseCursor;

      this.pieces = arg.pieces;
      this.highlights = arg.highlights;
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