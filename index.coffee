dateformat = require 'dateformat'
_ = require 'lodash'

# input is an array of rows
# [
#		{col1: val, col2: val2}
#		{col1: val, col2: val2}
#		{col1: val, col2: val2}
# ]
# columns are built based on the keys of the first object
# options:
#		longdateformat: true/false, print the year for date fields?
#		meetInMiddle: right-justify even columns and left-justify odd columns
format = (inputObj, options) ->
	options = options or {}

	lineAr = []
	if inputObj and inputObj.length
		obj = inputObj[0]
		keys = _.keys obj
		len = keys.length
		partsMax = 1 		# a "part" is a column name divided by "."

		# find the longest length of each column
		columnLengthArray = {}

		if options.longdateformat
			formatstr = 'mm/dd/yyyy  hh:MM tt'
		else
			formatstr = 'mmm dd  hh:MM tt'


		# seed the value with the column name
		for key, i in keys
			columnLengthArray[key] = 3

			sp = key.split '.'
			for str in sp
				# set to the longest of the split parts
				columnLengthArray[key] = Math.max columnLengthArray[key], str.length
			partsMax = Math.max partsMax, sp.length

		# now cycle through each row and get the longest string
		for obj, j in inputObj			# j index
			for key, k in keys 		# k index
				val = obj[key]
				if val
					if _.isDate val
						val = dateformat val, formatstr
					columnLengthArray[key] = Math.max val.toString().length, columnLengthArray[key]

		# console.log partsMax, columnLengthArray

		longStringOfSpaces = '                                                                                                                                                                                                                                                                                                '
		longDashes =         '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------'

		# print the column names
		# dotted columns names will be displayed in multiple lines
		linestr = ''
		newStrAr = []

		for i in [0... partsMax] by 1
			newStrAr.push ''

		for key,l in keys 			# l
			tempAr = []
			for i in [0... partsMax] by 1
				tempAr.push ''

			sp = key.split '.'
			for str, i in sp
				tempAr[i] = str

			# console.log ''
			# console.log 'start tempAr: ', tempAr

			# pop away blank lines, push everything down
			while not tempAr[partsMax-1]
				tempAr.pop()
				tempAr.unshift ''

			# console.log 'end tempAr: ', tempAr

			for str, i in tempAr
				spacePadLen = columnLengthArray[key] + 1 - str.length
				spacePad = longStringOfSpaces[0..spacePadLen]
				newStrAr[i] += str+spacePad+" "
				# linestr += str+spacePad+"  "
			# linestr = newStrAr.join '\n'

		# console.log newStrAr

		# next two statement: total hacks
		# eliminate blank lines
		# while not trim newStrAr[newStrAr.length-1]
		# 	newStrAr.splice newStrAr.length-1,1

		# while not trim newStrAr[0]
		# 	newStrAr.splice 0,1

		columnHeaders = newStrAr.join '\n'
		# console.log columnHeaders, newStrAr

		lineAr.push ''
		# lineAr.push linestr
		lineAr.push columnHeaders

		# print the dashes under the column names
		linestr = ''
		for key, i in keys
			linestr += longDashes[1..columnLengthArray[key]]+"   "
		lineAr.push linestr

		# now cycle again and print result
		for obj, n in inputObj			# n index
			linestr = ''
			for key, o in keys 		# o index
				val = obj[key]

				if _.isArray val
					val = JSON.stringify val

				if _.isBoolean val
					val = val.toString()

				if _.isNumber val
					val = _.trim val.toString()
					len = val.length
					# lineAr.push 'length, value, stored len: ', len, val, columnLengthArray[key]
					spacePadLen = columnLengthArray[key] - len
					# lineAr.push 'spacePadLen: ', spacePadLen
					spacePad = longStringOfSpaces[1..spacePadLen]
					# linestr += spacePad+val.toString()+" | "

					if options.meetInMiddle
						if spacePad.length > 60
							spacePad = spacePad.substring 0,60

					if options.meetInMiddle and o % 2 is 1
						linestr += val+spacePad+"   "
					else
						linestr += spacePad+val.toString()+"   "
				else
					if toString.call(val) is '[object Date]'
						val = dateformat val, formatstr
						val = val.replace ', 0', ',  '

					if not val?
						val = ''
					spacePadLen = columnLengthArray[key] + 1 - val.length
					spacePad = longStringOfSpaces[1..spacePadLen]
					# linestr += val+spacePad+"| "
					if options.meetInMiddle
						if spacePad.length > 60
							spacePad = spacePad.substring 0,60
					if options.meetInMiddle and o % 2 is 0
						spacePad = longStringOfSpaces[2..spacePadLen]
						linestr += spacePad+val+"   "
					else
						linestr += val+spacePad+"  "

			# leave out the trailing |
			lineAr.push linestr.substr 0, linestr.length-2

		rlen = inputObj.length
		if rlen is 1
			lineAr.push "  (1 row returned)"
		else
			lineAr.push "  (#{rlen} rows returned)"
		lineAr.push ''
	else
		lineAr.push "  (0 rows returned)"

	lineAr.join '\n'


exports.format = format

