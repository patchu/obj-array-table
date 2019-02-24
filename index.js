// Generated by CoffeeScript 2.3.1
var _, dateformat, format, numeral, parse, splitMaxlenStr, splitTrimNoEmpty;

dateformat = require('dateformat-nodep');

numeral = require('numeral');

_ = require('lodash');

// split and remove all empty elements
splitTrimNoEmpty = function(line, splitChar) {
  var ar, j, len1, newAr, newstr, str;
  ar = line.split(splitChar);
  newAr = [];
  for (j = 0, len1 = ar.length; j < len1; j++) {
    str = ar[j];
    newstr = _.trim(str);
    if (newstr) {
      newAr.push(newstr);
    }
  }
  return newAr;
};

// returns an array with string split up by maxlen, if necessary
splitMaxlenStr = function(str, colMaxlen) {
  var ar;
  ar = [];
  // go through all strings, checking for max length
  while (str.length > colMaxlen) {
    ar.push(str.substring(0, colMaxlen));
    str = "↪  " + str.substring(colMaxlen);
  }
  ar.push(str);
  return ar;
};

// input is an array of rows
// [
//		{col1: val, col2: val2}
//		{col1: val, col2: val2}
//		{col1: val, col2: val2}
// ]
// columns are built based on the keys of the first object
// options:
//		longdateformat: true/false, print the year for date fields?
//		meetInMiddle: right-justify even columns and left-justify odd columns
format = function(inputObj, options) {
  var ar, arIndex, arStr, betweenStr, borderline, bottomline, colIndex, colMaxlen, collen, columnHeaders, columnLengthArray, diff, excessRows, extra, formatstr, i, i1, isNumber, ix, j, j1, k, k1, key, keylen, keys, l, l1, len, len1, len10, len11, len12, len13, len14, len15, len16, len17, len2, len3, len4, len5, len6, len7, len8, len9, lineAr, linestr, longDashes, longStringOfSpaces, m, m1, n, newRow, newStrAr, numberformat, o, obj, p, partsMax, q, r, ref, ref1, ref2, ref3, rlen, row, rowAr, rowIndex, s, sp, spacePad, spacePadLen, spstr, startLine, str, t, tempAr, topline, u, v, val, valueLineAr, w, x, y, z;
  options = options || {};
  betweenStr = "│";
  startLine = "│";
  if (options.spaceDivider) {
    betweenStr = " ";
    startLine = " ";
  }
  lineAr = [];
  if (inputObj && inputObj.length) {
    obj = inputObj[0];
    keys = _.keys(obj);
    keylen = keys.length;
    partsMax = 1; // a "part" is a column name divided by "."
    isNumber = _.fill(Array(keylen), false);
    // find the longest length of each column
    columnLengthArray = [];
    if (options.longdateformat) {
      formatstr = 'mm/dd/yyyy  hh:MM tt';
    } else {
      formatstr = 'mmm dd  hh:MM tt';
    }
// seed the value with the column name
    for (i = j = 0, len1 = keys.length; j < len1; i = ++j) {
      key = keys[i];
      columnLengthArray[i] = 3;
      sp = key.split(/[_\.]/);
      for (k = 0, len2 = sp.length; k < len2; k++) {
        str = sp[k];
        // set to the longest of the split parts
        columnLengthArray[i] = Math.max(columnLengthArray[i], str.length);
      }
      partsMax = Math.max(partsMax, sp.length);
    }
    // create array of arrays of values that all subsequent code will use
    valueLineAr = [];
// n index
    for (n = m = 0, len3 = inputObj.length; m < len3; n = ++m) {
      obj = inputObj[n];
      rowAr = [];
      excessRows = [];
// o index
      for (o = p = 0, len4 = keys.length; p < len4; o = ++p) {
        key = keys[o];
        val = obj[key];
        if (_.isArray(val)) {
          val = JSON.stringify(val);
        } else if (_.isBoolean(val)) {
          val = val.toString();
        } else if (_.isNumber(val)) {
          isNumber[o] = true;
          numberformat = options != null ? (ref = options.numberformat) != null ? ref[key] : void 0 : void 0;
          if (numberformat) {
            val = numeral(val).format(numberformat);
          }
          val = _.trim(val.toString());
        } else {
          if (toString.call(val) === '[object Date]') {
            val = dateformat(val, formatstr);
            val = val.replace(', 0', ',  ');
          }
          if (val == null) {
            val = '';
          }
          // split and see if we have more than one element
          sp = splitTrimNoEmpty(val, '\n');
          if (sp.length > 1) {
            // check string length
            colMaxlen = options.colMaxlen;
            ar = [];
// go through all strings, checking for max length
            for (q = 0, len5 = sp.length; q < len5; q++) {
              spstr = sp[q];
              if (spstr.length < colMaxlen) {
                ar.push(spstr);
              } else {
                ar = _.concat(ar, splitMaxlenStr(spstr, colMaxlen));
              }
            }
            for (arIndex = r = 0, len6 = ar.length; r < len6; arIndex = ++r) {
              arStr = ar[arIndex];
              if (arIndex >= excessRows.length) {
                newRow = _.fill(Array(keylen), '');
                excessRows.push(newRow);
              }
              newRow = excessRows[arIndex];
              newRow[o] = _.trim(arStr);
            }
          } else if (val.length > colMaxlen) {
            ar = splitMaxlenStr(val, colMaxlen);
            for (arIndex = s = 0, len7 = ar.length; s < len7; arIndex = ++s) {
              arStr = ar[arIndex];
              if (arIndex >= excessRows.length) {
                newRow = _.fill(Array(keylen), '');
                excessRows.push(newRow);
              }
              newRow = excessRows[arIndex];
              newRow[o] = _.trim(arStr);
            }
          }
        }
        rowAr.push(val);
      }
      if (excessRows.length) {
        ref1 = excessRows[0];
        // console.log excessRows
        // merge with rowAr
        for (ix = t = 0, len8 = ref1.length; t < len8; ix = ++t) {
          str = ref1[ix];
          if (str) {
            rowAr[ix] = str;
          }
        }
        excessRows = excessRows.slice(1);
      }
      valueLineAr.push(rowAr);
      if (excessRows.length) {
        for (u = 0, len9 = excessRows.length; u < len9; u++) {
          row = excessRows[u];
          valueLineAr.push(row);
        }
      }
    }
// console.log valueLineAr

// now cycle through each row and get the longest string
// for obj, j in inputObj			# j index
// 	for key, k in keys 		# k index
// 		val = obj[key]
// 		if val
// 			if _.isDate val
// 				val = dateformat val, formatstr
// 			else if _.isNumber(val)
// 				numberformat = options?.numberformat?[key]
// 				if numberformat
// 					val = numeral(val).format numberformat
// 			columnLengthArray[key] = Math.max val.toString().length, columnLengthArray[key]
    for (rowIndex = v = 0, len10 = valueLineAr.length; v < len10; rowIndex = ++v) {
      row = valueLineAr[rowIndex];
      for (colIndex = w = 0, len11 = row.length; w < len11; colIndex = ++w) {
        val = row[colIndex];
        val = val || '';
        columnLengthArray[colIndex] = Math.max(val.toString().length, columnLengthArray[colIndex]);
      }
    }
    // console.log partsMax, columnLengthArray
    longStringOfSpaces = '                                                                                                                                                                                                                                                                                                ';
    longDashes = '────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────';
    // print the column names
    // dotted columns names will be displayed in multiple lines
    linestr = startLine;
    newStrAr = [];
    for (i = x = 0, ref2 = partsMax; x < ref2; i = x += 1) {
      newStrAr.push(startLine);
    }
    borderline = startLine;
// l
    for (l = y = 0, len12 = keys.length; y < len12; l = ++y) {
      key = keys[l];
      collen = columnLengthArray[l];
      // configure border line (top and bottom) first
      borderline += longDashes.slice(0, collen + 2) + betweenStr;
      tempAr = [];
      for (i = z = 0, ref3 = partsMax; z < ref3; i = z += 1) {
        tempAr.push('');
      }
      sp = key.split(/[_\.]/);
      for (i = i1 = 0, len13 = sp.length; i1 < len13; i = ++i1) {
        str = sp[i];
        tempAr[i] = str;
      }
      // console.log ''
      // console.log 'start tempAr: ', tempAr

      // pop away blank lines, push everything down
      while (!tempAr[partsMax - 1]) {
        tempAr.pop();
        tempAr.unshift('');
      }
// console.log 'end tempAr: ', tempAr
      for (i = j1 = 0, len14 = tempAr.length; j1 < len14; i = ++j1) {
        str = tempAr[i];
        // for blank strings, just output collen + 2
        if (!str.length) {
          newStrAr[i] += ' ' + longStringOfSpaces.slice(0, collen) + ' ' + betweenStr;
          continue;
        }
        spacePad = '';
        extra = '';
        if (collen !== str.length) {
          // padding needed
          diff = collen - str.length;
          spacePad = longStringOfSpaces.slice(0, (diff / 2));
          extra = longStringOfSpaces.slice(0, (diff % 2));
        }
        newStrAr[i] += ' ' + spacePad + str + extra + spacePad + ' ' + betweenStr;
      }
    }
    // console.log newStrAr

    // next two statement: total hacks
    // eliminate blank lines
    // while not trim newStrAr[newStrAr.length-1]
    // 	newStrAr.splice newStrAr.length-1,1

    // while not trim newStrAr[0]
    // 	newStrAr.splice 0,1
    columnHeaders = newStrAr.join('\n');
    // console.log columnHeaders, newStrAr

    // lineAr.push linestr
    lineAr.push(columnHeaders);
    // print the dashes under the column names
    linestr = '├─';
    for (i = k1 = 0, len15 = keys.length; k1 < len15; i = ++k1) {
      key = keys[i];
      linestr += `${longDashes.slice(1, +columnLengthArray[i] + 1 || 9e9)}─${betweenStr}─`;
    }
    if (options.spaceDivider) {
      linestr = linestr.replace(/─\ ─/g, '─┼─');
      linestr = linestr.replace(/┼─$/g, '┤');
    } else {
      linestr = linestr.replace(/─│─/g, '─┼─');
      linestr = linestr.replace(/┼─$/g, '┤');
    }
    lineAr.push(linestr);
// now cycle again and print result
// for obj, n in inputObj			# n index
// 	linestr = startLine+' '
// 	for key, o in keys 		# o index
// val = obj[key]
    for (rowIndex = l1 = 0, len16 = valueLineAr.length; l1 < len16; rowIndex = ++l1) {
      row = valueLineAr[rowIndex];
      linestr = startLine + ' ';
      for (colIndex = m1 = 0, len17 = row.length; m1 < len17; colIndex = ++m1) {
        val = row[colIndex];
        if (!val) {
          val = '';
        }
        key = keys[colIndex];
        if (isNumber[colIndex]) {
          val = _.trim(val.toString());
          len = val.length;
          // lineAr.push 'length, value, stored len: ', len, val, columnLengthArray[key]
          spacePadLen = columnLengthArray[colIndex] - len;
          // lineAr.push 'spacePadLen: ', spacePadLen
          spacePad = longStringOfSpaces.slice(1, +spacePadLen + 1 || 9e9);
          // linestr += spacePad+val.toString()+" | "
          if (options.meetInMiddle) {
            if (spacePad.length > 60) {
              spacePad = spacePad.substring(0, 60);
            }
          }
          if (options.meetInMiddle && o % 2 === 1) {
            // linestr += val+spacePad+"   "
            linestr += `${val}${spacePad} ${betweenStr} `;
          } else {
            linestr += `${spacePad}${val.toString()} ${betweenStr} `;
          }
        } else {
          spacePadLen = columnLengthArray[colIndex] + 1 - val.length;
          spacePad = longStringOfSpaces.slice(1, +spacePadLen + 1 || 9e9);
          // linestr += val+spacePad+"| "
          if (options.meetInMiddle) {
            if (spacePad.length > 60) {
              spacePad = spacePad.substring(0, 60);
            }
          }
          if (options.meetInMiddle && o % 2 === 0) {
            spacePad = longStringOfSpaces.slice(2, +spacePadLen + 1 || 9e9);
            // linestr += spacePad+val+betweenStr
            linestr += `${spacePad}${val}${betweenStr} `;
          } else {
            // linestr += val+spacePad+betweenStr
            linestr += `${val}${spacePad}${betweenStr} `;
          }
        }
      }
      linestr += betweenStr;
      // output the right bar to tne the string

      // final transformations

      // leave out the trailing |
      linestr = linestr.substr(0, linestr.length - 2);
      lineAr.push(linestr);
    }
    // add border lines
    if (options.spaceDivider) {
      topline = borderline.replace(/─\ ─/g, '─┬─');
      topline = topline.replace(/\ ─/g, '┌─');
      topline = topline.replace(/─\ /g, '─┐');
      bottomline = borderline.replace(/─\ ─/g, '─┴─');
      bottomline = bottomline.replace(/\ ─/g, '└─');
      bottomline = bottomline.replace(/─\ /g, '─┘');
    } else {
      topline = borderline.replace(/─│─/g, '─┬─');
      topline = topline.replace(/│─/g, '┌─');
      topline = topline.replace(/─│/g, '─┐');
      bottomline = borderline.replace(/─│─/g, '─┴─');
      bottomline = bottomline.replace(/│─/g, '└─');
      bottomline = bottomline.replace(/─│/g, '─┘');
    }
    lineAr.unshift(topline);
    lineAr.unshift('');
    lineAr.push(bottomline);
    rlen = inputObj.length;
    if (rlen === 1) {
      lineAr.push("  (1 row returned)");
    } else {
      lineAr.push(`  (${rlen} rows returned)`);
    }
    lineAr.push('');
  } else {
    lineAr.push("  (0 rows returned)");
  }
  return lineAr.join('\n');
};

