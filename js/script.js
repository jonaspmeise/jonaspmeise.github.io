"use strict";

//import {TabulatorFull as Tabulator} from 'tabulator-tables';

const IMAGE_TYPES = {update: updateImage, extensions:['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg']}
const TABLE_TYPES = {update: updateCardTable, extensions:['xlsx']}
const ALL_TYPES = [IMAGE_TYPES, TABLE_TYPES]

class TempFile extends Option{
    constructor(file, fileBlob, filePath) {
        super();
        this._file = file;
        this._fileBlob = this.value = fileBlob;
        this._filePath = this.innerHTML = filePath;
    }

    get fileBlob() {
        return this._fileBlob;
    }

    get filePath() {
        return this._filePath;
    }

    get file() {
        return this._file;
    }
}

function uploadFiles(event) {

    Array.from(event.target.files).forEach(file => { 
        let fileOption = new TempFile(file, URL.createObjectURL(file), file.webkitRelativePath);

        document.getElementById('filesList').appendChild(fileOption);
    });
}

function updateListSelection(selectContext, selectedIndex) {

    let selectedElement = selectContext[selectedIndex]

    updateElementByExtension(selectedElement.filePath.split('.').pop())(selectedElement);
}

function updateElementByExtension(fileExtension) {

    fileExtension = String(fileExtension).toLowerCase();
    
    const found = ALL_TYPES.find((singletype) => 
        singletype.extensions.includes(fileExtension)
    );

    console.log(found);

    return found?.update;
}

function updateImage(tempImage, elementId = 'previewImage') {
    document.getElementById(elementId).src = tempImage.fileBlob;
}

function updateCardTable(tempTable, elementId = 'cardTable') {
    console.log(tempTable);
    excelFileToJSON(tempTable.file);
}

function convertToBase64String(imageBlob) {

    console.log(imageBlob);
    let reader = new FileReader();

    reader.onload = function() {
        console.log(reader.result);
    }

    reader.readAsDataURL(imageBlob);
}

function excelFileToJSON(file){
    var reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
        var data = e.target.result;
        var workbook = XLSX.read(data, {
            type : 'binary'
        });
        var result = {};
        //var firstSheetName = workbook.SheetNames[0];
        console.log(workbook.SheetNames);
        //reading only first sheet data
        var jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[2]]);
        //displaying the json result into HTML table
        //displayJsonToHtmlTable(jsonData);
        displayJsonToHtmlTable(jsonData);
    };
}

//Method to display the data in HTML Table
function displayJsonToHtmlTable(jsonData){
    var table = new Tabulator("#cardTable", {
        height:205, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        data:jsonData, //assign data to table
        layout:"fitColumns", //fit columns to width of table (optional)
        columns:[ //Define Table Columns
            {title:"Name", field:"Name", width:150},
            {title:"Level", field:"Level", hozAlign:"left", formatter:"progress"},
            {title:"Kampfwert Color", field:"Kampfwert"},
            {title:"Rüstung", field:"Rüstung"},
            {title:"Anfaengeritem", field:"Anfaengeritem"},
            {title:"Typ", field:"Typ"},
            {title:"Häufigkeit", field:"Häufigkeit"}
        ]
   });
   
   //trigger an alert message when the row is clicked
   table.on("rowClick", function(e, row){ 
        console.log(row.getData());
       alert("Row " + row.getData().Name + " Clicked!!!!");
   });
}