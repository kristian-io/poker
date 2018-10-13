const startingstack = 500;
const sb = 10;
const bb = 20;

// GAME CLASS
class Game {
  constructor() {
    this.startingstack = startingstack;
    this.sb = sb;
    this.bb = bb
    this.table = new Table();
  }
}

// TABLE CLASS
class Table {
  constructor() {
    this.dealer = 0
    this.communitycards = []
    this.seats = []
    this.deck = new Deck();
  }

  resetDeck() {
    this.deck = new Deck();
  }

  seatPlayer(player, position) {
    // this.seats.push(player);
    if (this.seats[position]) {
      throw new Error(`Position ${position} is already taken`);
    } else {
      this.seats[position] = player
    }
  }

  dealCards() {
    for (var i = 0; i < this.seats.length; i++) {
      this.seats[i].hand = this.deck.deal(2);
    }
  }

  dealFlop() {
    let x = this.deck.deal(3);
    for (var i = 0; i < x.length; i++) {
      this.communitycards.push(x[i]);
    }
  }

  dealTurn() {
    let x = this.deck.deal(1);
    this.communitycards.push(x[0]);
  }

  dealRiver() {
    let x = this.deck.deal(1);
    this.communitycards.push(x[0]);
  }
}

//PLAYER CLASS
class Player {
  constructor() {
    this.stack = 1000
    this.hand = []
  }

}

// DECK CLASS
class Deck {
  constructor() {

    this.cards = [
      "2d",
      "2h",
      "2s",
      "2c",
      "3d",
      "3h",
      "3s",
      "3c",
      "4d",
      "4h",
      "4s",
      "4c",
      "5d",
      "5h",
      "5s",
      "5c",
      "6d",
      "6h",
      "6s",
      "6c",
      "7d",
      "7h",
      "7s",
      "7c",
      "8d",
      "8h",
      "8s",
      "8c",
      "9d",
      "9h",
      "9s",
      "9c",
      "Td",
      "Th",
      "Ts",
      "Tc",
      "Jd",
      "Jh",
      "Js",
      "Jc",
      "Qd",
      "Qh",
      "Qs",
      "Qc",
      "Kd",
      "Kh",
      "Ks",
      "Kc",
      "Ad",
      "Ah",
      "As",
      "Ac",
    ]

    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  deal(count) {
    let results = []
    while (count > 0) {
      results.push(this.cards.shift());
      count--;
    }
    console.log(results);
    return results;
  }
}


function hasPair(hand, communitycards) {
  rankTable = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"]

  //get all card ranks:
  let cards = hand.concat(communitycards)
  let cardsRank = []
  // console.log('unsorted');
  // console.log(cards);
  // for (card in cards) {
  //   cardsRank.push(cards[card][0]) //get all the card Ranks (strip the suits)
  // }
  cards.sort(function sort(a, b) {
    if (rankTable.indexOf(a[0]) < rankTable.indexOf(b[0])) {
      return -1
    }
    if (rankTable.indexOf(a[0]) > rankTable.indexOf(b[0])) {
      return 1
    }
    if (rankTable.indexOf(a[0]) == rankTable.indexOf(b[0])) {
      return 0
    }
  })

  // console.log('sorted');
  // console.log(cards);
  let pairs = []
  for (var i = 0; i < cards.length; i++) {
    if (i + 1 == cards.length) { //in the next if(){} we are checking if the NEXT element is the same, we have to break if we are on the last element
      // console.log('fuck');
      break;
    }
    if (cards[i + 1][0] == cards[i][0]) {
      // console.log('found match' + cards[i][0]);
      pairs.push([cards[i],cards[i+1]]) // this not only gives us pairs but also a 3of a kind and 4 of a kind
    }
  }

  // console.log(pairs);

  if (!Array.isArray(pairs) || pairs.length != 1 ) {
    return false
  } else {
    restOftheHand = []
    for (var i = 0; i < cards.length; i++) {
      if (!pairs[0].includes(cards[i])) {
        // console.log('here    ' + cards[i]);
        restOftheHand.push(cards[i]);
      }
    }
    // console.log(restOftheHand.splice(0,3));
      // return [pair, restOftheHand]
    return [pairs[0], restOftheHand.splice(0,3)]
  }
}

// console.log(hasPair(["Qc", "Jh"], ["Jc", "9d", "9h", "Js", "2s"]));



function setup() {
  g = new Game();
  g.table.seatPlayer(new Player(), 0);
  // g.table.seatPlayer(new Player(), 1);
  g.table.dealCards();
  g.table.dealFlop();
  g.table.dealTurn();
  g.table.dealRiver();
}



// setup()
// console.log(hasPair(g.table.seats[0].hand, g.table.communitycards));





// function setup() {
//   g = new Game ();
//   g.table.seatPlayer(new Player());
//   g.table.seatPlayer(new Player());
//   g.table.dealCards();
//   g.table.dealFlop();
//   g.table.dealTurn();
//   g.table.dealRiver();
// }




// var deck = new Deck();
// deck.shuffle()
// console.log(deck);
// deck.deal(2);
// deck.deal(2);
// deck.deal(2);
// deck.deal(2);
// deck.deal(2);
// deck.deal(2);
// deck.deal(2);
// deck.deal(2);
// deck.deal(2);
// deck.deal(3);
// deck.deal(1);
// deck.deal(1);
// console.log(deck.cards);


module.exports =  {
  hasPair,
};
