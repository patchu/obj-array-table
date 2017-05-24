objprint = require '.'
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
		dob: new Date 'Tue Apr 2 1946 20:41:37 GMT-0400 (EDT)'
	,
		"First Name": 'Buckaroo'
		"Last Name": 'Banzai'
		alive: false
		age: 4319
		"net.worth": 100000222.44
		How_Many_Cats_Owned: 1
		zip: '12345'
		dob: new Date 'Tue Dec 25 1957 20:41:37 GMT-0400 (EDT)'
	]
	options =
		longdateformat: true
		# using the "numeral" NPM package. See that documentation for formatting details
		numberformat:
			"net.worth": '$ 0,0.00'
			age: '0,0'
	teststr = """
\n                                                            How
                                                            Many
                                 net                        Cats
First Name   Last Name   alive   worth              age     Owned   zip     dob
----------   ---------   -----   ----------------   -----   -----   -----   --------------------
John         Smith       true          $ 1,199.00      22       2   00000   04/02/1946  08:41 pm
Buckaroo     Banzai      false   $ 100,000,222.44   4,319       1   12345   12/25/1957  07:41 pm
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
