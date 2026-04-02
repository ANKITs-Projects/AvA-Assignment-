import axios from "axios";

export const uploadInvoice = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post("http://localhost:8000/upload", formData);
  return res.data;
};