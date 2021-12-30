# JavaScriptSorting
Sort text and numbers in JS tables efficiently.  

## TL;DR

Compact function written in pure Javscript to enable efficient sorting of text and number columns in html tables.  Assumes the first `<tr>..</tr>`is the header row.  Thus it will work with or without  a `<thead>...</thead>` block.  Should work for all simple tables and use cases.  Sorts all the following:

* Text -> Case Sensitive / Insenstive
* Numbers -> Integers, floats, Scientific notation, currency.  Numbers can be postive or negative in the same column.  Non-numbers sink to the bottom.  Numbers can have something other then "." as decimal point.  E.g. In Europe it is normal to have commas as the dp.  Numbers can also have separators. i.e. it will sort 123456.67 and 123,456.78
* Accounting format -> £ (1,786,989.00 ) is treated as a negative number vs £1,786,989.00 which is a postive number

Simply add an onclick attribute to the headings' table row along with the appropriate data-tags.  See full description further down.  It is not necessary for the table to have a header block - it will work with a table with a only a body block.

Does not do multi-column sort(yet!).

Fast - See performance section for further info stats.

## Requirements

Browser supports HTML5 data attributes. In effect, should be any modern browser.

## Raison d'etre

For simple tables, I wanted sorting single columns to be done at the client level to reduce overhead on backend server.

Originally I was looking for a small pure js( not one of the js frameworks or a large all singing and dancing library ) file to do the task for me.  However, the ones I would come across would only do text.  If they did do numbers, they could not sort positive and negative numbers in the same column properly, deal with NaN(Not a Number) values, etc.  So, I wrote this function to do the task for me.

## Usage guide

### Overview

#### Install

Simply download the file and place it somewhere appropriate in your project structure.  The easiest place for testing purposes is in the same location as the html file that has your table(s).  In the header or at the the bottom of your html body section, insert a reference to the script. e.g.

`<script src="sort_js_tables.js"></script>`

On windows, if testing on your local machines and you want to keep the js in a different directory structure altogether, you could fully reference it as per below;
`<script src="file:///C:/Path/to/your/file/sorting_js_tables.js"></script>`

#### Updating the table attributes

I will assume the table has a header block for documentation purposes.  Example without header is also shown further below.  The function assumes that the very first `<tr>` tag whether it be in the `<thead>` block or in the `<tbody>` block is the header.

```

<table style="border: solid;">
    <thead>
      <tr style="text-align: left;">
        <th data-type="txt" data-case-sensitive="true" onclick="sortTableColumn(event, 0)">Case Sensitive</th>
        <th data-type="txt" onclick="sortTableColumn(event, 1)">Random Int</th>
        <th data-type="num" onclick="sortTableColumn(event, 2)">Random Float</th>
        <th data-type="num" onclick="sortTableColumn(event, 3)">Pos Integers</th>
        <th data-type="num" onclick="sortTableColumn(event, 4)">Scientific</th>
        <th data-type="num" data-dp="." onclick="sortTableColumn(event,5)">Sci. col full</th>
        <th data-type="txt" data-case-sensitive="false" onclick="sortTableColumn(event, 6)">Case InSensitive</th>
        <th data-type="num" data-dp="." onclick="sortTableColumn(event, 7)">Currency</th>
        <th data-type="acc" data-dp="." onclick="sortTableColumn(event, 8)">Accounting dp=.</th>
        <th data-type="acc" data-dp="," onclick="sortTableColumn(event, 9)">Accounting dp=,</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>qUeEn</td>
        <td>55</td>
        <td>-23.94500826</td>
        <td>595608435</td>
        <td>5.901260e+20</td>
        <td>590,125,556,832,839,000,000.00</td>
        <td>qUeEn</td>
        <td>£316,320,450.62</td>
        <td>£ 57,544,687.20</td>
        <td>£1.00</td>
      </tr>
```

The minimum needed is a `onclick="sortTableColumn(event, 0)"`attribute in each column you wish to sort.  If you do not add any other attributes, the column will be sorted as text, case insensitve.  The first parameter to the function is always `event`. The 2nd parameter is the column number.  Numbering starts from 0.  Yes, if, you put in the wrong column number, a different column will be sorted; - save it for April 1st.

#### Data Tags

The data tags help the function resolve the data type it is dealing with and how to process the elements.

**data-type**: Allowed values are "num", "txt" or "acc" for number, text and accounting respectively.  "txt" is the default value if no data-type attribute is set.

**data-case-sensitive**: "true" or "false".  Only relevant if data-type="txt" is set.  If case sensitive is false, everything is coverted to lowercase before sorting.

**data-dp**: Only relevant with "num" and "acc" data types.  Specifies what to use as a decimal point. ***Always*** set this value if the decimal point is not a dot(".") ***or*** if the column does not consist of only digits and a decimal point.  Setting this attribute triggers additional regex processing to separate the numbers from the other characters.

***data-sort***: "asc" or "desc".  Whether sort is ascending or descending first time round.  Subsequently, it will flip to the opposite. 

#### Numbers - further info

