import Tesseract from "tesseract.js";

export const extractText = async (imagePath) => {
  const { data } = await Tesseract.recognize(imagePath, "eng");
  return data.text;
};