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
        // CONVERTER UM HTML PARA PDF E SALVAR EM UM CAMINHO ESPECIFICO
        await convertHTMLtoPDFFile(htmlContent, filePath);

        // CONVERTER UM HTML PARA PDF E RETORNAR UM BUFFER
        const pdfBuffer = await convertHTMLtoPDFBuffer(htmlContent, filePath);

        // INSERIR UMA SENHA NO ARQUIVO PDF E SALVAR EM UM CAMINHO ESPECIFICO
        await encryptPDF(filePath, fileEncryptedPath, password);

        // DELETAR O ARQUIVO INICIAL SEM SENHA
        await deleteFiles(filePath);

        console.log("Sucesso ao gerar o PDF e encriptar");
    } catch (error) {
        console.log("Ocorreu um erro: " + error)
    }
}

main();