const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const parseInvoice = async (rawText) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-lite-preview",
  });

  const prompt = `
Extract invoice data as JSON:
- invoice_number
- vendor_name
- invoice_date
- total_amount
- currency

Return ONLY raw JSON. No markdown.

Text:
${rawText}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean markdown
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(text);

  } catch (err) {
    console.error("Gemini Error:", err.message);
    return {};
  }
};

module.exports = { parseInvoice };