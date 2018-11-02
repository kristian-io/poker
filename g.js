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


//example setup function that creates the game, seats the player deals hole cards,flop, turn, river
function setup() {
  g = new Game();
  g.table.seatPlayer(new Player(), 0);
  // g.table.seatPlayer(new Player(), 1);
  g.table.dealCards();
  g.table.dealFlop();
  g.table.dealTurn();
  g.table.dealRiver();
}

// manual hand evaluation for 'count' hands....
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
  //holeCards is an array containing arrays of hole cards of individual playes
  //function returns position of player who won or array of positions of playes who are splitting the pot
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

  function sortByRankByNthElement(input, n) {
    //input is array of arrays - 2d array - returns the same array sorted by Nth cards rank - usefull for comparing kickers
    let inputSorted = input.concat(); //copy the array
    inputSorted.sort(function (a, b) {
        // console.log('a= ', a);
        // console.log('a[0]= ', a[0]);
        // console.log('b= ', b);
        if (rank(a[n],rankTable) > rank(b[n],rankTable)) {
          return 1;
        }
        else if (rank(a[n],rankTable) < rank(b[n],rankTable)) {
          return -1;
        }
        else {
          return 0;
        }
    })
    return inputSorted;
  }


  function rank(card, rankTable) {
    return rankTable.indexOf(card[0])
  }


  hasHandResults = []   // array of hands in format ['pair', 1, [['Ks','Kh', ...]]] ORDER is preserved from input (holeCards)
  for (var i = 0; i < holeCards.length; i++) {
    hasHandResults.push(hasHand(holeCards[i], communitycards))
  }

  console.log('ALL HANDS:');
  console.log(hasHandResults);

  //we will also create a array containing the same order of hands without the description and hand category rank for easier lookup of hands later on
  //!!!!!!!!!!!this array will be used to lookup the winning hand!!!!!!!!!!!!!!!
  hasHandResultsSimplified = hasHandResults.concat();
  for (var i = 0; i < hasHandResults.length; i++) {
    hasHandResultsSimplified[i] = hasHandResults[i][2];
  }
  // console.log('simplified');
  // console.log(hasHandResultsSimplified);

  //sort it by the HAND category ranks
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
  // console.log(hasHandResults);
  // console.log(hasHandResultsSorted);

  // console.log('----------------------------------------');


  //as we have the hands sorted; we compare the hand category (high card/3ofakind...), if 2nd is not the same as 1st => 1st is the winner
  if (hasHandResultsSorted[0][1] != hasHandResultsSorted[1][1]) {
    // console.log('we have a winner');
    // we need to look it up in the hasHandResults array
    return hasHandResults.indexOf(hasHandResultsSorted[0])
  }
  else {
    //here we need to start comparing hands with equal ranking...

    //get the equal category hands:
    equalCategoryHands = []
    for (var i = 0; i < hasHandResultsSorted.length; i++) {
      if (hasHandResultsSorted[i][1] == hasHandResultsSorted[0][1]) {
        equalCategoryHands.push(hasHandResultsSorted[i])
      }
    }
    // console.log(equalCategoryHands);
    //compare hands based on the ranks


    //we look at the rank from the array of equalRankHands to determine the case: high card, pair, etc...
    switch (equalCategoryHands[0][1]) {
      case 0:
        // we have high cards

        // console.log(equalCategoryHands);
        // [ [ 'high card', 0, [ 'Kd', 'Jh', 'Td', '8h', '5d' ] ],
        // [ 'high card', 0, [ 'Kh', 'Js', 'Td', '8h', '5d' ] ],
        // [ 'high card', 0, [ 'Ad', 'Ks', 'Td', '8h', '5d' ] ] ]

        // lets get just the 2d array of hands
        hands = [] //will still keep the order as equalCategoryHands, meaning hands[i] == equalRankHands[i][2]
        for (var i = 0; i < equalCategoryHands.length; i++) {
          hands.push(equalCategoryHands[i][2]);
        }
        // console.log(hands);
        // [ [ 'Td', '9d', '8h', '5d', '4h' ],
        // [ 'Kh', 'Js', 'Td', '8h', '5d' ],
        // [ 'Ks', 'Td', '8h', '6d', '5d' ] ]

        //we will keep sorting the hands by Nth card and comparing until the winner is found;
        //if hand looses based on Nth card we will remove it and not consider it in the next comparision

        n = 0;
        sorted_temp = hands.concat()
        // console.log(sorted_temp);

        while (true) {
          // console.log('n ====================== ', n);
          //sort by Nth hand starting from 0
          sorted = sortByRankByNthElement(sorted_temp, n)
          // console.log('sorted by n= ', n);
          // console.log(sorted);
          //compare first 2 if they are not equal we have a winner
          if (sorted[0][n][0] != sorted[1][n][0]) {
            //we have a winner
            // console.log('we have a winner');
            return hasHandResultsSimplified.indexOf(sorted[0])
          }
          else {
            //otherwise we will only keep those who are equal based on Nth card
            sorted_temp = []
            for (var i = 0; i < sorted.length; i++) {
              if (sorted[0][n][0] == sorted[i][n][0]) {
                sorted_temp.push(sorted[i])
              }
            }
            // console.log('sorted after purging...');
            // console.log(sorted_temp);
          }
          //if we are not at the end, continue
          if (n < sorted_temp[0].length -1) {
            n++;
          }
          else if (n == sorted_temp[0].length -1) {
            //we arived at the end...
            //hands that remained in sorted_temp are the splitters!!!
            // console.log('we have a split');
            // console.log(sorted_temp);
            splitters = []
            for (var i = 0; i < sorted_temp.length; i++) {
              splitters.push(hasHandResultsSimplified.indexOf(sorted_temp[i]))
            }
            return splitters;
          }
        }

      case 1:
        // we have one pair cards

        // console.log(equalCategoryHands);
        // [ [ 'pair', 1, [ [Array], 'Kh', 'Td', '8h' ] ],
        //   [ 'pair', 1, [ [Array], '8h', '6d', '4d' ] ],
        //   [ 'pair', 1, [ [Array], '8h', '6d', '5s' ] ],
        //   [ 'pair', 1, [ [Array], '8h', '6d', '5h' ] ] ]

        // lets get just the 2d array of hands
        hands = [] //will still keep the order as equalCategoryHands, meaning hands[i] == equalRankHands[i][2]
        for (var i = 0; i < equalCategoryHands.length; i++) {
          hands.push(equalCategoryHands[i][2]);
        }
        // console.log(hands);
        // [ [ [ '2s', '2s' ], 'Kh', 'Td', '8h' ],
        //   [ [ 'Tc', 'Td' ], '8h', '6d', '4d' ],
        //   [ [ 'Ts', 'Td' ], '8h', '6d', '5s' ],
        //   [ [ 'Th', 'Td' ], '8h', '6d', '5h' ] ]

        //we first need to decide based on the pairs
        let handsSortedByPairRank = hands.concat(); //copy the array
        handsSortedByPairRank.sort(function (a, b) {
            // console.log('a= ', a);
            // console.log('a[0]= ', a[0]);
            // console.log('b= ', b);
            if (rank(a[0][0][0],rankTable) > rank(b[0][0][0],rankTable)) {
              return 1;
            }
            else if (rank(a[0][0][0],rankTable) < rank(b[0][0][0],rankTable)) {
              return -1;
            }
            else {
              return 0;
            }
        })
        // console.log(handsSortedByPairRank);
        // [ [ [ 'Tc', 'Td' ], '8h', '6d', '4d' ],
        //   [ [ 'Ts', 'Td' ], '8h', '6d', '5s' ],
        //   [ [ 'Th', 'Td' ], '8h', '6d', '5h' ],
        //   [ [ '2s', '2s' ], 'Kh', 'Td', '8h' ] ]
        if (handsSortedByPairRank[0][0][0][0] != handsSortedByPairRank[1][0][0][0]) {
          //we have a winner
          return hasHandResultsSimplified.indexOf(handsSortedByPairRank[0])
        }
        else {
          //we will keep just the hands that have the same pair rank as the 0th hand
          hands_temp = []
          for (var i = 0; i < handsSortedByPairRank.length; i++) {
            if (handsSortedByPairRank[0][0][0][0] == handsSortedByPairRank[i][0][0][0]) {
              hands_temp.push(handsSortedByPairRank[i])
            }
          }
        }
        // console.log(hands_temp);
        // [ [ [ 'Tc', 'Td' ], '8h', '6d', '4d' ],
        //   [ [ 'Ts', 'Td' ], '8h', '6d', '5s' ],
        //   [ [ 'Th', 'Td' ], '8h', '6d', '5h' ] ]

        //we will keep sorting the hands by Nth card and comparing until the winner is found;
        //if hand looses based on Nth card we will remove it and not consider it in the next comparision
        n = 1;
        sorted_temp = hands_temp.concat()
        // console.log(sorted_temp);

        while (true) {
          // console.log('n ====================== ', n);
          //sort by Nth hand starting from 0
          sorted = sortByRankByNthElement(sorted_temp, n)
          // console.log('sorted by n= ', n);
          // console.log(sorted);
          //compare first 2 if they are not equal we have a winner
          if (sorted[0][n][0] != sorted[1][n][0]) {
            // we have a winner
            // console.log('we have a winner');
            return hasHandResultsSimplified.indexOf(sorted[0])
          }
          else {
            //otherwise we will only keep those who are equal based on Nth card
            sorted_temp = []
            for (var i = 0; i < sorted.length; i++) {
              if (sorted[0][n][0] == sorted[i][n][0]) {
                sorted_temp.push(sorted[i])
              }
            }
            // console.log('sorted after purging...');
            // console.log(sorted_temp);
          }
          //if we are not at the end, continue
          if (n < sorted_temp[0].length -1) {
            n++;
          }
          else if (n == sorted_temp[0].length -1) {
            //we arived at the end...
            //hands that remained in sorted_temp are the splitters!!!
            // console.log('we have a split');
            // console.log(sorted_temp);
            splitters = []
            for (var i = 0; i < sorted_temp.length; i++) {
              splitters.push(hasHandResultsSimplified.indexOf(sorted_temp[i]))
            }
            return splitters;
          }
        }

      case 2:
      // we have two pairs hands

      // console.log(equalCategoryHands);
      // [ [ 'two pairs', 2, [ [Array], [Array], 'Td' ] ],
      // [ 'two pairs', 2, [ [Array], [Array], 'Td' ] ],
      // [ 'two pairs', 2, [ [Array], [Array], 'Td' ] ],
      // [ 'two pairs', 2, [ [Array], [Array], 'Td' ] ] ]

      // lets get just the 2d array of hands
      hands = [] //will still keep the order as equalCategoryHands, meaning hands[i] == equalRankHands[i][2]
      for (var i = 0; i < equalCategoryHands.length; i++) {
        hands.push(equalCategoryHands[i][2]);
      }
      // console.log(hands);
      // [ [ [ '3s', '3c' ], [ '2h', '2s' ], 'Td' ],
      //   [ [ '6s', '6d' ], [ '2d', '2s' ], 'Td' ],
      //   [ [ '8h', '8h' ], [ '6c', '6d' ], 'Td' ],
      //   [ [ '8c', '8h' ], [ '6h', '6d' ], 'Td' ] ]


      //we first need to decide based on 1st pairs
      let handsSortedByFirstPairRank = hands.concat(); //copy the array
      handsSortedByFirstPairRank.sort(function (a, b) {
          // console.log('a= ', a);
          // console.log('a[0]= ', a[0]);
          // console.log('b= ', b);
          if (rank(a[0][0][0][0],rankTable) > rank(b[0][0][0][0],rankTable)) {
            return 1;
          }
          else if (rank(a[0][0][0][0],rankTable) < rank(b[0][0][0][0],rankTable)) {
            return -1;
          }
          else {
            return 0;
          }
      })

      // console.log('handsSortedByFirstPairRank');
      // console.log(handsSortedByFirstPairRank);

      //   [ [ [ '8h', '8h' ], [ '6c', '6d' ], 'Td' ],
      //   [ [ '8c', '8h' ], [ '6h', '6d' ], 'Td' ],
      //   [ [ '6s', '6d' ], [ '2d', '2s' ], 'Td' ],
      // [ [ '3s', '3c' ], [ '2h', '2s' ], 'Td' ] ]

      if (handsSortedByFirstPairRank[0][0][0][0] != handsSortedByFirstPairRank[1][0][0][0]) {
        //we have a winner
        return hasHandResultsSimplified.indexOf(handsSortedByFirstPairRank[0])
      }
      else {
        //we will keep just the hands equal by the 1st pair
        handsSortedByFirstPairRank_temp = []
        for (var i = 0; i < handsSortedByFirstPairRank.length; i++) {
          if (handsSortedByFirstPairRank[0][0][0][0] == handsSortedByFirstPairRank[i][0][0][0]) {
            handsSortedByFirstPairRank_temp.push(handsSortedByFirstPairRank[i])
          }
        }

        // console.log('handsSortedByFirstPairRank_temp');
        // console.log(handsSortedByFirstPairRank_temp);

        // now we can compare by the 2nd pair
        let handsSortedBySecondPairRank = handsSortedByFirstPairRank_temp.concat(); //copy the array
        handsSortedBySecondPairRank.sort(function (a, b) {
            // console.log('a= ', a);
            // console.log('a[1][0][0][0] ', a[1][0][0][0]);
            // console.log('b= ', b);
            if (rank(a[1][0][0][0],rankTable) > rank(b[1][0][0][0],rankTable)) {
              return 1;
            }
            else if (rank(a[1][0][0][0],rankTable) < rank(b[1][0][0][0],rankTable)) {
              return -1;
            }
            else {
              return 0;
            }
        })

        // console.log('handsSortedBySecondPairRank');
        // console.log(handsSortedBySecondPairRank);

        if (handsSortedBySecondPairRank[0][1][0][0] != handsSortedBySecondPairRank[1][1][0][0]) {
          //we have a winner
          return hasHandResultsSimplified.indexOf(handsSortedBySecondPairRank[0])
        }
        else {
          //we will keep just the hands equal by the 2nd pair
          handsSortedBySecondPairRank_temp = []
          for (var i = 0; i < handsSortedBySecondPairRank.length; i++) {
            if (handsSortedBySecondPairRank[0][1][0][0] == handsSortedBySecondPairRank[i][1][0][0]) {
              handsSortedBySecondPairRank_temp.push(handsSortedBySecondPairRank[i])
            }
          }

          // console.log('handsSortedBySecondPairRank_temp');
          // console.log(handsSortedBySecondPairRank_temp);

          //and finally we can compare them by the kickers... uff

          handsToCompareByKickers = handsSortedBySecondPairRank_temp.concat();
          //we need to sort them by the kickers
          handsToCompareByKickersSorted = sortByRankByNthElement(handsToCompareByKickers, 2)
          // console.log(handsToCompareByKickersSorted);

          //if there are any that equal the 1st then we have a split oterwise we have a winner
          if (handsToCompareByKickersSorted[0][2][0] != handsToCompareByKickersSorted[1][2][0]) {
            //we have a winner
            return hasHandResultsSimplified.indexOf(handsToCompareByKickersSorted[0])
          }
          else {
            //we nned to collect all the splittes
            splitters = []
            for (var i = 0; i < handsToCompareByKickersSorted.length; i++) {
              if (handsToCompareByKickersSorted[0][2][0] == handsToCompareByKickersSorted[i][2][0]) {
                splitters.push(handsToCompareByKickersSorted[i])
              }
            }

            // console.log('splitters');
            // console.log(splitters);

            splittersPosition = []
            //we just need to return the postion of the splitters
            for (var i = 0; i < splitters.length; i++) {
              splittersPosition.push(hasHandResultsSimplified.indexOf(splitters[i]))
            }
            return splittersPosition;
          }
        }
      }

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
  }
}

