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
    // console.log(results);
    return results;
  }
}

function hasStraightFlush(hand, communitycards) {
  // flush = hasFlush(hand, communitycards);
  straight = hasStraight(hand, communitycards);

  // console.log(hand + "," + communitycards);
  // console.log(flush);
  // console.log(straight);
  if (straight) {
    flush = hasFlush([], straight)
    // console.log('------------------> ' + flush);
    if (flush) {
      if (flush[0][0] == "A" && flush[1][0] != "K") {
        //we neeed to move the A at the end of the array
        flush_new = flush.splice(1,5)
        flush_new[4] = flush[0]
        // console.log(flush_new);
        return flush_new;
      }
      else {
        return flush;
      }
    }
    return false
  }
  return false;
}

function hasFourOfaKind(hand, communitycards) {
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
  let fourOfaKind = []
  for (var i = 0; i < cards.length; i++) {
    if (i + 1 == cards.length) { //in the next if(){} we are checking if the NEXT element is the same, we have to break if we are on the last element
      // console.log('fuck');
      break;
    } else if (i + 2 == cards.length) { //in the next if(){} we are checking if the NEXT+1 element is the same, we have to break if we are on the last element
      // console.log('fuck');
      break;
    } else if (i + 3 == cards.length) {
      break;
    }


    if (cards[i + 1][0] == cards[i][0] && cards[i + 2][0] == cards[i][0] && cards[i + 3][0] == cards[i][0]) {
      // console.log('found match' + cards[i][0]);
      fourOfaKind.push([
        cards[i],
        cards[i + 1],
        cards[i + 2],
        cards[i + 3]
      ])
    }
  }
  // console.log(pairs);

  if (!Array.isArray(fourOfaKind) || fourOfaKind.length != 1) {
    return false
  } else {
    restOftheHand = []
    for (var i = 0; i < cards.length; i++) {

      if (fourOfaKind[0][0] == cards[i] || fourOfaKind[0][1] == cards[i] || fourOfaKind[0][2] == cards[i] || fourOfaKind[0][3] == cards[i]) {
        // restOftheHand.push(cards[i])
      } else {
        restOftheHand.push(cards[i])
      }
    }


    return [fourOfaKind[0], restOftheHand[0]]
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
      return false;
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
      return false;
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
    return false
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


    //we need to remove "duplicates" (pairs) otherwise the for loop below will not detect straight correctly
    //if the straight contains a pair, for example 6,5,4,3,3,2 ...
    cards_new = [];
    for (var i = 0; i < cards.length; i++) {
      if (!cards[i+1]) {
        cards_new.push(cards[i]);
        break;
      }
      if (cards[i][0] != cards[i+1][0]) {
        cards_new.push(cards[i]);
      }
    }



    let straight = []
    for (var i = 0; i < 3; i++) {
      if (!cards_new[i + 4] || !cards_new[i+3]) {
        break;
      }
      if (rank(cards_new[i], rankTable) + 1 == rank(cards_new[i + 1], rankTable) &&
        rank(cards_new[i + 1], rankTable) + 1 == rank(cards_new[i + 2], rankTable) &&
        rank(cards_new[i + 2], rankTable) + 1 == rank(cards_new[i + 3], rankTable) &&
        rank(cards_new[i + 3], rankTable) + 1 == rank(cards_new[i + 4], rankTable)
      ) {
        // console.log('found straight');
        straight.push([
          cards_new[i],
          cards_new[i + 1],
          cards_new[i + 2],
          cards_new[i + 3],
          cards_new[i + 4]
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
  // console.log('a: ' + a);
  let b = straight(rankTable2)
  // console.log('b: ' + b);

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

    // console.log(restOftheHand);
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

  if (!Array.isArray(pairs) || pairs.length <= 1) {
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
      return false;
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

//this function return the hand using the helper functons hasPair,hasStraight,etc.
function hasHand(hand, communitycards) {
  // console.log('------------------------------------------');
  // console.log(hand + ',' + communitycards);
  //we start evaluating from the top rankings...
  if (h = hasStraightFlush(hand,communitycards)) {
    return ['straight flush',8,h];
  }
  else if (h = hasFourOfaKind(hand, communitycards)) {
    return ['four of a kind',7,h];
  }
  else if (h = hasFullhouse(hand, communitycards)) {
    return ['full house',6,h];
  }
  else if (h = hasFlush(hand, communitycards)) {
    return ['flush',5,h];
  }
  else if (h = hasStraight(hand, communitycards)) {
    return ['straight',4,h];
  }
  else if (h = hasThreeOfaKind(hand, communitycards)) {
    return ['three of a kind',3,h];
  }
  else if (h = hasTwoPairs(hand, communitycards)) {
    return ['two pairs',2,h];
  }
  else if (h = hasPair(hand, communitycards)) {
    return ['pair',1,h];
  }
  else {
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
    });
    return ['high card',0,cards.splice(0,5)];
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

function handEvaluation(count) {
  for (var i = 0; i < count; i++) {
    deck = new Deck();
    deck.shuffle()
    a = deck.deal(2)
    b = deck.deal(5)
    console.log('==============================================================');
    console.log(a + ',' + b );
    console.log(hasHand(a ,b));
  }
}

// handEvaluation(30)

function getWinner(holeCards, communitycards) {
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

  function rank(card, rankTable) {
    return rankTable.indexOf(card[0])
  }

  //holeCards is an array containing arrays of hole cards of individual playes
  //function returns position of player who won or positions of playes who are splitting the pot
  hasHandResults = []
  for (var i = 0; i < holeCards.length; i++) {
    hasHandResults.push(hasHand(holeCards[i], communitycards))
  }
  let hasHandResultsSorted = hasHandResults.concat(); //copy the array
  hasHandResultsSorted.sort(function (a, b) {
      if (a[1] < b[1]) {
        return 1;
      }
      else if (a[1] > b[1]) {
        return -1;
      }
      else {
        return 0;
      }
  })
  console.log(hasHandResults);
  console.log(hasHandResultsSorted);

  if (hasHandResultsSorted[0][1] != hasHandResultsSorted[1][1]) {
    return hasHandResults.indexOf(hasHandResultsSorted[0])
  }
  else {
    //here we need to start comparing hands with equal ranking...

    //get the equal ranks hands:
    equalRankHands = []
    for (var i = 0; i < hasHandResultsSorted.length; i++) {
      if (hasHandResultsSorted[i][1] == hasHandResultsSorted[0][1]) {
        equalRankHands.push(hasHandResultsSorted[i])
      }
    }
    // console.log(equalRankHands);
    //compare hands based on the ranks
    switch (equalRankHands[0][1]) {
      case 0:
        //high card
        // index = 0
        // for (var i = 0; i < equalRankHands.length; i++) {
        //   equalRankHands[i]
        // }

        break;
      case 1:

        break;
      case 2:

        break;
      case 3:

        break;
      case 4:

        break;
      case 5:

        break;
      case 6:

        break;
      case 7:

        break;
      case 8:

        break;

      default:

    }










    //SPLIT PROCEDURE
    // split = [];
    // split.push(hasHandResultsSorted[0])
    // for (var i = 0; i < hasHandResultsSorted.length; i++) {
    //   if (!hasHandResultsSorted[i + 1]) {
    //     break;
    //   }
    //   if (hasHandResultsSorted[i][1] == hasHandResultsSorted[i + 1][1]) {
    //     split.push(hasHandResultsSorted[i + 1])
    //   }
    // }
    // return split;
  }
}

// console.log(getWinner([['6c','4h'],['Ts','5h'],['Ad','Jh'],['4d','Th']],['5d','3c','Td','2s','Ah']));
console.log(getWinner([['Ad','Jh'],['9d','Ah']],['5d','3c','Td','2s','8h']));




function statProof(tries) {
  //statistical proof of correct rankings
  //generate [tries] hands and count occurence of the hands
  counts = [0,0,0,0,0,0,0,0,0]
  for (var i = 0; i < tries; i++) {
    deck = new Deck();
    deck.shuffle()
    // console.log(hasHand(deck.deal(2),deck.deal(5)));
    switch (hasHand(deck.deal(2),deck.deal(5))[1]) {
      case 0:
          // console.log('haha');
          counts[0]++;
        break;
      case 1:
          // console.log('hihi');
          counts[1]++;
        break;
      case 2:
          counts[2]++;
        break;
      case 3:
          counts[3]++;
        break;
      case 4:
          counts[4]++;
        break;
      case 5:
          counts[5]++;
        break;
      case 6:
          counts[6]++;
        break;
      case 7:
          counts[7]++;
        break;
      case 8:
          counts[8]++;
        break;
      default:
          console.log('ups!!!!!!!!!');
    }
  }
  console.log(tries + " hands simulated");
  console.log('TYPE           |OCCURENCE        |PERCENTAGE         |TOTAL   ');
  console.log('high card      |' + counts[0] + '              |' + counts[0]*100.0/tries + '%               |     ' + tries)
  console.log('pair           |' + counts[1] + '              |' + counts[1]*100.0/tries + '%               |     ' + tries)
  console.log('two pairs      |' + counts[2] + '              |' + counts[2]*100.0/tries + '%               |     ' + tries)
  console.log('three of a kind|' + counts[3] + '              |' + counts[3]*100.0/tries + '%               |     ' + tries)
  console.log('straight       |' + counts[4] + '              |' + counts[4]*100.0/tries + '%               |     ' + tries)
  console.log('flush          |' + counts[5] + '              |' + counts[5]*100.0/tries + '%               |     ' + tries)
  console.log('full house     |' + counts[6] + '              |' + counts[6]*100.0/tries + '%               |     ' + tries)
  console.log('four of a kind |' + counts[7] + '              |' + counts[7]*100.0/tries + '%               |     ' + tries)
  console.log('straight flush |' + counts[8] + '              |' + counts[8]*100.0/tries + '%               |     ' + tries)
}

// statProof(150000000)
// C:\Users\LENOVO\Documents\Projects\poker>node g.js
// 150000000 hands simulated
// TYPE           |OCCURENCE        |PERCENTAGE         |TOTAL
// high card      |26114155              |17.409436666666668%               |     150000000
// pair           |67091604              |44.727736%               |     150000000
// two pairs      |35542104              |23.694736%               |     150000000
// three of a kind|7278088              |4.852058666666666%               |     150000000
// straight       |5307236              |3.5381573333333334%               |     150000000
// flush          |4560394              |3.0402626666666666%               |     150000000
// full house     |3832713              |2.555142%               |     150000000
// four of a kind |252029              |0.16801933333333333%               |     150000000
// straight flush |21677              |0.014451333333333333%               |     150000000



// console.log(hasHand(['6c','5c'],['3h','2d','3s','Ac','4s']));
// console.log(hasStraight(['6c','5c'],['3h','2d','3s','Ac','4s']));
// console.log(hasFullhouse(['Qc','Kc'],['9h','Qd','7c','9d','Kd']));
// console.log(hasTwoPairs(['Qc','Kc'],['9h','Qd','7c','9d','Kd']));
// console.log(hasPair(['Qc','Kc'],['9h','Qd','7c','9d','Kd']));
// console.log(hasHand(["Qc", "9d"], ["9h", "Jh", "Jc", "7s", "2s"]));
// console.log(hasHand(["8s", "2h"], ["8c", "8d", "7h", "2s", "9c"]));
// console.log(hasHand(["8s", "8h"], ["2c", "7d", "Kh", "2s", "8c"]));
// console.log(hasHand(["Th", "Qh"], ["Jh", "Ah", "7c", "Kh", "5h"]));
// console.log(hasHand());
// console.log(hasHand());
// console.log(hasHand());
// console.log(hasHand());
// console.log(hasHand());
// console.log(hasHand());
// console.log(hasHand());


// console.log(hasPair(["Qc", "Ah"], ["Jc", "8d", "9h", "2c", "2s"]));
// console.log(hasPair(["Qc", "Jh"], ["Jc", "8d", "9h", "3s", "2s"]));
// console.log(hasPair(["Qc", "Jh"], ["Jc", "8d", "8h", "8s", "Qs"]));
//
// console.log(hasTwoPairs(["Qc", "Jh"], ["Jc", "9d", "9h", "7s", "2s"]));
// console.log(hasTwoPairs(["Qc", "9d"], ["9h", "Jh", "Jc", "7s", "2s"]));
//
// console.log(hasThreeOfaKind(["5c", "Jh"], ["4s", "2d", "Kh", "Kd", "Ks"]));


// console.log(hasStraight(["2d", "3h"], ["4c", "Td", "7h", "Ad", "5c"]));
// console.log(hasStraight(["Ks", "Jh"], ["Tc", "2d", "7h", "Ad", "Qc"]));

// console.log(hasStraight(["8s", "9h"], ["Tc", "2d", "7h", "Ad", "6c"]));
// console.log(hasStraight(["8s", "9h"], ["Tc", "2d", "7h", "2c", "6c"]));
// console.log(hasStraight(["Qs", "Qh"], ["Tc", "Kh", "7h", "Ah", "Jc"]));

// console.log(hasFlush(["Ts", "9c"], ["3c", "Js", "5s", "2d", "2s"]));
// console.log(hasFlush(["Th", "9h"], ["3c", "Jh", "5h", "2d", "2h"]));
// console.log(hasFlush(["Td", "9d"], ["3d", "Jd", "5d", "2c", "2d"]));
// console.log(hasFlush(["Ts", "9s"], ["3c", "Js", "5s", "2d", "2s"]));

// console.log(hasFullhouse(["8s", "9h"], ["8c", "8d", "7h", "Ah", "5c"]));
// console.log(hasFullhouse(["Qc", "Jh"], ["Jc", "8d", "8h", "8s", "Qs"]));
// console.log(hasFullhouse(["8s", "2h"], ["8c", "8d", "7h", "2s", "9c"]));

// console.log(hasFourOfaKind(["8s", "8h"], ["2c", "8d", "Kh", "2s", "8c"]));
// console.log(hasFourOfaKind(["Js", "Jh"], ["Tc", "Jd", "Kh", "2s", "Jc"]));
// console.log(hasFourOfaKind(["2s", "2h"], ["Ac", "2d", "Kh", "3s", "2c"]));
// console.log(hasFourOfaKind(["8s", "8h"], ["2c", "7d", "Kh", "2s", "8c"]));

// console.log(hasStraightFlush(["Th", "9h"], ["6h", "Ac", "7h", "2s", "8h"]));
// console.log(hasStraightFlush(["Th", "9h"], ["6s", "Ac", "7h", "2h", "8h"]));
// console.log(hasStraightFlush(["Th", "4h"], ["3h", "Ah", "7c", "2h", "5h"]));
// console.log(hasStraightFlush(["Th", "Qh"], ["Jh", "Ah", "7c", "Kh", "5h"]));

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
  Game,
  Table,
  Player,
  Deck,
  hasHand,
};
