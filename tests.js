const g = require('./g');



tests = [
  {
    "holeCards": [['7c','4h'],['Qs','8h'],['Ad','Jh']],
    "communitycards": ['5d','3c','Td','2s','9h'],
    "expectedWinner": 2,
    "expectedWinningHand": ['Ad','Jh','Td','9h','5d']
  }


]


// console.log(g.getWinner(tests[0].holeCards,tests[0].communitycards));
// console.log(g.getWinner(tests[0].holeCards,tests[0].communitycards) == tests[0].expectedWinner);
//this is a boilerplate for unit testing the getWinner function
