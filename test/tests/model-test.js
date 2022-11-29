describe('Model tests', () => {
    let model;
    let fileList, sheetnames, exampleXLS;

    beforeEach(() => {
        model = new DataModel();

        fileList = ['123.png', '234.png', 'table.xls', 'readme.txt'];
        sheetnames = ['Sheet 1', 'Sheet 2'];
        exampleXLS = {
            Sheets: {
                'Sheet 1': null,
                'Sheet 2': null
            },
            Sheetnames: sheetnames
        };
    });

    describe('Unit tests', () => {
        it('Model generates a tempfile for each original file', () => {
            const urlToBlob = sinon.stub(URL, 'createObjectURL');

            model.loadFiles(fileList);

            urlToBlob.restore();

            assert.equal(model.files.length, fileList.length);
        });

        it('Model loads a xlsx spreadsheet as a File blob into an internal Object representation', function(done) {
            const load = sinon.stub(XLSX, 'read').callsFake(() => {
                return exampleXLS;
            });

            const sheetToJson = sinon.stub(XLSX.utils, 'sheet_to_json').callsFake(() => {
                return 'stubbed away';
            });

            model.loadDatabase(new Blob()).then(() => {
                load.restore();
                sheetToJson.restore();

                chai.assert.equal(model.database.Sheetnames, sheetnames);
                done();
            });
        });
    });
});