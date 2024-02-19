import Chess from 'chess.js'

function displayMoveHistory(moveHistory) {
  // Format into white/black moves on one line
  var moveHistoryHtml = moveHistory.reduce(function(accumulator, move, index) {
    const isNewMoveLine = !(index % 2)
    const moveLineNum = Math.floor(index / 2) + 1
    return accumulator + (isNewMoveLine ? `<br />${moveLineNum}.` : '') + ` ${move}`
  }, "")

  document.getElementById("moveHistory").innerHTML = moveHistoryHtml
}

var game = Chess()
var boardId = 'board1'
var board
var pieceValues = {
  [game.PAWN]: 1,
  [game.KNIGHT]: 3,
  [game.BISHOP]: 3,
  [game.ROOK]: 5,
  [game.QUEEN]: 9,
  [game.KING]: 1000,
}
var gameStarted = false;

// TODO: not fully working? I dont think it's calculating the piece values correctly. All board values are -1 when a rook/knight/etc. could be taken by white next turn
var getBoardValue = function(move) {
  // Get board layout assuming move was made
  game.move(move)
  // Empty squares return as null, which will be ignored
  const boardLayout = game.board().flat().filter(function(val) { return val !== null })
  game.undo()
  return boardLayout.reduce(function(accumulator, square) {
    let value = pieceValues[square.type]
    // Black will always have a negative score, white will always have a positive score
    if (square.color === game.BLACK) {
      value = -value
    }
    return accumulator + value
  }, 0)
}

var calculateBestMove = function(game) {
  var possibleMoves = game.moves();
  var moveValues = possibleMoves.reduce(function(accumulator, move) {
    return Object.assign(accumulator, { [move]: getBoardValue(move) })
  }, {});

  console.log(moveValues)

  // for (let key in possibleMoves) {
  //   if(possibleMoves.hasOwnProperty(key)) {
  //     let boardValue = getBoardValue(possibleMoves[key].san)
  //     console.log(possibleMoves[key].san, boardValue)
  //   }
  // }

  // var moveValues = possibleMoves.reduce(function(accumulator, moveObj) {
  //   var pieceObj = game.get(moveObj.to)
  //   var pieceValue = (pieceObj === null) ? 0 : pieceValues[pieceObj.type]
  //   return Object.assign(accumulator, { [moveObj.san]: pieceValue }) // moveObj.san == Move in algebraic notation
  // }, {});

  var currentTurn = game.turn()
  var bestMove = null;

  for (let key in moveValues) {
    if(moveValues.hasOwnProperty(key)) {
      let bestMoveValue = (bestMove === null) ? 0 : moveValues[bestMove]
      if (
        (currentTurn === game.BLACK && moveValues[key] < bestMove)
        || (currentTurn === game.WHITE && moveValues[key] > bestMove)
      ) {
        bestMove = key
      }
    }
  }

  if (bestMove === null) {
    bestMove = game.moves()[Math.floor(Math.random() * game.moves().length)]
  }

  return bestMove;
};

var makeBestMove = function () {
  var bestMove = getBestMove(game);
  game.move(bestMove);
  board.position(game.fen());
  displayMoveHistory(game.history());
  if (game.game_over()) {
    alert('Game over');
  }
};

var getBestMove = function (game) {
  var bestMove = calculateBestMove(game);
  return bestMove;
};

var onDragStart = function (source, piece, position, orientation) {
  if (game.in_checkmate() === true || game.in_draw() === true ||
    piece.search(/^b/) !== -1) {
    return false;
  }
};

var onDrop = function (source, target) {
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  if (move === null) {
    return 'snapback';
  }

  removeGreySquares();

  displayMoveHistory(game.history());
  if (!gameStarted) {
    setSubtitle("Walked along the sand dunes of the Sahara desert for forty days and forty nights with nothing but a pack of Newports and a fifth of henny. I really do this shit.");
    gameStarted = true;
  }
  window.setTimeout(makeBestMove, 1000);
};

var setSubtitle = function(text) {
  document.getElementById("subtitle").textContent = text;
}

var onSnapEnd = function () {
  board.position(game.fen());
};

var onMouseoverSquare = function(square, piece) {
  var moves = game.moves({
      square: square,
      verbose: true
  });

  if (moves.length === 0) return;

  greySquare(square);

  for (var i = 0; i < moves.length; i++) {
      greySquare(moves[i].to);
  }
};

var onMouseoutSquare = function(square, piece) {
  removeGreySquares();
};

var removeGreySquares = function() {
  $(`#${boardId} .square-55d63`).css('background', '');
};

var greySquare = function(square) {
  var squareEl = $(`#${boardId} .square-${square}`);

  var background = '#a9a9a9';
  if (squareEl.hasClass('black-3c85d') === true) {
      background = '#696969';
  }

  squareEl.css('background', background);
};

board = Chessboard('board1', {
  draggable: true,
  onDragStart,
  onDrop,
  onSnapEnd,
  onMouseoverSquare,
  onMouseoutSquare,
  position: 'start',
})
