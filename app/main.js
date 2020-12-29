import Chess from 'chess.js'

// function displayBoard(boardAscii) {
//   document.getElementById("board1").innerHTML = "<pre>" + boardAscii + "</pre>"
// }

// Nice and dirty
function displayMoveHistory(moveHistory) {
  // Format into white/black moves on one line
  var moveHistoryHtml = moveHistory.reduce(function(accumulator, move, index) {
    return accumulator + move + ((index % 2) ? "<br>" : " ")
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

// var randomMoveIntervalId = null

// randomMoveIntervalId = setInterval(function() {
//   if (!game.game_over()) {
//     var moves = game.moves()
//     var randomMove = moves[Math.floor(Math.random() * moves.length)]
//     game.move(randomMove)
//     board.position(game.fen())
//   } else {
//     clearInterval(randomMoveIntervalId)
//   }
// }, 1000)

var calculateBestMove = function(game) {

  var newGameMoves = game.moves({verbose: true});
  var moveValues = newGameMoves.reduce(function(accumulator, moveObj) {
    var pieceObj = game.get(moveObj.to)
    var pieceValue = (pieceObj === null) ? 0 : pieceValues[pieceObj.type]
    return Object.assign(accumulator, { [moveObj.san]: pieceValue }) // moveObj.san == Move in algebraic notation
  }, {});

  var bestMove = null;
  for (let key in moveValues) {
    if(moveValues.hasOwnProperty(key)) {
      let bestMoveValue = (bestMove === null) ? 0 : moveValues[bestMove]
      if (moveValues[key] > bestMoveValue) {
        bestMove = key
      }
    }
  }

  console.log(bestMove);

  if (bestMove === null) {
    bestMove = game.moves()[Math.floor(Math.random() * game.moves().length)]
  }
  console.log(bestMove);

  console.log(moveValues)

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
  window.setTimeout(makeBestMove, 1000);
};

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
