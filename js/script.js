"use strict";

class ImageFile {
    constructor(file, filePath) {
        this._file = file;
        this._filePath = filePath;
    }
}

function uploadFiles(event) {

    Array.from(event.target.files).forEach(file => { 
        let fileOption = document.createElement('option');
        fileOption.value = URL.createObjectURL(file);
        fileOption.innerHTML = file.webkitRelativePath;

        document.getElementById('filesList').appendChild(fileOption);
    });
}

function updateImage(event) {
    document.getElementById('previewImage').src = event.target.value;
    convertToBase64String(event.target.value);
}


function convertToBase64String(imageBlob) {
    console.log(imageBlob);
    let reader = new FileReader();

    reader.onload = function() {
        console.log(reader.result);
    }

    reader.readAsDataURL(imageBlob);
}