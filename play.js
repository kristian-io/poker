const poker = require('./g')

var gameOptions =
  {
    startingStack :  500,
    smallBlind : 25,
    bigBlind : 50,
    maxSeats : 2
};
// console.log(options);



function PlayIT(gameResults) {
  //create game with given options
  // console.log('game options: ' + gameOptions);
  g = new poker.Game(gameOptions)

  //select the table
  table = g.table[0];

  //seat players
  console.log(table.seatPlayer(new poker.Player()));
  console.log(table.seatPlayer(new poker.Player()));

  var result = table.newRound();
  if (result == 0) {
    gameResults.player0 ++
  }
  else if (result == 1) {
    gameResults.player1 ++
  }

  delete g;
  console.log('end----------------------------------------------------------------------');
}


// var gameResults = {
//   player0: 0,
//   player1: 0
// }


// PlayIT();


function playNtimes(n) {
  var gameResults = {
    player0: 0,
    player1: 0
  }
  for (var i = 0; i < n; i++) {
    PlayIT(gameResults)
  }
  console.log(gameResults);
}


playNtimes(50)

// console.log(gameResults);


// console.log(table.newRound())


// var ai_wins = 1
// var human_wins = 1
//
// while (true) {
//   var total = ai_wins + human_wins;
//   console.log('');
//   console.log('>>>>>>>>>>>>>human win rate: ' + human_wins/total);
//   console.log('');
//   game = bla()
//
//   if (game == 0) {
//     ai_wins++
//   }
//   else if (game == 1) {
//     human_wins++
//   }
//   else {
//
//   }
// }
