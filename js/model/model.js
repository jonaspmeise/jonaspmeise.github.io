class Model {
    constructor() {
        console.log('Created Model...');
    }

    loadFiles(array) {
        this._files = array;
    }

    get files() {
        return this._files;
    }

    get database() {
        return this._database;
    }

    loadDatabase(fileBlob) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();

            reader.onload = (e) => {
                let data = e.target.result;
                let workbook = XLSX.read(data, {
                    type : 'binary'
                });

                this._database = Object.fromEntries(workbook.Sheetnames.map(
                    sheetname => [sheetname, XLSX.utils.sheet_to_json(workbook.Sheets[sheetname])]));
                this._database.Sheetnames = workbook.Sheetnames;
                resolve(this._database);                 
            }

            reader.onerror = (e) => {
                reject(e);
            }

            reader.readAsBinaryString(fileBlob);
        });
    }
}
