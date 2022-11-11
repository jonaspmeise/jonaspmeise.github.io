"use strict";

function uploadFiles(event) {
    const list = document.createElement('ul');

    console.log(event);

    Array.from(event.target.files).forEach(file => { 
        console.log(file);

        const listItem = document.createElement('li');
        list.appendChild(listItem);

        const image = document.createElement('img');
        const url = URL.createObjectURL(file);;
        image.src = url
        image.height = 100;

        listItem.appendChild(image);
        console.log(image.src);

        let fileOption = document.createElement('option');
        fileOption.value = file.webkitRelativePath;
        fileOption.innerHTML = file.webkitRelativePath;

        document.getElementById('filesList').appendChild(fileOption);
    });
}

function readFiles(source) {
    let reader = new FileReader();
    reader.onload = function (evt) {
        console.log(evt.target.result);
    }

    reader.readAsText(document.getElementById(source).files[0], 'UTF-8');
}