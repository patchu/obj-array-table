dateformat = require 'dateformat-nodep'
numeral = require 'numeral'
_ = require 'lodash'

# split and remove all empty elements
splitTrimNoEmpty = (line, splitChar) ->
	ar = line.split splitChar
	newAr = []
	for str in ar
		newstr = _.trim str
		if newstr
			newAr.push newstr
	newAr

# returns an array with string split up by maxlen, if necessary
splitMaxlenStr = (str, colMaxlen) ->
	ar = []
	# go through all strings, checking for max length
	while str.length > colMaxlen
		ar.push str.substring 0, colMaxlen
		str = "↪  " + str.substring colMaxlen
	ar.push str
	return ar

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
	betweenStr = "│"
	startLine = "│"
	if options.spaceDivider
		betweenStr = " "
		startLine = " "

	lineAr = []
	if inputObj and inputObj.length
		obj = inputObj[0]
		keys = _.keys obj
		keylen = keys.length
		partsMax = 1 		# a "part" is a column name divided by "."
		isNumber = _.fill Array(keylen), false

		# find the longest length of each column
		columnLengthArray = []

		if options.longdateformat
			formatstr = 'mm/dd/yyyy  hh:MM tt'
		else
			formatstr = 'mmm dd  hh:MM tt'


		# seed the value with the column name
		for key, i in keys
			columnLengthArray[i] = 3

			sp = key.split /[_\.]/
			for str in sp
				# set to the longest of the split parts
				columnLengthArray[i] = Math.max columnLengthArray[i], str.length
			partsMax = Math.max partsMax, sp.length

		# create array of arrays of values that all subsequent code will use
		colMaxlen = options.colMaxlen || 80
		valueLineAr = []

		for obj, n in inputObj			# n index
			rowAr = []
			excessRows = []

			for key, o in keys 		# o index
				val = obj[key]

				if _.isArray val
					val = JSON.stringify val

				else if _.isBoolean val
					val = val.toString()

				else if _.isNumber val
					isNumber[o] = true
					numberformat = options?.numberformat?[key]
					if numberformat
						val = numeral(val).format numberformat

					val = _.trim val.toString()
				else
					if toString.call(val) is '[object Date]'
						val = dateformat val, formatstr
						val = val.replace ', 0', ',  '

					if not val?
						val = ''

					# split and see if we have more than one element
					sp = splitTrimNoEmpty val, '\n'
					if sp.length > 1
						# check string length

						ar = []
						# go through all strings, checking for max length
						for spstr in sp
							if spstr.length < colMaxlen
								ar.push spstr
							else
								ar = _.concat ar, splitMaxlenStr spstr, colMaxlen

						for arStr, arIndex in ar
							if arIndex >= excessRows.length
								newRow = _.fill Array(keylen), ''
								excessRows.push newRow
							newRow = excessRows[arIndex]
							newRow[o] = _.trim arStr
					else if val.length > colMaxlen
						ar = splitMaxlenStr val, colMaxlen
						for arStr, arIndex in ar
							if arIndex >= excessRows.length
								newRow = _.fill Array(keylen), ''
								excessRows.push newRow
							newRow = excessRows[arIndex]
							newRow[o] = _.trim arStr

				rowAr.push val
			if excessRows.length
				# console.log excessRows
				# merge with rowAr
				for str, ix in excessRows[0]
					if str
						rowAr[ix] = str
				excessRows = excessRows[1...]
			valueLineAr.push rowAr
			if excessRows.length
				for row in excessRows
					valueLineAr.push row

		# console.log valueLineAr

		# now cycle through each row and get the longest string
		# for obj, j in inputObj			# j index
		# 	for key, k in keys 		# k index
		# 		val = obj[key]
		# 		if val
		# 			if _.isDate val
		# 				val = dateformat val, formatstr
		# 			else if _.isNumber(val)
		# 				numberformat = options?.numberformat?[key]
		# 				if numberformat
		# 					val = numeral(val).format numberformat
		# 			columnLengthArray[key] = Math.max val.toString().length, columnLengthArray[key]

		for row, rowIndex in valueLineAr
			for val, colIndex in row
				val = val or ''
				columnLengthArray[colIndex] = Math.max val.toString().length, columnLengthArray[colIndex]

		# console.log partsMax, columnLengthArray

		longStringOfSpaces = '                                                                                                                                                                                                                                                                                                '
		longDashes =         '────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────'

		# print the column names
		# dotted columns names will be displayed in multiple lines
		linestr = startLine
		newStrAr = []

		for i in [0... partsMax] by 1
			newStrAr.push startLine

		borderline = startLine
		for key,l in keys 			# l
			collen = columnLengthArray[l]

			# configure border line (top and bottom) first
			borderline += longDashes[0 ... collen+2] + betweenStr

			tempAr = []
			for i in [0... partsMax] by 1
				tempAr.push ''

			sp = key.split /[_\.]/
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
				# for blank strings, just output collen + 2
				if not str.length
					newStrAr[i] += ' ' + longStringOfSpaces[0 ... collen] + ' ' +betweenStr
					continue

				spacePad = ''
				extra = ''
				if collen isnt str.length
					# padding needed
					diff = collen - str.length
					spacePad = longStringOfSpaces[ 0 ... (diff / 2) ]
					extra = longStringOfSpaces[ 0 ... (diff % 2)]

				newStrAr[i] += ' ' + spacePad + str + extra + spacePad + ' ' + betweenStr

		# console.log newStrAr

		# next two statement: total hacks
		# eliminate blank lines
		# while not trim newStrAr[newStrAr.length-1]
		# 	newStrAr.splice newStrAr.length-1,1

		# while not trim newStrAr[0]
		# 	newStrAr.splice 0,1

		columnHeaders = newStrAr.join '\n'
		# console.log columnHeaders, newStrAr

		# lineAr.push linestr
		lineAr.push columnHeaders

		# print the dashes under the column names
		linestr = '├─'
		for key, i in keys
			linestr += "#{longDashes[1..columnLengthArray[i]]}─#{betweenStr}─"
		if options.spaceDivider
			linestr = linestr.replace /─\ ─/g, '─┼─'
			linestr = linestr.replace /┼─$/g, '┤'
		else
			linestr = linestr.replace /─│─/g, '─┼─'
			linestr = linestr.replace /┼─$/g, '┤'
		lineAr.push linestr

		# now cycle again and print result
		# for obj, n in inputObj			# n index
		# 	linestr = startLine+' '
		# 	for key, o in keys 		# o index
				# val = obj[key]

		for row, rowIndex in valueLineAr
			linestr = startLine+' '
			for val, colIndex in row
				if not val
					val = ''
				key = keys[colIndex]

				if isNumber[colIndex]
					val = _.trim val.toString()
					len = val.length
					# lineAr.push 'length, value, stored len: ', len, val, columnLengthArray[key]
					spacePadLen = columnLengthArray[colIndex] - len
					# lineAr.push 'spacePadLen: ', spacePadLen
					spacePad = longStringOfSpaces[1..spacePadLen]
					# linestr += spacePad+val.toString()+" | "

					if options.meetInMiddle
						if spacePad.length > 60
							spacePad = spacePad.substring 0,60

					if options.meetInMiddle and o % 2 is 1
						# linestr += val+spacePad+"   "
						linestr += "#{val}#{spacePad} #{betweenStr} "
					else
						linestr += "#{spacePad}#{val.toString()} #{betweenStr} "
				else
					spacePadLen = columnLengthArray[colIndex] + 1 - val.length
					spacePad = longStringOfSpaces[1..spacePadLen]
					# linestr += val+spacePad+"| "
					if options.meetInMiddle
						if spacePad.length > 60
							spacePad = spacePad.substring 0,60
					if options.meetInMiddle and o % 2 is 0
						spacePad = longStringOfSpaces[2..spacePadLen]
						# linestr += spacePad+val+betweenStr
						linestr += "#{spacePad}#{val}#{betweenStr} "
					else
						# linestr += val+spacePad+betweenStr
						linestr += "#{val}#{spacePad}#{betweenStr} "
			linestr += betweenStr

				# output the right bar to tne the string

			# final transformations

			# leave out the trailing |
			linestr = linestr.substr 0, linestr.length-2

			lineAr.push linestr

		# add border lines
		if options.spaceDivider
			topline = borderline.replace /─\ ─/g, '─┬─'
			topline = topline.replace /\ ─/g, '┌─'
			topline = topline.replace /─\ /g, '─┐'
			bottomline = borderline.replace /─\ ─/g, '─┴─'
			bottomline = bottomline.replace /\ ─/g, '└─'
			bottomline = bottomline.replace /─\ /g, '─┘'
		else
			topline = borderline.replace /─│─/g, '─┬─'
			topline = topline.replace /│─/g, '┌─'
			topline = topline.replace /─│/g, '─┐'
			bottomline = borderline.replace /─│─/g, '─┴─'
			bottomline = bottomline.replace /│─/g, '└─'
			bottomline = bottomline.replace /─│/g, '─┘'
		lineAr.unshift topline
		lineAr.unshift ''
		lineAr.push bottomline

		rlen = inputObj.length
		if rlen is 1
			lineAr.push "  (1 row returned)"
		else
			lineAr.push "  (#{rlen} rows returned)"
		lineAr.push ''
	else
		lineAr.push "  (0 rows returned)"

	lineAr.join '\n'


# given a string in table format, returns an array of objects
# uses the first line as properties for objects
parse = (text) ->
	retArray = []
	headerSeen = false
	propArray = []

	lines = _.split text, '\n'
	for line, i in lines
		line = _.trim line
		if _.startsWith line, '#'
			# if line starts with a comment, ignore it
			continue

		if not line
			continue

		lineParts = _.split line, '|'
		if lineParts.length < 3
			# vertical bar not found
			continue

		if _.startsWith lineParts[1], '-'
			continue

		if not headerSeen
			headerSeen = true
			propArray = lineParts[1...].map((item) ->
				return _.trim item
			).filter (item) ->
				item isnt ''
			continue

		newObj = {}
		valFound = false
		for prop, i in propArray
			val = _.trim lineParts[i+1]
			if not val
				continue
			newObj[prop] = val
			valFound = true

		if valFound
			retArray.push newObj
	retArray


exports.format = format
exports.parse = parse

