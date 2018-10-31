# ![ChessStreamer](https://raw.github.com/SmallFont/ChessStreamer/master/doc/logo.png)
![Preview](https://raw.github.com/SmallFont/ChessStreamer/master/doc/preview.gif)

# ChessStreamer
This utility allows chess.com streamers to play on any board size and theme without affecting their stream.
It mirrors the currently displayed chess.com board in a separate capturable window without loss of quality due to scaling.

# Limitations
- doesnt yet support arrows
- doesnt yet support connection quality indicators

# Installation
- Install [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) for Chrome 
- Open the [Userscript](https://github.com/SmallFont/ChessStreamer/raw/master/chessStreamer.user.js) and click `Install` to add it to Tampermonkey
- Download the [latest release](https://github.com/SmallFont/ChessStreamer/releases/download/v1.0.0/chess.streamer.1.0.0.exe) or build ChessStreamer from source
- open [Chess.com](https://chess.com/live) and run `chess streamer 1.0.0.exe` 

# Build From Source
- download or clone the repository
- open the repository folder in vscode 
- run `npm install` to install dependencies
- run `npm run electron:windows` to build for windows 
- the executable will be built in `ChessStreamer/release/chess streamer 1.0.0.exe`