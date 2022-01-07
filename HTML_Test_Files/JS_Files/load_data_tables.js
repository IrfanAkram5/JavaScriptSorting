// Written by  : Irfan Akram
// Date        : 25/12/2021
// License     : GNU GPLv3
// Github Location: https://github.com/IrfanAkram5/JavaScriptSorting
// Note that the fetch command needs a live server.  Run in vs code with the live server extension

function loadTableData(event) {

    let filename = fullFileName = "";
    filename = event.srcElement.name;
    fullFileName = filename.concat(".html");

    const h2_title = document.getElementById("HeadingH2");
    let h2_text = "Loading ".concat(filename, ".......");
    h2_title.innerHTML = h2_text;

    fetch(fullFileName)
        .then((response) => {
            return response.text()
        })
        .then((html) => { 
            table_t1 = document.getElementById("t1");
            table_t1.innerHTML = html;
            h2_text = "Loading of ".concat(filename, " finished");
            h2_title.innerText = h2_text;
        })
        .catch((err) => {
            console.log(err)
        })

}


// This a custom event to retrieve and display the timing of the main sorting script
document.addEventListener("sortTable_timers", () => {
    entryTime = sessionStorage.getItem('st_entry')
    parseTime = sessionStorage.getItem('st_parse') - entryTime;
    sortTime = sessionStorage.getItem('st_sort') - sessionStorage.getItem('st_parse');
    reattachTime = sessionStorage.getItem(`st_DOMreattach`) - sessionStorage.getItem('st_sort');

    const parseElem = document.getElementById('parse')
    let parseNodeStr = String(parseTime.toFixed(2)) + "ms";
    parseElem.innerText = parseNodeStr

    const sortElem = document.getElementById('sort');
    let sortNodeStr = sortTime.toFixed(2).toString() + "ms";
    sortElem.innerText = sortNodeStr;

    const attachElem = document.getElementById('attach')
    let reattachDOMStr = reattachTime.toFixed(2).toString() + "ms";
    attachElem.innerText = reattachDOMStr;

})