//mixed rank cards
// console.log(getWinner([['Kd','Jh'],['Ts','Kh'],['3s', '3d'],['Ad','9s']],['5d','3c','Td','2s','8h']));


//hight cards
// console.log(getWinner([['6c','4h'],['Ts','5h'],['Ad','Jh'],['4d','Th']],['5d','3c','Td','2s','Ah']));
// console.log(getWinner([['Kd','Jh'],['Js','Kh'],['Ks', 'Ad']],['5d','3c','Td','2s','8h']));
// console.log(getWinner([['9d','4h'],['Js','Kh'],['Ks', '6d']],['5d','3c','Td','2s','8h'])); //winner
// console.log(getWinner([['Kc','4c'],['4d','7c'],['6s','Kh'],['Ks', '6d']],['5d','3c','Td','2s','8h'])); // split

//pairs
// console.log(getWinner([['3s','Kh'],['4d','9s'],['Ks', 'Jh'],['As','9c'],['Kd','5h']],['6d','Th','Td','2s','8h']));
// console.log(getWinner([['2s','Kh'],['4d','Tc'],['5s', 'Ts'],['Th','5h'],['As','9c']],['6d','3c','Td','2s','8h']));
// console.log(getWinner([['4d','7c'],['6s','Kh'],['Ks', '6d']],['5d','3c','Td','2s','8h']));
// console.log(getWinner([['4d','7c'],['6s','Th']],['5d','3c','Td','2s','8h']));

