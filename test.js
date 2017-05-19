// Generated by IcedCoffeeScript 108.0.11
var objprint, _;

objprint = require('.');

_ = require('lodash');

exports.simple = function(test) {
  var actualAr, actualstr, i, obj, options, str, testAr, teststr, _i, _len;
  obj = [
    {
      "First Name": 'John',
      "Last Name": 'Smith',
      alive: true,
      "net.worth": 1199,
      age: 22,
      "How.Many.Cats.Owned": 2,
      zip: '00000',
      dob: new Date('Tue Apr 2 1946 20:41:37 GMT-0400 (EDT)')
    }, {
      "First Name": 'Buckaroo',
      "Last Name": 'Banzai',
      alive: false,
      age: 4319,
      "net.worth": 100000222.44,
      "How.Many.Cats.Owned": 1,
      zip: '12345',
      dob: new Date('Tue Dec 25 1957 20:41:37 GMT-0400 (EDT)')
    }
  ];
  options = {
    longdateformat: true,
    numberformat: {
      "net.worth": '$ 0,0.00',
      age: '0,0'
    }
  };
  teststr = "\n                                                            How\n                                                            Many\n                                 net                        Cats\nFirst Name   Last Name   alive   worth              age     Owned   zip     dob\n----------   ---------   -----   ----------------   -----   -----   -----   --------------------\nJohn         Smith       true          $ 1,199.00      22       2   00000   04/02/1946  08:41 pm\nBuckaroo     Banzai      false   $ 100,000,222.44   4,319       1   12345   12/25/1957  07:41 pm\n  (2 rows returned)\n";
  actualstr = objprint.format(obj, options);
  actualAr = actualstr.split('\n');
  testAr = teststr.split('\n');
  for (i = _i = 0, _len = actualAr.length; _i < _len; i = ++_i) {
    str = actualAr[i];
    test.equal(_.trim(testAr[i]), _.trim(actualAr[i]));
  }
  console.log(actualstr);
  return test.done();
};

exports.parseTable = function(test) {
  var ar, expectedAr, tableText;
  tableText = "# this is a comment\n# ignores blank lines, and blank table rows\n\n|------|-----------|------|\n| col1 | strHeader | col3 |\n|------|-----------|------|\n|    1 | hello     |   22 |\n|    2 | world     |    4 |\n|      |           |      |\n|------|-----------|------|";
  expectedAr = [
    {
      col1: '1',
      strHeader: 'hello',
      col3: '22'
    }, {
      col1: '2',
      strHeader: 'world',
      col3: '4'
    }
  ];
  ar = objprint.parse(tableText);
  test.deepEqual(ar, expectedAr);
  return test.done();
};
