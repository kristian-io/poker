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
      "Ac"
    ]

    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [
        this.cards[i], this.cards[j]
      ] = [
        this.cards[j], this.cards[i]
      ];
    }
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [
        this.cards[i], this.cards[j]
      ] = [
        this.cards[j], this.cards[i]
      ];
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



function hasFullhouse(hand, communitycards) {
  pairs = hasPair(hand, communitycards);
  threeOfaKind = hasThreeOfaKind(hand, communitycards);

  if (pairs && threeOfaKind) {
    //clean up the pairs array ...
    let pairs_new = []
    for (var i = 0; i < pairs.length; i++) {
      if (pairs[i][0][0] != threeOfaKind[0][0][0]) {
        //this is very ugly
        //given 8s,2h, 8c,8d,7h,2s,9c
        //pairs = [ [ '8s', '8c' ], [ '8c', '8d' ], [ '2h', '2s' ] ]
        //threeOfaKind = [ [ '8s', '8c', '8d' ], '9c', '7h' ]
        //we want to remove those "pairs" in pairs array that are actually a 3ofakind...
        pairs_new.push(pairs[i])
      }
    }

    // console.log(hand + ", " + communitycards);
    // console.log(pairs_new);
    // console.log(threeOfaKind);

    if (pairs_new.length == 0) {
      return undefined;
    }
    else {
      return [threeOfaKind[0], pairs_new[0]]
    }
  }
}

function hasFlush(hand, communitycards) {
  rankTable = [
    "A",
    "K",
    "Q",
    "J",
    "T",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2"
  ]

  let cards = hand.concat(communitycards)
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

  // console.log(cards);

  function flushSuit(suit, cards) {
    flush = [];
    counter = 0
    for (var i = 0; i < cards.length; i++) {
      if (cards[i][1] == suit) {
        counter++
      }
    }
    if (counter >= 5) {
      // console.log('flush found ' + suit);
      for (var i = 0; i < cards.length; i++) {
        if (cards[i][1] == suit) {
          flush.push(cards[i])
        }
      }
      // console.log(flush);
      return flush;
    } else {
      // console.log('flush NOT found');
      return undefined;
    }
  }

  s = flushSuit('s', cards)
  c = flushSuit('c', cards)
  d = flushSuit('d', cards)
  h = flushSuit('h', cards)

  if (s) {
    return s.splice(0, 5)
  } else if (c) {
    return c.splice(0, 5)
  } else if (d) {
    return d.splice(0, 5)
  } else if (h) {
    return h.splice(0, 5)
  } else {
    return undefined
  }
}

function hasStraight(hand, communitycards) {
  // for straights we have 2 rank tables - A is highest and A is lowest
  rankTable1 = [
    "A",
    "K",
    "Q",
    "J",
    "T",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2"
  ]
  rankTable2 = [
    "K",
    "Q",
    "J",
    "T",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
    "A"
  ]

  function straight(rankTable) {
    // console.log();
    let cards = hand.concat(communitycards)
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

    function rank(card, rankTable) {
      return rankTable.indexOf(card[0])
    }

    // console.log('sorted');
    // console.log(cards);


    let straight = []
    for (var i = 0; i < 3; i++) {
      if (rank(cards[i], rankTable) + 1 == rank(cards[i + 1], rankTable) &&
        rank(cards[i + 1], rankTable) + 1 == rank(cards[i + 2], rankTable) &&
        rank(cards[i + 2], rankTable) + 1 == rank(cards[i + 3], rankTable) &&
        rank(cards[i + 3], rankTable) + 1 == rank(cards[i + 4], rankTable)
      ) {
        // console.log('found straigt');
        straight.push([
          cards[i],
          cards[i + 1],
          cards[i + 2],
          cards[i + 3],
          cards[i + 4]
        ])
      }
    }

    if (!Array.isArray(straight)) {
      return false
    } else {
      return straight[0]
    }
  }


  let a = straight(rankTable1)
  let b = straight(rankTable2)

  if (a || b)
    if (a) {
      return a
    }
  else {
    return b
  }



}

function hasThreeOfaKind(hand, communitycards) {
  rankTable = [
    "A",
    "K",
    "Q",
    "J",
    "T",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2"
  ]

  //get all card ranks:
  let cards = hand.concat(communitycards)

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
  let threeOfaKind = []
  for (var i = 0; i < cards.length; i++) {
    if (i + 1 == cards.length) { //in the next if(){} we are checking if the NEXT element is the same, we have to break if we are on the last element
      // console.log('fuck');
      break;
    } else if (i + 2 == cards.length) { //in the next if(){} we are checking if the NEXT+1 element is the same, we have to break if we are on the last element
      // console.log('fuck');
      break;
    }

    if (cards[i + 1][0] == cards[i][0] & cards[i + 2][0] == cards[i][0]) {
      // console.log('found match' + cards[i][0]);
      threeOfaKind.push([
        cards[i],
        cards[i + 1],
        cards[i + 2]
      ])
    }
  }
  // console.log(pairs);

  if (!Array.isArray(threeOfaKind) || threeOfaKind.length != 1) {
    return false
  } else {
    restOftheHand = []
    for (var i = 0; i < cards.length; i++) {

      if (threeOfaKind[0][0] == cards[i] || threeOfaKind[0][1] == cards[i] || threeOfaKind[0][2] == cards[i]) {
        // restOftheHand.push(cards[i])
      } else {
        restOftheHand.push(cards[i])
      }
    }


    return [threeOfaKind[0], restOftheHand[0], restOftheHand[1]]
  }
}