// given a string in table format, returns an array of objects
// uses the first line as properties for objects
parse = function(text) {
  var headerSeen, i, j, k, len1, len2, line, lineParts, lines, newObj, prop, propArray, retArray, val, valFound;
  retArray = [];
  headerSeen = false;
  propArray = [];
  lines = _.split(text, '\n');
  for (i = j = 0, len1 = lines.length; j < len1; i = ++j) {
    line = lines[i];
    line = _.trim(line);
    if (_.startsWith(line, '#')) {
      // if line starts with a comment, ignore it
      continue;
    }
    if (!line) {
      continue;
    }
    lineParts = _.split(line, '|');
    if (lineParts.length < 3) {
      // vertical bar not found
      continue;
    }
    if (_.startsWith(lineParts[1], '-')) {
      continue;
    }
    if (!headerSeen) {
      headerSeen = true;
      propArray = lineParts.slice(1).map(function(item) {
        return _.trim(item);
      }).filter(function(item) {
        return item !== '';
      });
      continue;
    }
    newObj = {};
    valFound = false;
    for (i = k = 0, len2 = propArray.length; k < len2; i = ++k) {
      prop = propArray[i];
      val = _.trim(lineParts[i + 1]);
      if (!val) {
        continue;
      }
      newObj[prop] = val;
      valFound = true;
    }
    if (valFound) {
      retArray.push(newObj);
    }
  }
  return retArray;
};

exports.format = format;

exports.parse = parse;
