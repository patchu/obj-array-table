objprint = require '.'

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
	console.log actualstr
	test.equal teststr, actualstr
	test.done()
