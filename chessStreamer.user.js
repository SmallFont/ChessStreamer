// ==UserScript==
// @version         1.0.0
// @name            ChessStreamer
// @author SmallFonts
// @namespace       https://github.com/SmallFont
// @description     Utility for chess.com streamers
// @compatible      chrome
// @icon            https://raw.githubusercontent.com/SmallFont/ChessStreamer/master/doc/icon.png
// @match           *://www.chess.com/live
// @run-at          document-end
// @downloadURL     https://github.com/SmallFont/ChessStreamer/raw/master/src/chessStreamer.user.js
// @homepageURL     https://github.com/SmallFont/ChessStreamer
// @require         http://code.jquery.com/jquery-3.3.1.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.js
// @grant           none
// ==/UserScript==

(function ()
{
    'use strict';

    let fps = 60;
    let socket = io("http://localhost:3030");

    socket.on("connect", () =>
    {
        updatePlayer("top");
        updatePlayer("bottom");
    });

    socket.on("requestPlayers", () =>
    {
        updatePlayer("top");
        updatePlayer("bottom");
    });

    function updatePlayer(playerDiv)
    {
        try
        {
            var grudge = $(".board-player-" + playerDiv + " > .grudge-score-component").text();
        } catch (ex) { }

        try
        {
            //try arena score component
            let arenaScoreStr = $(".board-player-" + playerDiv + " > .arena-score-component").text();

            let res = /(\d+)\n.+(#\d+)/.exec(arenaScoreStr);

            if (res)
            {
                var arenaScore = res[1];
                var arenaRank = res[2];
            }
        } catch (ex) { }

        try
        {
            var img = $(".board-player-" + playerDiv + " > img").attr("src");
        } catch (ex) { }

        try
        {
            var tag = $(".board-player-" + playerDiv + " > .board-player-userTagline > .user-tagline-component > .user-tagline-title").text();
        } catch (ex) { }

        try
        {
            var username = $(".board-player-" + playerDiv + " > .board-player-userTagline > .user-tagline-component > .user-tagline-username").text();
        } catch (ex) { }

        try
        {
            var rating = $(".board-player-" + playerDiv + " > .board-player-userTagline > .user-tagline-component > .user-tagline-rating").text();
        } catch (ex) { }

        //flag
        let flag = "";
        try
        {
            var classStr = $(".board-player-" + playerDiv + " > .board-player-userTagline > .user-tagline-component > .user-flag-component").attr("class");
        } catch (ex) { }

        if (classStr)
        {
            let flagRgx = /user-flag-country-(\w+)/.exec(classStr);
            flag = flagRgx[1];
        }

        //clock
        try
        {
            //color
            var clockColor = $(".board-player-" + playerDiv + " > .clock-component").hasClass("clock-black");

            //active
            var clockActive = $(".board-player-" + playerDiv + " > .clock-component").hasClass("clock-playerTurn");

            //time
            var clockTime = $(".board-player-" + playerDiv + " > .clock-component > #main-clock-" + playerDiv + "").text();
        } catch (ex) { }

        //captured pieces
        try
        {
            let container = $(".board-player-" + playerDiv + " > .board-player-userTagline > .captured-pieces");

            var capturedClasses = [];

            let children = container.children();

            for (let index = 0; index < children.length; index++)
            {
                let classes = children[index].className.split(/\s+/);

                if (classes[1] != "captured-pieces-score")
                {
                    capturedClasses.push(classes[1]);
                }
            }

            var score = $(".board-player-" + playerDiv + " > .board-player-userTagline > .captured-pieces > .captured-pieces-score").text();
        } catch (ex) { }

        //send player update
        socket.emit(playerDiv + "PlayerUpdate", {
            grudge: grudge,
            arenaScore: arenaScore,
            arenaRank: arenaRank,
            src: img,
            tag: tag,
            username: username,
            rating: rating,
            flag: flag,
            clockTime: clockTime,
            clockActive: clockActive,
            clockColor: clockColor,
            captured: capturedClasses,
            score: score
        });
    }

    function setupObservers()
    {
        //setup observers
        //observe the user containers for changes
        var observerConfig = {
            childList: true,
            subtree: true,
            attributes: true
        };

        var topObserver = new MutationObserver((function (mutations)
        {
            updatePlayer("top");
        }));

        var bottomObserver = new MutationObserver((function (mutations)
        {
            updatePlayer("bottom");
        }));

        let playerTop = $(".board-player-top");
        let playerBottom = $(".board-player-bottom");

        //player stats
        if (playerTop.length > 0)
        {
            topObserver.observe(playerTop[0], observerConfig);
            updatePlayer("top");
        }

        if (playerBottom.length > 0)
        {
            bottomObserver.observe(playerBottom[0], observerConfig);
            updatePlayer("bottom");
        }
    }

    setTimeout(setupObservers, 2000);

    let mouseX = 0;
    let mouseY = 0;
    let mouseCursor = "";

    let board = $(".board");
    let gameActive = true;
    let currentBoard = null;

    setInterval(function ()
    {
        board = $(".board");

        if (board.length && currentBoard != board[0])
        {
            currentBoard = board[0];

            board.mousemove(function (event)
            {
                mouseX = (event.pageX - board.offset().left);
                mouseY = (event.pageY - board.offset().top);
                mouseCursor = $(event.target).css("cursor");
            });
        }

        let pieces = $(".pieces").children();

        let squareSize = board.width() / 8;

        //figure out positions and role for each piece as relative offset
        let updatePieced = [];
        for (let index = 0; index < pieces.length; index++)
        {
            let piece = $(pieces[index]);

            let role = piece.css("background-image").slice(-8).substr(0, 2);
            let position = { x: piece.position().left / squareSize, y: piece.position().top / squareSize };
            let dragging = piece.hasClass("dragging");
            let opacity = piece.css("opacity");

            updatePieced.push({
                role: role,
                position: position,
                dragging: dragging,
                opacity: opacity
            });
        };

        //square highlights
        let updateHighlights = [];
        let highlights = board.children(".square");
        for (let index = 0; index < highlights.length; index++)
        {
            let highlight = $(highlights[index]);

            updateHighlights.push({
                position: {
                    x: highlight.position().left / squareSize,
                    y: highlight.position().top / squareSize
                },
                color: highlight.css("background-color"),
                opacity: highlight.css("opacity")
            });
        }

        //arrows
        let updateArrows = [];
        let arrows = board.children("svg.arrow-container");
        for (let index = 0; index < arrows.length; index++)
        {
            let arrow = $(arrows[index]);
            let poly = $(arrow.children("polygon"));

            let points = poly.attr("points");

            function getPX(val)
            {
                return /([\d\.]+)(?:px)?/.exec(val)[1];
            }

            let width = getPX(arrow.attr("width")) / board.width();
            let height = getPX(arrow.attr("height")) / board.height();

            let viewbox = arrow.attr("viewBox");

            //parse and convert style
            let style = arrow.attr("style");
            let polyTransform = poly.attr("transform");

            let arrowStyleRes = /transform: translate\(([\d\.]+)(?:px)?, ([\d\.]+)(?:px)?\) rotate\(([\w-]+)\) scale\(([\w-]+), ([\w-]+)\); transform-origin: ([\w%]+) ([\w%]+) ([\w]+)(?:px)?;/.exec(style);

            //translate
            let tx = arrowStyleRes[1] / board.width();
            let ty = arrowStyleRes[2] / board.height();

            //rotate
            let r = arrowStyleRes[3];

            //scale
            let sx = arrowStyleRes[4];
            let sy = arrowStyleRes[5];

            //transform-origin
            let tox = arrowStyleRes[6];
            let toy = arrowStyleRes[7];
            let toz = arrowStyleRes[8];

            //polygon transform
            let pt = polyTransform;

            //fill

            // //parse points
            // let pairs = [];
            // let pair = null;
            // let rgx = /(\d+) (\d+)/g;
            // while (pair = rgx.exec(points))
            // {
            //     let x = pair[1];
            //     let y = pair[2];

            //     pairs.push({ x: x, y: y });
            // }

            // updateArrows.push(pairs);

            updateArrows.push({
                width: width,
                height: height,
                viewbox: viewbox,
                points: points,
                tx: tx,
                ty: ty,
                r: r,
                sx: sx,
                sy: sy,
                tox: tox,
                toy: toy,
                toz: toz,
                pt: pt
            });
        }

        //send update packet
        socket.emit("update", {
            mouse: {
                x: mouseX / board.width(),
                y: mouseY / board.height(),
                mouseCursor: mouseCursor
            },
            pieces: updatePieced,
            highlights: updateHighlights,
            arrows: updateArrows
        });

        //check for game over
        let gameOverDialog = $(".game-over-dialog-component");

        if (gameOverDialog.length)
        {
            if (gameActive)
            {
                console.log("gameOver")
                gameActive = false;
                let gameOverTitle = $(".game-over-dialog-component > .game-over-dialog-body > h3").text();
                let gameOverSubtitle = $(".game-over-dialog-component > .game-over-dialog-body > p").html();

                let res = /<strong>([\w\s-]+)<\/strong>([\w\s-]+)/.exec(gameOverSubtitle);

                if (res)
                {
                    socket.emit("gameOver", {
                        title: gameOverTitle,
                        subtitleBold: res[1],
                        subtitle: res[2]
                    });
                }
                else
                {
                    gameOverSubtitle = $(".game-over-dialog-component > .game-over-dialog-body > p").text();

                    //draw or abort
                    socket.emit("gameOver", {
                        title: gameOverTitle,
                        subtitleBold: "",
                        subtitle: gameOverSubtitle
                    });
                }
            }
        }
        else
        {
            if (!gameActive)
            {
                console.log("gameStarted");
                gameActive = true;
                socket.emit("gameStart");
            }
        }
    }, 1000 / fps);
})();