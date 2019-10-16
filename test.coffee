objprint = require './index.coffee'
_ = require 'lodash'

exports.simple = (test) ->
	obj = [
		"First Name": 'John'
		"Last Name": 'Smith'
		alive: true
		"net.worth": 1199
		age: 22
		How_Many_Cats_Owned: 2
		zip: '00000'
		# dob: new Date 'Tue Apr 2 1946 20:41:37 GMT-0400 (EDT)'
		dob: new Date '1946-04-02T00:00:00.000Z'
	,
		"First Name": 'Buckaroo'
		"Last Name": 'Banzai'
		alive: false
		age: 4319
		"net.worth": 100000222.44
		How_Many_Cats_Owned: 1
		zip: '12345'
		# dob: new Date 'Tue Dec 25 1957 20:41:37 GMT-0400 (EDT)'
		dob: new Date '1957-12-25T00:00:00.000Z'
	]
	options =
		longdateformat: true
		# using the "numeral" NPM package. See that documentation for formatting details
		numberformat:
			"net.worth": '$ 0,0.00'
			age: '0,0'
	teststr = """
\n┌────────────┬───────────┬───────┬──────────────────┬───────┬───────┬───────┬──────────────────────┐
│            │           │       │                  │       │  How  │       │                      │
│            │           │       │                  │       │ Many  │       │                      │
│            │           │       │       net        │       │ Cats  │       │                      │
│ First Name │ Last Name │ alive │      worth       │  age  │ Owned │  zip  │         dob          │
├────────────┼───────────┼───────┼──────────────────┼───────┼───────┼───────┼──────────────────────┤
│ John       │ Smith     │ true  │       $ 1,199.00 │    22 │     2 │ 00000 │ 04/01/1946  07:00 pm │
│ Buckaroo   │ Banzai    │ false │ $ 100,000,222.44 │ 4,319 │     1 │ 12345 │ 12/24/1957  07:00 pm │
└────────────┴───────────┴───────┴──────────────────┴───────┴───────┴───────┴──────────────────────┘
  (2 rows returned)\n
"""

	actualstr = objprint.format obj, options
	actualAr = actualstr.split '\n'
	testAr = teststr.split '\n'
	for str, i in actualAr
		# test trimmed strings
		test.equal _.trim(testAr[i]), _.trim(actualAr[i])

	console.log actualstr
	# test.equal teststr, actualstr

	teststr = """
\n┌────────────┬───────────┬───────┬──────────────────┬───────┬───────┬───────┬──────────────────────┐
                                                               How
                                                              Many
                                         net                  Cats
  First Name   Last Name   alive        worth          age    Owned    zip            dob
├────────────┼───────────┼───────┼──────────────────┼───────┼───────┼───────┼──────────────────────┤
  John         Smith       true          $ 1,199.00      22       2   00000   04/01/1946  07:00 pm
  Buckaroo     Banzai      false   $ 100,000,222.44   4,319       1   12345   12/24/1957  07:00 pm
└────────────┴───────────┴───────┴──────────────────┴───────┴───────┴───────┴──────────────────────┘
  (2 rows returned)\n
"""

	options =
		longdateformat: true
		spaceDivider: true
		numberformat:
			"net.worth": '$ 0,0.00'
			age: '0,0'
	actualstr = objprint.format obj, options
	actualAr = actualstr.split '\n'
	testAr = teststr.split '\n'
	for str, i in actualAr
		# test trimmed strings
		test.equal _.trim(testAr[i]), _.trim(actualAr[i])

	console.log actualstr

	teststr = """
\n┌────────────┬───────────┬──────────────────┬───────┬───────┬───────┬──────────────────────┐
│            │           │                  │       │  How  │       │                      │
│            │           │                  │       │ Many  │       │                      │
│            │           │       net        │       │ Cats  │       │                      │
│ First Name │ Last Name │      worth       │  age  │ Owned │  zip  │         dob          │
├────────────┼───────────┼──────────────────┼───────┼───────┼───────┼──────────────────────┤
│ John       │ Smith     │       $ 1,199.00 │    22 │     2 │ 00000 │ 04/01/1946  07:00 pm │
│ Buckaroo   │ Banzai    │ $ 100,000,222.44 │ 4,319 │     1 │ 12345 │ 12/24/1957  07:00 pm │
└────────────┴───────────┴──────────────────┴───────┴───────┴───────┴──────────────────────┘
  (2 rows returned)\n
"""

	options =
		longdateformat: true
		excludeColumns: ['alive']
		numberformat:
			"net.worth": '$ 0,0.00'
			age: '0,0'
	actualstr = objprint.format obj, options
	actualAr = actualstr.split '\n'
	testAr = teststr.split '\n'
	for str, i in actualAr
		# test trimmed strings
		test.equal _.trim(testAr[i]), _.trim(actualAr[i])

	console.log actualstr


	test.done()


exports.parseTable = (test) ->
	tableText = """
	# this is a comment
	# ignores blank lines, and blank table rows

	|------|-----------|------|
	| col1 | strHeader | col3 |
	|------|-----------|------|
	|    1 | hello     |   22 |
	|    2 | world     |    4 |
	|      |           |      |
	|------|-----------|------|
	"""

	expectedAr = [
		col1: '1'
		strHeader: 'hello'
		col3: '22'
	,
		col1: '2'
		strHeader: 'world'
		col3: '4'
	]

	ar = objprint.parse tableText
	test.deepEqual ar, expectedAr

	test.done()


