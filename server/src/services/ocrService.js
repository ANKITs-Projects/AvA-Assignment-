const Tesseract = require("tesseract.js");

const extractText = async (imagePath) => {
  const { data } = await Tesseract.recognize(imagePath, "eng");
  return data.text;
};

module.exports = { extractText };