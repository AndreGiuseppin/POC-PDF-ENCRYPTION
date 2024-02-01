const pdf = require('html-pdf');
const coherentpdf = require('coherentpdf');
const fs = require('fs').promises;

async function convertHTMLtoPDFFile(htmlContent, filePath) {
    const options = { format: 'A4' };
  
    return new Promise((resolve, reject) => {
        pdf.create(htmlContent, options).toFile(filePath, (err, res) => {
            if (err) {
                reject(err);
            } 
            else {
                resolve(res.filename);
            }
        });
    });
}

async function convertHTMLtoPDFBuffer(htmlContent, filePath) {
    const options = { format: 'A4' };
  
    return new Promise((resolve, reject) => {
        pdf.create(htmlContent, options).toBuffer((err, buffer) => {
            if (err) {
                reject(err);
            } 
            else {
                resolve(buffer);
            }
        });
    });
}

async function encryptPDF(filePath, fileEncryptedPath, password) { 
    var pdf = coherentpdf.fromFile(filePath, '');

    var permissions = [coherentpdf.noEdit];
    coherentpdf.toFileEncrypted(pdf, coherentpdf.aes256bitisofalse, permissions, '', password, false, false, fileEncryptedPath);

    coherentpdf.deletePdf(pdf);
}

async function deleteFiles(filePath) {
    await fs.unlink(filePath);
}

async function main() {
    const htmlContent = '<html><body><h1>Hello, World!</h1></body></html>';
    const filePath = `filePath.pdf`;
    const fileEncryptedPath = `filePath-encrypted.pdf`;
    const password = '1234';

    try{
        // CONVERT A HTML TO PDF AND SAVE IN SPECIFIC PATH
        await convertHTMLtoPDFFile(htmlContent, filePath);

        // CONVERT A HTML TO PDF AND RETURN A BUFFER
        const pdfBuffer = await convertHTMLtoPDFBuffer(htmlContent, filePath);

        // INSERT A PASSWORD IN THE PDF FILE AND SAVE IN SPECIFIC PATH
        await encryptPDF(filePath, fileEncryptedPath, password);

        // DELETE THE INITIAL FILE WITHOUT PASSWORD
        await deleteFiles(filePath);

        console.log("Success in generating and encrypt PDf");
    } catch (error) {
        console.log("An error occurred: " + error)
    }
}

main();
