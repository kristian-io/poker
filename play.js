const poker = require('./g')

options =
  {
    startingStack :  500,
    smallBlind : 25,
    bigBlind : 50,
    maxSeats : 9
};
// console.log(options);

//create game with given options
g = new poker.Game(options)

//select the table
table = g.table[0];


//seat players
console.log(table.seatPlayer(new poker.Player()));
console.log(table.seatPlayer(new poker.Player()));
console.log(table.seatPlayer(new poker.Player()));
console.log(table.seatPlayer(new poker.Player(), 4));
console.log(table.seatPlayer(new poker.Player(), 5));
console.log(table.seatPlayer(new poker.Player(), 6));

// console.log(table.seatPlayer(new poker.Player()));
// console.log(table.seatPlayer(new poker.Player()));
// console.log(table.seatPlayer(new poker.Player(),4));


//deal hole cards
// table.dealCards();

// table.nextAction()

// console.log(table);

table.newRound();
console.log(table);



// console.log('=================================');
// console.log(table.getStateFromPlayerPerspective(0));