function hasTwoPairs(hand, communitycards) {
  rankTable = [
    "A",
    "K",
    "Q",
    "J",
    "T",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2"
  ]

  //get all card ranks:
  let cards = hand.concat(communitycards)

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
      pairs.push([
        cards[i],
        cards[i + 1]
      ])
    }
  }
  // console.log(pairs);

  if (!Array.isArray(pairs) || pairs.length != 2) {
    return false
  } else {
    restOftheHand = []
    for (var i = 0; i < cards.length; i++) {

      // console.log('===================================================');
      // console.log("cards[i] " + cards[i]);
      // console.log('pairs[0][0] ' + pairs[0][0] );
      // console.log('pairs[0][1] ' + pairs[0][1] );
      // console.log('pairs[0][0] ' + pairs[1][0] );
      // console.log('pairs[0][1] ' + pairs[1][1] );
      // console.log('pairs[0][0] != cards[i] ' + (pairs[0][0] != cards[i]) );
      // console.log('pairs[0][1] != cards[i] ' + (pairs[0][1] != cards[i]) );
      // console.log('pairs[1][0] != cards[i] ' + (pairs[1][0] != cards[i]) );
      // console.log('pairs[1][1] != cards[i] ' + (pairs[1][1] != cards[i]) );
      if (pairs[0][0] == cards[i] || pairs[0][1] == cards[i] || pairs[1][0] == cards[i] || pairs[1][1] == cards[i]) {
        // restOftheHand.push(cards[i])
      } else {
        restOftheHand.push(cards[i])
      }
      // if (pairs[1][0] != cards[i] || pairs[1][1] != cards[i]) {
      //   restOftheHand.push(cards[i])
      // }

    }
    // console.log(restOftheHand);
    // console.log(restOftheHand.splice(0,3));
    // return [pair, restOftheHand]
    return [pairs[0], pairs[1], restOftheHand[0]]
  }

}

function hasPair(hand, communitycards) {
  rankTable = [
    "A",
    "K",
    "Q",
    "J",
    "T",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2"
  ]

  //get all card ranks:
  let cards = hand.concat(communitycards)

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
      pairs.push([
        cards[i],
        cards[i + 1]
      ])
    }
  }

  // console.log(pairs);

  if (!Array.isArray(pairs) || pairs.length != 1) {
    // TODO: do we want to return "pairs" even if the hand doesnt qualify for 1 pair?????????????!!!!!! its handy for fullHouse
    if (pairs.length > 1) {
      return pairs;
    }
    else {
      return undefined;
    }
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
    return [
      pairs[0], restOftheHand[0], restOftheHand[1], restOftheHand[2]
    ]
  }
}


function setup() {
  g = new Game();
  g.table.seatPlayer(new Player(), 0);
  // g.table.seatPlayer(new Player(), 1);
  g.table.dealCards();
  g.table.dealFlop();
  g.table.dealTurn();
  g.table.dealRiver();
}


// console.log(hasPair(["Qc", "Ah"], ["Jc", "8d", "9h", "2c", "2s"]));
// console.log(hasPair(["Qc", "Jh"], ["Jc", "8d", "9h", "3s", "2s"]));
// console.log(hasPair(["Qc", "Jh"], ["Jc", "8d", "8h", "8s", "Qs"]));
//
// console.log(hasTwoPairs(["Qc", "Jh"], ["Jc", "9d", "9h", "7s", "2s"]));
// // console.log(hasTwoPairs(["Qc", "9d"], ["9h", "Jh", "Jc", "7s", "2s"]));
//
// console.log(hasThreeOfaKind(["5c", "Jh"], ["4s", "2d", "Kh", "Kd", "Ks"]));


// console.log(hasStraight(["2d", "3h"], ["4c", "Td", "7h", "Ad", "5c"]));
// console.log(hasStraight(["Ks", "Jh"], ["Tc", "2d", "7h", "Ad", "Qc"]));

// console.log(hasStraight(["8s", "9h"], ["Tc", "2d", "7h", "Ad", "6c"]));
// console.log(hasStraight(["8s", "9h"], ["Tc", "2d", "7h", "2c", "6c"]));
// console.log(hasStraight(["8s", "9h"], ["Tc", "Kh", "7h", "Ah", "6c"]));

// console.log(hasFlush(["Ts", "9c"], ["3c", "Js", "5s", "2d", "2s"]));
// console.log(hasFlush(["Th", "9h"], ["3c", "Jh", "5h", "2d", "2h"]));
// console.log(hasFlush(["Td", "9d"], ["3d", "Jd", "5d", "2c", "2d"]));
// console.log(hasFlush(["Ts", "9s"], ["3c", "Js", "5s", "2d", "2s"]));

// console.log(hasFullhouse(["8s", "9h"], ["8c", "8d", "7h", "Ah", "5c"]));
// console.log(hasFullhouse(["Qc", "Jh"], ["Jc", "8d", "8h", "8s", "Qs"]));
// console.log(hasFullhouse(["8s", "2h"], ["8c", "8d", "7h", "2s", "9c"]));   // not OK....// BUG: returns: [ [ '8s', '8c', '8d' ], [ '8s', '8c' ] ]


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

module.exports = {
  hasPair,
  hasTwoPairs,
  hasThreeOfaKind,
  hasStraight
};
