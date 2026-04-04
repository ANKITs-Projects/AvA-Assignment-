import { useState } from "react";
import { uploadInvoice } from "../api/api";

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    setLoading(true);
    const res = await uploadInvoice(file);
    setResult([res.data, ...result]);
    setLoading(false);
    setFile(null);
  };

  return (
    <div>
      <h2>Upload Invoice</h2>

      <div className="flex justify-center items-center ">
        <div className="bg-gray-900  p-2 rounded-2xl shadow-lg flex items-center gap-4 border border-gray-700">
          <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl transition">
            Choose File
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
          {file && (
            <p className="text-green-400 text-sm">Selected: {file.name}</p>
          )}
          <button
            onClick={handleUpload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition"
          >
            Upload
          </button>
        </div>
      </div>

      {loading && (
        <div style={{ marginTop: "20px" }}>
          <h2>Analytics Dashboard</h2>
          <p>Coming soon...</p>
        </div>
      )}

      <div className="mx-auto mt-5 w-[60%] flex flex-col gap-2">
        {result.length > 0 &&
          result.map((ele, i) => {
            return (
              <div
                key={i}
                className="bg-zinc-300  text-zinc-950 rounded-2xl flex flex-col"
              >
                {Object.keys(ele).map((key, i) => {
                  return (
                    <div key={i} className="flex justify-evenly p-1">
                      <span className="w-[30%] text-start uppercase font-bold">
                        {key}
                      </span>{" "}
                      <span className="w-[30%] text-start">:</span>
                      <span className="  w-[30%] text-start font-mono">
                        {ele[key]}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
}
