const poker = require('./g')

options =
  {
    startingStack :  500,
    smallBlind : 25,
    bigBlind : 50,
    maxSeats : 5
};
// console.log(options);

//create game with given options
g = new poker.Game(options)

//select the table
table = g.table[0];


//seat players
console.log(table.seatPlayer(new poker.Player(),0));
console.log(table.seatPlayer(new poker.Player(),3));
console.log(table.seatPlayer(new poker.Player(),1));


//deal hole cards
// table.dealCards();

// table.nextAction()

// console.log(table);

table.newRound();
console.log(table);

// console.log(table.seats.length);

//show table
// console.log(table);
