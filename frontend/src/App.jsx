import { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setMessage(`Uploaded: ${result.filename}`);
    } catch (error) {
      console.error("Upload failed", error);
      setMessage("Upload failed. Check backend.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>📤 Upload Document</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ marginTop: "1rem" }}
      />
      <br />
      <button
        onClick={handleUpload}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Upload
      </button>
      <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>
    </div>
  );
}

export default App;
