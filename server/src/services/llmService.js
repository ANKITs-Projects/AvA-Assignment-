
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const parseInvoice = async (rawText) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-lite-preview",
  });

  const prompt = `
You are an AI that extracts structured data from invoices.

Extract the following fields:
- invoice_number
- vendor_name
- invoice_date
- total_amount
- currency

Rules:
- Return ONLY raw JSON
- Do NOT use markdown
- Do NOT wrap in \`\`\`
- If missing, return null
- total_amount must be a number

Invoice Text:
${rawText}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(text);

    return parsed;

  } catch (error) {
    console.error("Gemini Error:", error.message);
    console.log("Raw Output:", error);

    return {};
  }
};