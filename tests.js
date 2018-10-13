const g = require('./g');

const cardTypes = {
  highCard: ["Qh", "Ts", "5d", "2h", "8s", "3h", "7d"],
  pair: ["Qc", "Jh", "Jc", "8d", "9h", "3s", "2s"],
  twoPairs: ["Ah", "As", "2d", "2h", "5c", "Td", "7d"],
  threeOfaKind: ["Kd", "Jh", "Ks", "Kh", "2d", "5c", "4s"],
  straight: ["8s", "9h", "Tc", "2d", "7h", "Ad", "6c"],
  flush: ["Ts", "9s", "3c", "Js", "5s", "2d", "2s"],
  fullHouse: ["", "", "", "", "", "", ""],
  fourOfaKind: ["", "", "", "", "", "", ""],
  straightFlush: ["", "", "", "", "", "", ""],
  royalFlush: ["", "", "", "", "", "", ""]
}


// returns array of hand and community cards [hand,communitycards]
function prepare(cardType) {
  var temp = cardType
  var tempH = temp.splice(0,2)
  return [temp,tempH]
}

for (var type in cardTypes) {
  if (cardTypes.hasOwnProperty(type)) {
    prep = prepare(cardTypes[type])
    // TODO: here I check all the types
    console.log(type + "              " + g.hasPair(prep[0], prep[1]));
    // console.log(type + "              " + g.hasTwoPairs(prep[0], prep[1]));
    // console.log(type + "              " + g.hasTreeOfaKind(prep[0], prep[1]));
    // .
    // .
    // .

// console.log(g.hasPair(prep[0], prep[1]));
  }
}


//for each cardTypes .... prepare and run the check
// prep = prepare(cardTypes.highCard)
// console.log('High card: ' + g.hasPair(prep[0], prep[1]));
//
// prep = prepare(cardTypes.pair)
// console.log('Pair: ' + g.hasPair(prep[0], prep[1]));
