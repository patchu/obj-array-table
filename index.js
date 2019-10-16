// Generated by CoffeeScript 2.4.1
var _, dateformat, format, formatVertical, left, numeral, parse, right, splitMaxlenStr, splitTrimNoEmpty;

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
  var ar, cutoff, pos, temp;
  ar = [];
  // go through all strings, checking for max length
  while (str.length > colMaxlen) {
    // find the first space back within 15 characters
    temp = str.substring(0, colMaxlen);
    pos = temp.lastIndexOf(' ');
    cutoff = colMaxlen - pos > 15 ? colMaxlen : pos;
    ar.push(str.substring(0, cutoff));
    // str = "↪  " + str.substring colMaxlen
    str = "   " + str.substring(cutoff + 1);
  }
  ar.push(str);
  return ar;
};

// return the first NUM characters
left = function(str, num) {
  return str.substr(0, num);
};

// return the last NUM characters
right = function(str, num) {
  return str.substr(str.length - num);
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
  var ar, arIndex, arStr, betweenStr, borderline, bottomline, colIndex, colMaxlen, collen, columnHeaders, columnLengthArray, diff, excessRows, extra, formatstr, headerStr, i, i1, isNumber, ix, j, j1, k, k1, key, keylen, keys, l, l1, len, len1, len10, len11, len12, len13, len14, len15, len16, len17, len2, len3, len4, len5, len6, len7, len8, len9, lineAr, linestr, longDashes, longStringOfSpaces, m, m1, n, newRow, newStrAr, numberformat, o, obj, p, partsMax, q, r, ref, ref1, ref2, ref3, ref4, ref5, rlen, row, rowAr, rowIndex, s, sp, spacePad, spacePadLen, spstr, startLine, str, t, tempAr, topline, u, v, val, valueLineAr, w, x, y, z;
  options = options || {};
  if (options.vertical) {
    return formatVertical(inputObj, options);
  }
  betweenStr = "│";
  startLine = "│";
  if (options.spaceDivider) {
    betweenStr = " ";
    startLine = " ";
  }
  lineAr = [];
  if (inputObj && inputObj.length) {
    // exclude columns
    if (options.excludeColumns && options.excludeColumns.length) {
      inputObj = _.each(inputObj, function(obj1) {
        var col, j, len1, ref, results;
        ref = options.excludeColumns;
        results = [];
        for (j = 0, len1 = ref.length; j < len1; j++) {
          col = ref[j];
          results.push(delete obj1[col]);
        }
        return results;
      });
    }
    obj = inputObj[0];
    keys = _.keys(obj);
    keylen = keys.length;
    partsMax = 1; // a "part" is a column name divided by "."
    isNumber = _.fill(Array(keylen), false);
    columnHeaders = _.map(keys, function(key) {
      var ref, ref1;
      if (options != null ? (ref = options.altHeaders) != null ? ref[key] : void 0 : void 0) {
        return options != null ? (ref1 = options.altHeaders) != null ? ref1[key] : void 0 : void 0;
      } else {
        return key;
      }
    });
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
      headerStr = (options != null ? (ref = options.altHeaders) != null ? ref[key] : void 0 : void 0) || key;
      columnLengthArray[i] = 3;
      sp = headerStr.split(/[_\.]/);
      for (k = 0, len2 = sp.length; k < len2; k++) {
        str = sp[k];
        // set to the longest of the split parts
        columnLengthArray[i] = Math.max(columnLengthArray[i], str.length);
      }
      partsMax = Math.max(partsMax, sp.length);
    }
    // create array of arrays of values that all subsequent code will use
    colMaxlen = options.colMaxlen || 80;
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
          numberformat = options != null ? (ref1 = options.numberformat) != null ? ref1[key] : void 0 : void 0;
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
              newRow[o] = _.trimEnd(arStr);
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
              newRow[o] = _.trimEnd(arStr);
            }
          }
        }
        rowAr.push(val);
      }
      if (excessRows.length) {
        ref2 = excessRows[0];
        // console.log excessRows
        // merge with rowAr
        for (ix = t = 0, len8 = ref2.length; t < len8; ix = ++t) {
          str = ref2[ix];
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
    for (rowIndex = v = 0, len10 = valueLineAr.length; v < len10; rowIndex = ++v) {
      row = valueLineAr[rowIndex];
      for (colIndex = w = 0, len11 = row.length; w < len11; colIndex = ++w) {
        val = row[colIndex];
        val = val || '';
        columnLengthArray[colIndex] = Math.max(val.toString().length, columnLengthArray[colIndex]);
      }
    }
    longStringOfSpaces = '                                                                                                                                                                                                                                                                                                ';
    longDashes = '────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────';
    // print the column names
    // dotted columns names will be displayed in multiple lines
    linestr = startLine;
    newStrAr = [];
    for (i = x = 0, ref3 = partsMax; x < ref3; i = x += 1) {
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
      for (i = z = 0, ref4 = partsMax; z < ref4; i = z += 1) {
        tempAr.push('');
      }
      headerStr = (options != null ? (ref5 = options.altHeaders) != null ? ref5[key] : void 0 : void 0) || key;
      sp = headerStr.split(/[_\.]/);
      for (i = i1 = 0, len13 = sp.length; i1 < len13; i = ++i1) {
        str = sp[i];
        tempAr[i] = str;
      }
      // pop away blank lines, push everything down
      while (!tempAr[partsMax - 1]) {
        tempAr.pop();
        tempAr.unshift('');
      }
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

// put keys on the left and data on the right
// no wrapping of data
// we only have 2 columns, the keys and the values
// each cell contains all the keys or all the values for that record
formatVertical = function(inputObj, options) {
  var allRows, ar, betweenStr, betweenline, borderline, bottomline, colAr, colMaxlen, collen, columnHeaders, columnLengthArray, columnNames, diff, extra, formatstr, headerStr, i, i1, index, isNumber, item, j, k, key, keyMax, keys, keystr, l, len, len1, len10, len11, len12, len2, len3, len4, len5, len6, len7, len8, len9, lineAr, linestr, longDashes, longStringOfSpaces, m, n, newStrAr, numberformat, o, obj, p, partsMax, q, r, ref, ref1, ref2, ref3, ref4, rlen, row, s, sp, spacePad, spstr, startLine, str, t, tempAr, topline, u, v, val, valmax, valstr, valueAr, w, x, y, z;
  options = options || {};
  colMaxlen = options.colMaxlen || 70;
  betweenStr = "│";
  startLine = "│";
  if (options.spaceDivider) {
    betweenStr = " ";
    startLine = " ";
  }
  lineAr = [];
  isNumber = [];
  if (inputObj && inputObj.length) {
    // exclude columns
    if (options.excludeColumns && options.excludeColumns.length) {
      inputObj = _.each(inputObj, function(obj1) {
        var col, j, len1, ref, results;
        ref = options.excludeColumns;
        results = [];
        for (j = 0, len1 = ref.length; j < len1; j++) {
          col = ref[j];
          results.push(delete obj1[col]);
        }
        return results;
      });
    }
    obj = inputObj[0];
    // find the longest key
    keys = _.keys(obj);
    keyMax = 1;
    for (j = 0, len1 = keys.length; j < len1; j++) {
      str = keys[j];
      keyMax = Math.max(keyMax, str.length);
    }
    keyMax = Math.max(keyMax, "Columns".length);
    keyMax += 2;
    if (options.longdateformat) {
      formatstr = 'mm/dd/yyyy  hh:MM tt';
    } else {
      formatstr = 'mmm dd  hh:MM tt';
    }
    // each "row" is an array of values
    // the "value" can be either a string or another array, in the case of multi-line
    allRows = [];
// n index
    for (n = k = 0, len2 = inputObj.length; k < len2; n = ++k) {
      obj = inputObj[n];
      colAr = [];
      valueAr = [];
// o index
      for (o = m = 0, len3 = keys.length; m < len3; o = ++m) {
        key = keys[o];
        ar = [];
        colAr.push(key + ':');
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
          // 		or if string is too long
          // if so, add the array instead of string value
          sp = splitTrimNoEmpty(val, '\n');
          if (sp.length > 1) {
// check string length

// go through all strings, checking for max length
            for (p = 0, len4 = sp.length; p < len4; p++) {
              spstr = sp[p];
              if (spstr.length < colMaxlen) {
                ar.push(spstr);
              } else {
                ar = _.concat(ar, splitMaxlenStr(spstr, colMaxlen));
              }
            }
          } else if (val.length > colMaxlen) {
            ar = splitMaxlenStr(val, colMaxlen);
          }
        }
        if (ar.length) {
          for (index = q = 0, len5 = ar.length; q < len5; index = ++q) {
            item = ar[index];
            if (index > 0) {
              colAr.push('');
            }
            valueAr.push(item);
          }
        } else {
          valueAr.push(val);
        }
      }
      allRows.push([colAr, valueAr]);
    }
    valmax = 1;
    for (r = 0, len6 = allRows.length; r < len6; r++) {
      row = allRows[r];
      valueAr = row[1];
      for (s = 0, len7 = valueAr.length; s < len7; s++) {
        val = valueAr[s];
        valmax = Math.max(valmax, val.length);
      }
    }
    longStringOfSpaces = '                                                                                                                                                                                                                                                                                                ';
    longDashes = '────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────';
    // print the column names
    // dotted columns names will be displayed in multiple lines
    linestr = startLine;
    newStrAr = [];
    partsMax = 1; // we only have 1 line for column headers
    columnLengthArray = [keyMax, valmax];
    columnNames = ['Column', 'Values'];
    for (i = t = 0, ref1 = partsMax; t < ref1; i = t += 1) {
      newStrAr.push(startLine);
    }
    borderline = startLine;
// l
    for (l = u = 0, len8 = columnNames.length; u < len8; l = ++u) {
      key = columnNames[l];
      collen = columnLengthArray[l];
      // configure border line (top and bottom) first
      borderline += longDashes.slice(0, collen + 2) + betweenStr;
      tempAr = [];
      for (i = v = 0, ref2 = partsMax; v < ref2; i = v += 1) {
        tempAr.push('');
      }
      headerStr = (options != null ? (ref3 = options.altHeaders) != null ? ref3[key] : void 0 : void 0) || key;
      sp = headerStr.split(/[_\.]/);
      for (i = w = 0, len9 = sp.length; w < len9; i = ++w) {
        str = sp[i];
        tempAr[i] = str;
      }
      // pop away blank lines, push everything down
      while (!tempAr[partsMax - 1]) {
        tempAr.pop();
        tempAr.unshift('');
      }
      for (i = x = 0, len10 = tempAr.length; x < len10; i = ++x) {
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
    columnHeaders = newStrAr.join('\n');
    lineAr.push(columnHeaders);
    // print the dashes under the column names
    linestr = '├─';
    for (i = y = 0, len11 = columnNames.length; y < len11; i = ++y) {
      key = columnNames[i];
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
    betweenline = linestr;
    for (z = 0, len12 = allRows.length; z < len12; z++) {
      row = allRows[z];
      linestr = startLine + ' ';
      len = row[0].length; // how many lines for this row
      for (i = i1 = 0, ref4 = len; (0 <= ref4 ? i1 < ref4 : i1 > ref4); i = 0 <= ref4 ? ++i1 : --i1) {
        // right-justify column names, left justify values
        keystr = right(longStringOfSpaces + row[0][i], keyMax);
        valstr = left(row[1][i] + longStringOfSpaces, valmax);
        linestr = `${startLine} ${keystr} ${betweenStr} ${valstr} ${betweenStr}`;
        lineAr.push(linestr);
      }
      lineAr.push(betweenline);
    }
    // for val, colIndex in row
    // 	if not val
    // 		val = ''
    // 	key = keys[colIndex]

    // 	if isNumber[colIndex]
    // 		val = _.trim val.toString()
    // 		len = val.length
    // 		# lineAr.push 'length, value, stored len: ', len, val, columnLengthArray[key]
    // 		spacePadLen = columnLengthArray[colIndex] - len
    // 		# lineAr.push 'spacePadLen: ', spacePadLen
    // 		spacePad = longStringOfSpaces[1..spacePadLen]
    // 		# linestr += spacePad+val.toString()+" | "

    // 		if options.meetInMiddle
    // 			if spacePad.length > 60
    // 				spacePad = spacePad.substring 0,60

    // 		if options.meetInMiddle and o % 2 is 1
    // 			# linestr += val+spacePad+"   "
    // 			linestr += "#{val}#{spacePad} #{betweenStr} "
    // 		else
    // 			linestr += "#{spacePad}#{val.toString()} #{betweenStr} "
    // 	else
    // 		spacePadLen = columnLengthArray[colIndex] + 1 - val.length
    // 		spacePad = longStringOfSpaces[1..spacePadLen]
    // 		# linestr += val+spacePad+"| "
    // 		if options.meetInMiddle
    // 			if spacePad.length > 60
    // 				spacePad = spacePad.substring 0,60
    // 		if options.meetInMiddle and o % 2 is 0
    // 			spacePad = longStringOfSpaces[2..spacePadLen]
    // 			# linestr += spacePad+val+betweenStr
    // 			linestr += "#{spacePad}#{val}#{betweenStr} "
    // 		else
    // 			# linestr += val+spacePad+betweenStr
    // 			linestr += "#{val}#{spacePad}#{betweenStr} "
    // linestr += betweenStr

    // output the right bar to tne the string

    // final transformations

    // leave out the trailing |
    // linestr = linestr.substr 0, linestr.length-2

    // lineAr.push linestr

    // remove the last line
    lineAr.pop();
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
