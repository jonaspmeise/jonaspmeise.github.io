"use strict";

let database;

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

    let selectedElement = selectContext[selectedIndex];

    updateElementByExtension(selectedElement.filePath.split('.').pop())(selectedElement);
}

function updateElementByExtension(fileExtension) {

    fileExtension = String(fileExtension).toLowerCase();
    
    const found = ALL_TYPES.find((singletype) => 
        singletype.extensions.includes(fileExtension)
    );

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

    let reader = new FileReader();

    reader.onload = function() {
        console.log(reader.result);
    }

    reader.readAsDataURL(imageBlob);
}

function excelFileToJSON(file){

    let reader = new FileReader();

    reader.readAsBinaryString(file);
    reader.onload = (e) => {
        let data = e.target.result;
        let workbook = XLSX.read(data, {
            type : 'binary'
        });

        let sheetnames = workbook.SheetNames;
        let worksheetTabs = document.getElementById('worksheetTabs');

        //delete all current tabs and create a new tab-button for each worksheet
        removeAllChildNodes(worksheetTabs);

        sheetnames.forEach(sheetname => {
            let switchButton = document.createElement('button');

            switchButton.innerHTML = switchButton.name = sheetname;
            switchButton.classList.add('tablinks');
            switchButton.addEventListener('click', function() {renderTable(this.name)});

            worksheetTabs.appendChild(switchButton);
        });

        database = Object.fromEntries(
            sheetnames.map(
                sheetname => [sheetname, XLSX.utils.sheet_to_json(workbook.Sheets[sheetname])]));
        renderTable('Karten');
    };
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

//Method to display the data in HTML Table
function renderTable(sheetname){
    let jsonData = database[sheetname];

    let table = new Tabulator("#cardTable", {
        height: 300,
        data: jsonData,
        layout: "fitColumns",
        //we use the structure information of the first row, because all rows behave identical
        columns: Object.entries(jsonData[0])
            .map(([key, _]) => ({
                title: key,
                field: key
            }))
   });
   
   //trigger an alert message when the row is clicked
   table.on("rowClick", function(e, row){ 
        console.log(row.getData());
   });
}


//for delayed updating of the SVG image
let triggerSVGChange = debounce(renderSVG, 500);

function renderSVG(sourceCode) {
    const myblob = new Blob([sourceCode], {
        type: 'image/svg+xml'
    });

    saveSvgAsImage(URL.createObjectURL(myblob));
}

function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

function saveSvgAsImage(imageUrl) {
    const canvas = document.getElementById('svgCanvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = function() {
        canvas.width = this.width;
        canvas.height = this.height;
        ctx.drawImage(this, 0, 0);

        const downloadableImage = canvas.toDataURL('image/png');
        console.log(downloadableImage);
        var aDownloadLink = document.createElement('a');
        // Add the name of the file to the link
        aDownloadLink.download = 'canvas_image.png';
        // Attach the data to the link
        aDownloadLink.href = downloadableImage;
        // Get the code to click the download link
        aDownloadLink.click();
    }

    img.src = imageUrl;
}
