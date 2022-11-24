"use strict";

let database;
let allFiles;

const IMAGE_TYPES = {update: updateImage, extensions:['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg']}
const TABLE_TYPES = {update: updateCardTable, extensions:['xlsx']}
const ALL_TYPES = [IMAGE_TYPES, TABLE_TYPES]

const currentSheetSymbol = Symbol.for('currentSheet');

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

    //delete all old file entries
    const fileList = document.getElementById('filesList');
    removeAllChildNodes(fileList);
    allFiles = [];

    console.log(event.target.files);

    Array.from(event.target.files).forEach(file => { 
        let fileOption = new TempFile(file, URL.createObjectURL(file), file.webkitRelativePath);

        allFiles.push(fileOption);

        fileList.appendChild(fileOption);
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
    database[currentSheetSymbol] = jsonData;

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
    generateSvgPreviewPicture(document.getElementById('svgSource').value, row.getData());
   });
}


//for delayed updating of the SVG image
let triggerSVGChange = debounce(transformTextIntoSvg, 500);

function transformTextIntoSvg(sourceCode, callback = null) {
    const myblob = new Blob([sourceCode], {
        type: 'image/svg+xml'
    });

    //TODO: Hack?
    let url = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(sourceCode);

    //saveSvgAsImage(URL.createObjectURL(myblob), (dataURI) => {
    saveSvgAsImage(url, (dataURI) => {
        console.log(dataURI);

        if (callback != null) {
            callback(dataURI);
        }
    });
}

function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

function saveSvgAsImage(imageUrl, callback) {
    const canvas = document.getElementById('svgCanvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    //img.crossOrigin = "Anonymous";
    img.onload = function() {
        canvas.width = this.width;
        canvas.height = this.height;
        ctx.drawImage(this, 0, 0);

        callback(canvas.toDataURL('image/png'));
    }

    img.src = imageUrl;
}

function generateCards() {
    //iterate over current worksheet
    let currentSheet = database[currentSheetSymbol];

    currentSheet.forEach(row => {
        let sourceCode = applyStringTransformation(document.getElementById('svgSource').value, row, (newSourceCode) => {
            allCards.push(sourceCode);
        });
    });
}

function applyStringTransformation(string, object, callback) {
    while(tagExistsInString(string)) {
        let newstring = string;
        Object.entries(object).forEach(
            ([key, value]) => {
                newstring = newstring.replaceAll(`$(${key})`, value);
            });

                
        let booleanExpressions = newstring.matchAll(/\$\{(?<column>.+)==(?<searchValue>.+)\?(?<valueIfTrue>.+):(?<valueIfFalse>.*)\}/gm);
        Array.from(booleanExpressions).forEach(singleExpression => {
            const column = singleExpression.groups.column;
            const searchValue = singleExpression.groups.searchValue;

            console.log(object, column, searchValue, singleExpression[0]);

            if(object[column] === searchValue) {
                newstring = newstring.replaceAll(singleExpression[0], singleExpression.groups.valueIfTrue);
            } else {
                newstring = newstring.replaceAll(singleExpression[0], singleExpression.groups.valueIfFalse);
            }
        });
        
        console.log(newstring);
        //if no changes are made, cancel loop
        if(newstring === string) {
            break;
        } else {
            string = newstring;
        }
    }

    //edit all XLinks to the local blob dataURI
    const xlinks = getXLinks(string);

    console.log('found xlinks', xlinks);

    if (xlinks === null) {
        callback(string);
    } else {
        xlinks.forEach(imageFile => {
            let correspondingFile = allFiles.find(file => file.filePath == imageFile);

            console.log('!!!!!!!!!!!!', correspondingFile);

            let promise = new Promise(function(resolve, reject) {
                const reader = new FileReader();

                reader.onloadend = function() {
                    resolve(reader.result);
                }

                reader.readAsDataURL(correspondingFile.file);
            });

            promise.then(
                result => {
                    string = string.replaceAll(imageFile, result);
                    console.log('string result!!!!', string);
                    callback(string);
                },
                error => console.log(error)
            )
        });
    }
}

function tagExistsInString(string) {

    const regex = /\$\([^\$\(\)]+\)/g;
    return !(string.match(regex) === null);
}

function generateSvgPreviewPicture(svgSource, tableRow, callback) {

    applyStringTransformation(svgSource, tableRow, (svgText) => {
        transformTextIntoSvg(svgText, (data) => {
            callback(data);
        });
    });
}

function transformWorksheetToImages() {
    //iterate over worksheet
    let archive = new Map();

    let readingData = new Promise(function(resolve, reject) {
        database[currentSheetSymbol].forEach(row => {
            console.log(row);

            //transform row into svg image
            let promise = new Promise(function(resolve, reject) {
                generateSvgPreviewPicture(document.getElementById('svgSource').value, row, (data) => {
                    console.log(row.Name);
                    resolve([row.Name, data]);
                });
            });

            promise.then(
                ([key, value]) => {
                    archive.set(key, value.split('base64,')[1]);

                    if(row === database[currentSheetSymbol].at(-1)) {
                        console.log('resolved!', archive);
                        resolve(archive);
                    }
                },
                error => alert(error)
            );
        });
    });

    readingData.then(
        archive => {
            console.log(archive);

            let zipArchive = createZipArchive(archive);
            promptDownloadArchive(zipArchive);
        },
        error => console.log(error)
    )
}

function createZipArchive(archive) {
    var zip = new JSZip();

    // Generate a directory within the Zip file structure
    var imageFolder = zip.folder("generated-images");

    archive.forEach((fileData, fileName) => {
        imageFolder.file(`${fileName}.png`, fileData, {base64: true});
    });

    return zip;    
}

function promptDownloadArchive(zip) {
    console.log(zip);

    zip.generateAsync({type:"blob"})
    .then(function(content) {
        // Force down of the Zip file
        saveAs(content, "archive.zip");
    });
}

function getXLinks(svgSourceText) {
    const regex = /(?<=xlink:href=")[^"]+(?=")/g
    return svgSourceText.match(regex);
}

function escapeRegex(string) {
    return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}