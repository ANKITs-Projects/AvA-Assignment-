import { useState } from "react";
import { uploadInvoice } from "../api/api";
import Dashboard from "./Dashboard";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    setLoading(true)
    const res = await uploadInvoice(file);
    setResult([res.data, ...result]);
    setLoading(false)
  };

  return (
    <div>
      <h2>Upload Invoice</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button onClick={handleUpload}>Upload</button>
      {
        loading && <Dashboard/>
      }
      {result.length > 0 && (
        result.map((ele, i)=> {
          return <pre key={i}>{JSON.stringify(ele, null, 2)}</pre>
        })
      )}
    </div>
  );
}