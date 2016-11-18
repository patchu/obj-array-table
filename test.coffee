objprint = require '.'
_ = require 'lodash'

exports.simple = (test) ->
	obj = [
		"First Name": 'John'
		"Last Name": 'Smith'
		alive: true
		"How.Many.Cats.Owned": 2
		zip: '00000'
		dob: new Date 'Tue Apr 2 1946 20:41:37 GMT-0400 (EDT)'
	,
		"First Name": 'Buckaroo'
		"Last Name": 'Banzai'
		alive: false
		"How.Many.Cats.Owned": 1
		zip: '12345'
		dob: new Date 'Tue Dec 25 1957 20:41:37 GMT-0400 (EDT)'
	]
	options =
		longdateformat: true
	teststr = """
\n                                 How
                                 Many
                                 Cats
First Name   Last Name   alive   Owned   zip     dob
----------   ---------   -----   -----   -----   --------------------
John         Smith       true        2   00000   04/02/1946  08:41 pm
Buckaroo     Banzai      false       1   12345   12/25/1957  07:41 pm
  (2 rows returned)\n
"""

	actualstr = objprint.format obj, options
	actualAr = actualstr.split '\n'
	testAr = teststr.split '\n'
	for str, i in actualAr
		# test trimmed strings
		test.equal _.trim(str), _.trim(actualAr[i])

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
