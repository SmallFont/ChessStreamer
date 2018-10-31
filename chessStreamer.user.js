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

    let socket = io("http://localhost:3030");

    socket.on("connect", () =>
    {
        updateTopPlayer();
        updateBottomPlayer();
    });

    socket.on("requestPlayers", () =>
    {
        console.log("request players");

        updateTopPlayer();
        updateBottomPlayer();
    });

    //setup observers
    //observe the user containers for changes
    var observerConfig = {
        childList: true,
        subtree: true,
        attributes: true
    };

    function updateTopPlayer()
    {
        try
        {
            var grudge = $(".board-player-top > .grudge-score-component").text();
        } catch (ex) { }

        try
        {
            //try arena score component
            let arenaScoreStr = $(".board-player-top > .arena-score-component").text();

            let res = /(\d+)\n.+(#\d+)/.exec(arenaScoreStr);

            if (res)
            {
                var arenaScore = res[1];
                var arenaRank = res[2];
            }
        } catch (ex) { }

        try
        {
            var img = $(".board-player-top > img").attr("src");
        } catch (ex) { }

        try
        {
            var tag = $(".board-player-top > .board-player-userTagline > .user-tagline-component > .user-tagline-title").text();
        } catch (ex) { }

        try
        {
            var username = $(".board-player-top > .board-player-userTagline > .user-tagline-component > .user-tagline-username").text();
        } catch (ex) { }

        try
        {
            var rating = $(".board-player-top > .board-player-userTagline > .user-tagline-component > .user-tagline-rating").text();
        } catch (ex) { }

        //flag
        let flag = "";
        try
        {
            var classStr = $(".board-player-top > .board-player-userTagline > .user-tagline-component > .user-flag-component").attr("class");
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
            var clockColor = $(".board-player-top > .clock-component").hasClass("clock-black");

            //active
            var clockActive = $(".board-player-top > .clock-component").hasClass("clock-playerTurn");

            //time
            var clockTime = $(".board-player-top > .clock-component > #main-clock-top").text();
        } catch (ex) { }

        //captured pieces
        try
        {
            let container = $(".board-player-top > .board-player-userTagline > .captured-pieces");

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

            var score = $(".board-player-top > .board-player-userTagline > .captured-pieces > .captured-pieces-score").text();
        } catch (ex) { }

        //send player update
        socket.emit("topPlayerUpdate", {
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


    function updateBottomPlayer()
    {
        try
        {
            var grudge = $(".board-player-bottom > .grudge-score-component").text();
        } catch (ex) { }

        try
        {
            //try arena score component
            let arenaScoreStr = $(".board-player-bottom > .arena-score-component").text();

            let res = /(\d+)\n.+(#\d+)/.exec(arenaScoreStr);

            if (res)
            {
                var arenaScore = res[1];
                var arenaRank = res[2];
            }
        } catch (ex) { }

        try
        {
            var img = $(".board-player-bottom > img").attr("src");
        } catch (ex) { }

        try
        {
            var tag = $(".board-player-bottom > .board-player-userTagline > .user-tagline-component > .user-tagline-title").text();
        } catch (ex) { }

        try
        {
            var username = $(".board-player-bottom > .board-player-userTagline > .user-tagline-component > .user-tagline-username").text();
        } catch (ex) { }

        try
        {
            var rating = $(".board-player-bottom > .board-player-userTagline > .user-tagline-component > .user-tagline-rating").text();
        } catch (ex) { }

        //flag
        let flag = "";
        try
        {
            var classStr = $(".board-player-bottom > .board-player-userTagline > .user-tagline-component > .user-flag-component").attr("class");
        } catch (ex) { }

        if (classStr)
        {
            let flagRgx = /user-flag-country-(\w+)/.exec(classStr);
            flag = flagRgx[1];
        }

        try
        {
            //color
            var clockColor = $(".board-player-bottom > .clock-component").hasClass("clock-black");

            //active
            var clockActive = $(".board-player-bottom > .clock-component").hasClass("clock-playerTurn");

            //time
            var clockTime = $(".board-player-bottom > .clock-component > #main-clock-bottom").text();
        } catch (ex) { }

        //captured pieces
        try
        {
            let container = $(".board-player-bottom > .board-player-userTagline > .captured-pieces");

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

            var score = $(".board-player-bottom > .board-player-userTagline > .captured-pieces > .captured-pieces-score").text();
        } catch (ex) { }

        //send player update
        socket.emit("bottomPlayerUpdate", {
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

    var topObserver = new MutationObserver((function (mutations)
    {
        updateTopPlayer();
    }));

    var bottomObserver = new MutationObserver((function (mutations)
    {
        updateBottomPlayer()
    }));

    let playerTop = $(".board-player-top");
    let playerBottom = $(".board-player-bottom");

    //player stats
    if (playerTop.length > 0)
    {
        topObserver.observe(playerTop[0], observerConfig);
        updateTopPlayer();
    }

    if (playerBottom.length > 0)
    {
        bottomObserver.observe(playerBottom[0], observerConfig);
        updateBottomPlayer();
    }

    let mouseX = 0;
    let mouseY = 0;
    let mouseCursor = "";

    let board = $(".board");
    let gameActive = true;
    let mouseCaptured = false;

    setInterval(function ()
    {
        board = $(".board");

        if (!mouseCaptured && board.length)
        {
            mouseCaptured = true;

            board.mousemove(function (event)
            {
                mouseX = (event.pageX - board.offset().left);
                mouseY = (event.pageY - board.offset().top);

                mouseCursor = $(event.target).css("cursor");
            });
        }

        let pieces = $(".pieces").children();

        let squareSize = board.width() / 8;

        //figure out orientation
        //get player top and bottom div and check for color classes

        //figure out positions and role for each piece in relative offset
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
        //game result

        //send packet
        socket.emit("update", {
            mouse: {
                x: mouseX / board.width(),
                y: mouseY / board.height(),
                mouseCursor: mouseCursor
            },
            pieces: updatePieced,
            highlights: updateHighlights
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

                let res = /<strong>([\w\s]+)<\/strong>([\w\s]+)/.exec(gameOverSubtitle);

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

                    //draw
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
    }, 1000 / 60);

})();