// 2 pairs
// console.log(getWinner([['8d','2h'],['3s','2h'],['5s', '2s'],['6s','2d'],['8h','6c'],['8c','6h'],['As','9c']],['6d','3c','Td','2c','8s']));
console.log(getWinner([['Kd','7s'],['7c','4d'],['Kh','5s'],['Jh','3s']],['Tc','Ts','8d','8h','2c']));
// console.log(getWinner([['7c','4d'],['Th','2s'],['Td','7s'],['9s','8s']],['Tc','7s','8d','9h','2c']));
// console.log(getWinner([['7c','4d'],['Th','2s'],['9d','7s'],['9s','8s']],['Tc','7s','8d','9h','2c']));


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


// console.log(hasHand(['Ks', '6d'], ['5d','3c','Td','2s','8h']));

// console.log(hasPair(["Qc", "Ah"], ["Jc", "8d", "9h", "2c", "2s"]));
// console.log(hasHand(["Qc", "Jh"], ["Jc", "8d", "9h", "3s", "2s"]));
// console.log(hasPair(["Qc", "Jh"], ["Jc", "8d", "8h", "8s", "Qs"]));
//
// console.log(hasTwoPairs(["Qc", "Jh"], ["Jc", "9d", "9h", "7s", "2s"]));
// console.log(hasHand(["Qc", "9d"], ["9h", "Jh", "Jc", "7s", "2s"]));
//
// console.log(hasHand(["5c", "Jh"], ["4s", "2d", "Kh", "Kd", "Ks"]));


