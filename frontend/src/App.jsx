import { useState } from "react";
import ImageCropper from "./ImageCropper";

function App() {
  const [file, setFile] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [croppedBlob, setCroppedBlob] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [message, setMessage] = useState("");
  const [docType, setDocType] = useState("printed");
  const [cropping, setCropping] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setImageURL(URL.createObjectURL(selected));
      setCropping(true);
      setOcrText("");
      setMessage("");
    }
  };

  const handleCropComplete = (blob) => {
    setCroppedBlob(blob);
    setCropping(false);
  };

  const handleUpload = async () => {
    const uploadBlob = croppedBlob || file;
    if (!uploadBlob) {
      setMessage("Please select and crop an image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadBlob, "cropped.jpg");

    const route = docType === "handwritten" ? "/upload-handwritten" : "/api/upload";

    setMessage("Uploading...");
    try {
      const response = await fetch(`http://localhost:8000${route}`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.error) throw new Error(result.error);

      setMessage(`Uploaded: ${result.filename}`);
      setOcrText(result.ocr_text || result.text || "");
    } catch (err) {
      console.error(err);
      setMessage("Upload failed: " + err.message);
    }
  };

  const insertTag = (tag) => {
    const textarea = window.ocrTextarea;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newText =
      ocrText.substring(0, start) + tag + ocrText.substring(end);
    setOcrText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + tag.length;
    }, 0);
  };

  const handleSaveStructured = async () => {
    const topic = document.getElementById("topic").value.trim();
    const type = document.getElementById("type").value.trim();
    const author = document.getElementById("author").value.trim();

    if (!topic || !type || !ocrText) {
      alert("Please enter topic, type, and OCR content.");
      return;
    }

    const data = {
      topic,
      type,
      text: ocrText,
      source: docType,
      author: author || "unknown",
    };

    try {
      const res = await fetch("http://localhost:8000/save-structured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.status === "success") {
        alert("✅ Saved to backend as YAML: " + result.file);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      alert("❌ Failed to save: " + err.message);
    }
  };


  return (
    <div style={{ padding: "2rem", fontFamily: "Arial", maxWidth: "700px", margin: "auto" }}>
      <h2>📤 Upload Civil Engineering Document</h2>

      <div style={{ margin: "1rem 0" }}>
        <label>
          <input
            type="radio"
            name="docType"
            value="printed"
            checked={docType === "printed"}
            onChange={() => setDocType("printed")}
          />
          Printed (Tesseract)
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="radio"
            name="docType"
            value="handwritten"
            checked={docType === "handwritten"}
            onChange={() => setDocType("handwritten")}
          />
          Handwritten (TrOCR)
        </label>
      </div>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {imageURL && cropping && (
        <ImageCropper imageSrc={imageURL} onCropComplete={handleCropComplete} />
      )}

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
        Upload & Extract Text
      </button>

      <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>

      {ocrText && (
        <div style={{ marginTop: "2rem" }}>
          <h3>📝 OCR Text (Editable)</h3>

          <div style={{ marginBottom: "0.5rem" }}>
            <button onClick={() => insertTag("{{formula: }}")} style={{ marginRight: "1rem" }}>
              ➕ Formula
            </button>
            <button onClick={() => insertTag("{{image: filename.png}}")}>
              🖼️ Image
            </button>
          </div>

          <textarea
            value={ocrText}
            onChange={(e) => setOcrText(e.target.value)}
            rows={15}
            style={{
              width: "100%",
              fontSize: "1rem",
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "5px",
              whiteSpace: "pre-wrap",
            }}
            ref={(el) => (window.ocrTextarea = el)}
          />

          <h4 style={{ marginTop: "1rem" }}>🗂️ Save as Structured YAML</h4>
          <div style={{ marginBottom: "0.5rem" }}>
            <input placeholder="Topic" id="topic" style={{ marginRight: "1rem" }} />
            <input placeholder="Type (e.g. theory)" id="type" style={{ marginRight: "1rem" }} />
            <input placeholder="Author" id="author" />
          </div>

          <button
            onClick={handleSaveStructured}
            style={{
              backgroundColor: "#2196F3",
              color: "white",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            💾 Save as YAML
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