Whilst a + or - sign in front of a number is OK, a + or - at the end of a number is not. e.g.

* +123.56 or -755 is fine.  123.56+ or 755- is not and will result in JS treating it as a NaN(Not a Number).

Accounting convention is to surround negative numbers with brackets whilst postive number are without brackets. e.g.
(123,124.98) is equivalent to -123.124.98.  Ergo, there is no need to have + or - signs if using this convention.

#### Table with body only

The below table does not have `<thead>`block.  The column headings are simply the first row in the `<tbody>` block.

```

<table style="border: solid;">

    <tbody>
      <tr style="text-align: left;">
        <td data-type="txt" data-case-sensitive="true" onclick="sortTableColumn(event, 0)">Case Sensitive</td>
        <td data-type="txt" onclick="sortTableColumn(event, 1)">Random Int</td>
        <td data-type="num" onclick="sortTableColumn(event, 2)">Random Float</td>
        <td data-type="num" onclick="sortTableColumn(event, 3)">Pos Integers</td>
        <td data-type="num" onclick="sortTableColumn(event, 4)">Scientific</td>
        <td data-type="num" data-dp="." onclick="sortTableColumn(event,5)">Sci. col full</td>
        <td data-type="txt" data-case-sensitive="false" onclick="sortTableColumn(event, 6)">Case InSensitive</td>
        <td data-type="num" data-dp="." onclick="sortTableColumn(event, 7)">Currency</td>
        <td data-type="acc" data-dp="." onclick="sortTableColumn(event, 8)">Accounting dp=.</td>
        <td data-type="acc" data-dp="," onclick="sortTableColumn(event, 9)">Accounting dp=,</td>
      </tr>
      <tr>
        <td>pArt</td>
        <td>671</td>
        <td>21.85758178</td>
        <td>660702077</td>
        <td>1.230000e+02</td>
        <td>99,874,271,899,915,900,000.00</td>
        <td>NaN</td>
        <td>NaN</td>
        <td>£ 236,018,527.99</td>
        <td>£ 435.525.148,47</td>
      </tr>
```

## TODO List ( in no particualar order )

* Add data-tag(s) and functionality for dates
* Add data-tag(s) and functionality for timestamps
* Add functionality for `compareLocal()` so that alphabets other than English are catered for properly
* Multi-column sort
* Some initial CSS styling

## Performance

Internally, the function uses the `Array.prototype.sort()` method to sort the columns.  This is very quick.  I have tested with a table of 10 columns as per below...

| Case Sensitive Sort | Random Integers | Rand floats  | Pos Ints  | Scientific  | Scientific as full number      | Case InSensitive Sort | Currency         |  Accounting         | Currency dp comma |
|---------------------|-----------------|--------------|-----------|-------------|--------------------------------|-----------------------|------------------|---------------------|-------------------|
| qUeEn               | 55              | -23.94500826 | 595608435 | 5.90126E+20 | 590,125,556,832,839,000,000.00 | qUeEn                 | £316,320,450.62  |  £ 57,544,687.20    | £1.00             |
| pArt                | 671             | 21.85758178  | 660702077 | 123         | 99,874,271,899,915,900,000.00  |                       |                  |  £ 236,018,527.99   | £ 435.525.148,47  |
| GuIde               | 73              | 817.4082187  |           | 2.45412E+20 | 245,411,763,867,806,000,000.00 | GuIde                 | -£67,195,890.95  |  £ (889,352,088.02) | -£0.23            |
| 0000                | 372             | 305.7672038  | 317287154 |             | 286,121,107,858,855,000,000.00 | 00000                 | -£173,369,699.91 |  £ (40,752,918.93)  | £23               |
| PoEm                | 940             | grrrr        | 245609103 | 4.33388E+20 | 433,387,512,598,271,000,000.00 | PoEm                  | -£913,463,328.55 |  £ (12,052,649.43)  | £ 158.095.168,71  |
| halFwAY             | 264             | 629.0290062  | 480684850 | 3.05075E+20 | 305,075,417,621,948,000,000.00 | halFwAY               | £636,864,862.75  |  £ 12,478,937.45    | (                 |

... with 100, 1000 and 10 000 rows of randomized values all fully rendered/displayed in the browser.  Anything upto 1000 rows fully displayed should be no issue for any modern latop in terms of responsiveness, regardless of processor.  i.e. you click on a column heading and in human terms, the full response cycle post click of process click, parse values, sort values, rebuild DOM tree and display appears instantaneous.  The responsiveness issue only comes into play if you insist on displaying an entire table of say 10 000 rows in one go.  In that case, the user sees and feels a noticeable delay(Anything more than a second).

For that reason, when re-building the sorted DOM tree, I have put in an arbitary Timeout of 10ms after 500 rows.  Rebuilding the DOM tree is the last step after sorting.  The break gives the system an opportunity to step in and render the results thus far before re-attaching and displaying the remaining rows.  500 is probably excessive as most tables are not that large anyway.   Also, in term of display, normally it is 20 to 30 rows at a time, not a full table.  However, as far as the user is concerned, s/he has got instantaneous feedback on 10 000 rows of data.