// console.log(hasStraight(["2d", "3h"], ["4c", "Td", "7h", "Ad", "5c"]));
// console.log(hasStraight(["Ks", "Jh"], ["Tc", "2d", "7h", "Ad", "Qc"]));

// console.log(hasStraight(["8s", "9h"], ["Tc", "2d", "7h", "Ad", "6c"]));
// console.log(hasHand(["8s", "9h"], ["Tc", "2d", "7h", "2c", "6c"]));
// console.log(hasStraight(["Qs", "Qh"], ["Tc", "Kh", "7h", "Ah", "Jc"]));

// console.log(hasFlush(["Ts", "9c"], ["3c", "Js", "5s", "2d", "2s"]));
// console.log(hasFlush(["Td", "9d"], ["3d", "Jd", "5d", "2c", "2d"]));
// console.log(hasHand(["Th", "9h"], ["3c", "Jh", "5h", "2d", "2h"]));
// console.log(hasFlush(["Ts", "9s"], ["3c", "Js", "5s", "2d", "2s"]));

// console.log(hasFullhouse(["8s", "9h"], ["8c", "8d", "7h", "Ah", "5c"]));
// console.log(hasHand(["Qc", "Jh"], ["Jc", "8d", "8h", "8s", "Qs"]));
// console.log(hasFullhouse(["8s", "2h"], ["8c", "8d", "7h", "2s", "9c"]));

