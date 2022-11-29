class TemporaryFile {
    constructor(...args) {
        [this._file, this._fileBlob, this._filePath] = args;
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