exports.multiLine = (test) ->
	obj = [
		firstname: 'George'
		lastname: 'Washington'
		age: 67
		alive: false
		description: "George Washington was an American political leader, military general, statesman, and Founding Father, who also served as the first President of the United States from 1789 to 1797.\nWashington commanded Patriot forces in the new nation's vital American Revolutionary War, and led them to victory over the British."
	,
		firstname: 'Buckaroo'
		lastname: 'Banzai'
		alive: false
		age: 4319
		description: "Buckaroo Banzai is caught with his trusted allies, the Hong Kong Cavaliers, in a battle to the death between evil red aliens and good black aliens from Planet 10.\nLed by demonic dictator John Whorfin, who has taken over the body of Italian scientist Dr. Emilio Lizardo, the aliens try to get the Overthruster back from Buckaroo Banzai."
	]
	teststr = """
\n┌────────────┬────────────┬──────┬───────┬─────────────────────────────────────────────────────────────┐
│ First Name │ Last Name  │ age  │ alive │                         description                         │
├────────────┼────────────┼──────┼───────┼─────────────────────────────────────────────────────────────┤
│ George     │ Washington │   67 │ false │ George Washington was an American political leader,         │
│            │            │      │       │    military general, statesman, and Founding Father, who    │
│            │            │      │       │    also served as the first President of the United States  │
│            │            │      │       │    from 1789 to 1797.                                       │
│            │            │      │       │ Washington commanded Patriot forces in the new nation's     │
│            │            │      │       │    vital American Revolutionary War, and led them to        │
│            │            │      │       │    victory over the British.                                │
│ Buckaroo   │ Banzai     │ 4319 │ false │ Buckaroo Banzai is caught with his trusted allies, the Hong │
│            │            │      │       │    Kong Cavaliers, in a battle to the death between evil    │
│            │            │      │       │    red aliens and good black aliens from Planet 10.         │
│            │            │      │       │ Led by demonic dictator John Whorfin, who has taken over    │
│            │            │      │       │    the body of Italian scientist Dr. Emilio Lizardo, the    │
│            │            │      │       │    aliens try to get the Overthruster back from Buckaroo    │
│            │            │      │       │    Banzai.                                                  │
└────────────┴────────────┴──────┴───────┴─────────────────────────────────────────────────────────────┘
  (2 rows returned)\n
"""

	options =
		colMaxlen: 60
		altHeaders:
			firstname: 'First Name'
			lastname: 'Last Name'

	actualstr = objprint.format obj, options
	actualAr = actualstr.split '\n'
	testAr = teststr.split '\n'
	for str, i in actualAr
		# test trimmed strings
		test.equal _.trim(testAr[i]), _.trim(actualAr[i])

	console.log actualstr
	test.done()


# test vertical layout
exports.vertical = (test) ->
	obj = [
		textid: 100
		text: "Fourscore and seven years ago our fathers brought forth, on this continent, a new nation, conceived in liberty, and dedicated to the proposition that all men are created equal."
		update_time: "2019-10-14T23:17:00.000Z"
	,
		textid: 101
		text: "Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived, and so dedicated, can long endure."
		update_time: "2019-10-14T23:19:00.000Z"
	,
		textid: 102
		text: "We are met on a great battle-field of that war."
		update_time: "2019-10-16T00:41:00.000Z"
	,
		textid: 103
		text: "We have come to dedicate a portion of that field, as a final resting-place for those who here gave their lives, that that nation might live."
		update_time: "2019-10-16T00:43:00.000Z"
	]
	teststr = """
\n┌───────────────┬────────────────────────────────────────────────────────────────────────────────┐
│    Column     │                                     Values                                     │
├───────────────┼────────────────────────────────────────────────────────────────────────────────┤
│       textid: │ 100                                                                            │
│         text: │ Fourscore and seven years ago our fathers brought forth, on this continent, a  │
│               │    new nation, conceived in liberty, and dedicated to the proposition that all │
│               │    men are created equal.                                                      │
│  update_time: │ 2019-10-14T23:17:00.000Z                                                       │
├───────────────┼────────────────────────────────────────────────────────────────────────────────┤
│       textid: │ 101                                                                            │
│         text: │ Now we are engaged in a great civil war, testing whether that nation, or any   │
│               │    nation so conceived, and so dedicated, can long endure.                     │
│  update_time: │ 2019-10-14T23:19:00.000Z                                                       │
├───────────────┼────────────────────────────────────────────────────────────────────────────────┤
│       textid: │ 102                                                                            │
│         text: │ We are met on a great battle-field of that war.                                │
│  update_time: │ 2019-10-16T00:41:00.000Z                                                       │
├───────────────┼────────────────────────────────────────────────────────────────────────────────┤
│       textid: │ 103                                                                            │
│         text: │ We have come to dedicate a portion of that field, as a final resting-place for │
│               │    those who here gave their lives, that that nation might live.               │
│  update_time: │ 2019-10-16T00:43:00.000Z                                                       │
└───────────────┴────────────────────────────────────────────────────────────────────────────────┘
  (4 rows returned)\n
"""

	options =
		vertical: true
		colMaxlen: 80

	actualstr = objprint.format obj, options
	actualAr = actualstr.split '\n'
	testAr = teststr.split '\n'
	for str, i in actualAr
		# test trimmed strings
		test.equal _.trim(testAr[i]), _.trim(actualAr[i])

	console.log actualstr
	test.done()