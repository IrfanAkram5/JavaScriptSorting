/*  Written by  : Irfan Akram
    Date        : 25/12/2021
    License     : GNU GPLv3
    Github Location: https://github.com/IrfanAkram5/JavaScriptSorting

    Description : Sort table columns by ascending and descending order.  See readme at https://github.com/IrfanAkram5/JavaScriptSorting for a detailed readme and example code. Meant for basic tables. First <tr> attribute is assumed to be the header row, so header row can be in <thead> or <tbody>

    Minimum necessary is to add onclick="sortTableColumn(event, n) to event every column you want to be able to sort - The first parameter is always "event".  The second parameter "n" is the column position. Numbering starts from 0.

    Data tags are as follows:

    data-type: "txt", "num" or "acc".  -> sort the column as text or number.  "acc" is a also sorted as a number but assumes (124.45) is representing negative numbers
    data-case-sensitive: "true" or "false".  Works in conjunction with "data-type = txt" tag.  Defaults to false if not supplied
    data-sort: "asc" or "desc".  Ascending or Descending.  Initial ordering.  Will flip to opposite on next click.  Defaults to "asc" if not supplied
    data-dp(decimal point): Works in conjunction with "num" and "acc" data-types.  Supply it if yor are formatting number, e.g. thousands sepearators, currency symbols, etc. OR if the decimal point is not a decimal point.  E.g. European convention is to use "," as the decimal point. Default value for dp is "."

    IMPORTANT:  For num data type, any + or - sign should be at the beginning of a number, not the end.  e.g.
    +123.45 => OK
    123.45+ => INCORRECT, will result in a Not a Number(NaN) with Javascript

    Note: No attempt is made to clean the data.  The original value is always displayed back.

    */

function append_number(element, index_pos, arrayGoodValues, arrayBadValues) {
    if (Number.isNaN(Number(element))) {
        arrayBadValues.push({
            "originalIdxPos": index_pos,
            "item": element
        });
    } else {
        arrayGoodValues.push({
            "originalIdxPos": index_pos,
            "item": Number(element)
        });
    }
}

function findAndReplace_dp(result_array, str_dp_value) {
    // if decimal place is not a decimal character, replace it
    if (str_dp_value != ".") {
        let idx_pos = result_array.lastIndexOf(str_dp_value)
        if (idx_pos != -1) {
            result_array[idx_pos] = ".";
        }
    }
}

// Entry point for  onclick is here.
function sortTableColumn(hdrRow, colPos) {

    const db = document.getElementsByTagName("body")[0];
    db.style.cursor = "progress";

    var currentTarget = hdrRow.currentTarget.closest("table")

    // Timout to allow the system to step in and change cursor before running mainprocess
    // which will not cede control until the end.
    // Increase the timeout if cursor is not always changing - delay is not long enought to allow
    // the system to complete prior tasks -> going to be loosely proportional to the size of the table.
    setTimeout(() => {
        //split out table between header row and body rows - assume 1st row is header
        var tablebody = Array.from(currentTarget.rows)
        var hdrrow = tablebody.shift()  //removes header row from table body
        var hdrinfo = hdrrow.children[colPos]
        mainprocess(tablebody, hdrrow, hdrinfo, colPos);
        db.style.cursor = "";

        sessionStorage.setItem('st_DOMreattach', performance.now());
        let myevent = new CustomEvent('sortTable_timers')
        document.dispatchEvent(myevent);

    }, 35);
}