// console.log(hasFourOfaKind(["8s", "8h"], ["2c", "8d", "Kh", "2s", "8c"]));
// console.log(hasFourOfaKind(["Js", "Jh"], ["Tc", "Jd", "Kh", "2s", "Jc"]));
// console.log(hasHand(["2s", "2h"], ["Ac", "2d", "Kh", "3s", "2c"]));
// console.log(hasHand(["8s", "8h"], ["2c", "7d", "Kh", "2s", "8c"]));

// console.log(hasStraightFlush(["Th", "9h"], ["6h", "Ac", "7h", "2s", "8h"]));
// console.log(hasStraightFlush(["Th", "9h"], ["6s", "Ac", "7h", "2h", "8h"]));
// console.log(hasHand(["Th", "4h"], ["3h", "Ah", "7c", "2h", "5h"]));
// console.log(hasStraightFlush(["Th", "Qh"], ["Jh", "Ah", "7c", "Kh", "5h"]));


// console.log(hasHand(['Ks', '6d'], ['5d','3c','Td','2s','8h']));           //hight card
// console.log(hasHand(["Qc", "Jh"], ["Jc", "8d", "9h", "3s", "2s"]));
// console.log(hasHand(["Qc", "9d"], ["9h", "Jh", "Jc", "7s", "2s"]));
// console.log(hasHand(["5c", "Jh"], ["4s", "2d", "Kh", "Kd", "Ks"]));
// console.log(hasHand(["8s", "9h"], ["Tc", "2d", "7h", "2c", "6c"]));       //...
// console.log(hasHand(["Th", "9h"], ["3c", "Jh", "5h", "2d", "2h"]));
// console.log(hasHand(["Qc", "Jh"], ["Jc", "8d", "8h", "8s", "Qs"]));
// console.log(hasHand(["2s", "2h"], ["Ac", "2d", "Kh", "3s", "2c"]));
// console.log(hasHand(["Th", "4h"], ["3h", "Ah", "7c", "2h", "5h"]));       // straight flush










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
  getWinner
};
