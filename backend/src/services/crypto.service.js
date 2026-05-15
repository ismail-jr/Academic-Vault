const crypto = require("crypto");
const fs = require("fs");

// AES encrypt file
const encryptFile = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    const key = crypto.randomBytes(32); // AES-256
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);

    input.pipe(cipher).pipe(output);

    output.on("finish", () => {
      resolve({
        key: key.toString("base64"),
        iv: iv.toString("base64"),
      });
    });

    output.on("error", reject);
  });
};

// RSA encrypt AES key
const encryptAESKey = (aesKey, publicKey) => {
  const buffer = Buffer.from(aesKey, "base64");

  const encrypted = crypto.publicEncrypt(publicKey, buffer);

  return encrypted.toString("base64");
};

// decrypt AES key using RSA private key
const decryptAESKey = (encryptedKey, privateKey) => {
  const buffer = Buffer.from(encryptedKey, "base64");

  const decrypted = crypto.privateDecrypt(privateKey, buffer);

  return decrypted.toString("base64");
};

const decryptFile = (inputPath, outputPath, keyBase64, ivBase64) => {
  return new Promise((resolve, reject) => {
    const key = Buffer.from(keyBase64, "base64");
    const iv = Buffer.from(ivBase64, "base64");

    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);

    input.pipe(decipher).pipe(output);

    output.on("finish", resolve);
    output.on("error", reject);
  });
};

module.exports = {
  encryptFile,
  encryptAESKey,
  decryptAESKey,
  decryptFile,
};