function mainprocess(tablebody, hdrrow, hdrinfo, colPos) {
    const datatypes = {
        txt: "text",
        num: "number",
        acc: "accounting"
    }
    //Capture times to monitor performance
    let sortTable_entry = performance.now()

    //set defaults
    var num_apply_regex = true;
    var regex_dp_value = ".";  // Will get escaped for regex search
    var str_dp_value = ".";  // Need original value for str comparison
    var caseSensitive = false;

    //read attributes to ascertain the data-type we are dealing with - default is txt
    hdrinfo.hasAttribute("data-type") ? datatype = hdrinfo.getAttribute("data-type").toLowerCase() : datatype = "txt"
    if (!(datatype in datatypes)) { datatype = "txt" };  //Override to txt if not a valid value

    switch (datatype) {
        case "txt":
            (hdrinfo.getAttribute("data-case-sensitive") == "true") ? caseSensitive = true : caseSensitive = false
            break;

        case "num":
            hdrinfo.hasAttribute("data-dp") ? regex_dp_value = hdrinfo.getAttribute("data-dp") : num_apply_regex = false
            str_dp_value = regex_dp_value;  // these lines are redundant
            if (regex_dp_value == ".") {    // if the num_apply_regex is false
                regex_dp_value = "\\.";     // but is saves the clutter of annother if statement
            }
            break;

        case "acc":
            if (hdrinfo.hasAttribute("data-dp")) { regex_dp_value = hdrinfo.getAttribute("data-dp") };
            str_dp_value = regex_dp_value
            if (regex_dp_value == ".") {
                regex_dp_value = "\\.";  //Escape the escape!
            }
            break;
        default:
            break;
    }

    //Get the current direction and reset it to the opposite for next time round - default is desc
    if (hdrinfo.getAttribute("data-sort") == "asc") {
        var dir = "asc"
        hdrinfo.setAttribute("data-sort", "desc")
    } else {
        var dir = "desc"
        hdrinfo.setAttribute("data-sort", "asc")
    }

    //Build any regex expression
    switch (datatype) {
        case "acc": // Always apply regex for acc - no need for test statement
            var regex_str = "[(0-9)".concat(regex_dp_value).concat("]")
            var regex_exp = new RegExp(regex_str, 'g')  //g = global.  Err if missing
            break;

        case "num": // +,-,numbers and whatever user defines as decimal point
            if (num_apply_regex) {
                var regex_str = "[0-9\\-\\+".concat(regex_dp_value).concat("]")
                var regex_exp = new RegExp(regex_str, 'g')
            }
            break;
        default:
            break;
    }

    toBeSorted = [];  // array to hold column values
    NanList = [];  // Items thats are not sortable, i.e. bad data

    //put column items in appropriate array bucket.  Also do any conversions as necessary
    for (let idx = 0; idx < tablebody.length; idx++) {
        var columnItem = tablebody[idx].getElementsByTagName("TD")[colPos].innerText;

        switch (datatype) {
            case "num":
                if (num_apply_regex) {
                    result_arr = columnItem.match(regex_exp)
                    if (result_arr == null) {
                        append_number(columnItem, idx, toBeSorted, NanList);
                        break;
                    }
                    findAndReplace_dp(result_arr, str_dp_value)
                    columnItem = result_arr.join("");
                }

                append_number(columnItem, idx, toBeSorted, NanList)
                break;

            case "acc":
                result_arr = columnItem.match(regex_exp)
                if (result_arr == null) {
                    append_number(columnItem, idx, toBeSorted, NanList)
                    break;
                }
                findAndReplace_dp(result_arr, str_dp_value)

                // if the first and last values are "(" and ")", prefix a - minus sign to the number to signify negative no.
                if ((result_arr[0] == "(") & (result_arr[result_arr.length - 1] == ")")) {
                    let removed_start_bracket = result_arr.splice(0, 1)
                    let endpos = result_arr.length - 1
                    let removed_end_bracket = result_arr.splice(endpos, 1)
                    columnItem = "-".concat(result_arr.join(""));
                } else {
                    columnItem = result_arr.join("");
                }

                append_number(columnItem, idx, toBeSorted, NanList)
                break;

            default:  // default is text mode
                if (caseSensitive) {
                    toBeSorted.push({
                        "originalIdxPos": idx,
                        "item": columnItem
                    });
                } else {
                    toBeSorted.push({
                        "originalIdxPos": idx,
                        "item": columnItem.toLowerCase()
                    });
                }
                break;
        }
    }

    let sortTable_parsing = performance.now()

    //Now sort the items 
    switch (datatype) {
        case "num" || "acc":
            if (dir == 'asc') {
                toBeSorted.sort((a, b) => { return a.item - b.item; })
            } else {
                toBeSorted.sort((a, b) => { return b.item - a.item; })
            }
            break;

        default: // anything else is sorted as text
            if (dir == 'asc') {
                toBeSorted.sort((a, b) => {
                    if (a.item < b.item) { return -1 };
                    if (a.item > b.item) { return 1 };
                    return 0; // items are the same
                })
            } else {
                toBeSorted.sort((a, b) => {
                    if (a.item > b.item) { return -1 };
                    if (a.item < b.item) { return 1 };
                    return 0; // items are the same
                })
            }
            break;
    }

    let sortTable_sorting = performance.now()

    sortedRows = []  //create new table with all items in order with Nan's at the bottom
    toBeSorted.forEach(element => { sortedRows.push(tablebody[element.originalIdxPos]) });
    NanList.forEach(element => { sortedRows.push(tablebody[element.originalIdxPos]) });

    //remove all rows from tbody and add back in sorted order
    const parentNodeVal = tablebody[0].parentNode
    //tablebody.forEach((element) => { element.remove() })

    //parentNodeVal.replaceChildren();
    parentNodeVal.replaceChildren(...sortedRows);

    //Re-attaching all the nodes is much more time consuming than the actual sorting for a large table.  
    //sortedRows.forEach(element => { parentNodeVal.appendChild(element) });
    var sortTable_DOMReattach = performance.now();

    // local session storage - > st ==> sortTable
    // Persistance is until tab is closed
    sessionStorage.setItem('st_entry', sortTable_entry);
    sessionStorage.setItem('st_parse', sortTable_parsing);
    sessionStorage.setItem('st_sort', sortTable_sorting);

}
