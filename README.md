# 🧠 Civil Engineering NLM – Project Overview

This project is a full-stack OCR + AI pipeline to help Civil Engineering students and educators convert scanned content into structured knowledge using a domain-pure, private language model.

---

## 🎯 Features

✅ Dual OCR Pipeline  
✅ Image Cropping & Preview  
✅ Formula/Image Tagging  
✅ YAML-Based Structured Saving  
✅ Trained Only on Curated Civil Engineering Materials

---

## 📂 Folder Structure

```bash
civil-nlm-project/
├── backend/                  # FastAPI app (OCR, YAML save)
│   ├── main.py
│   └── api/
│       ├── upload.py         # /api/upload (Tesseract)
│       ├── handwritten.py    # /upload-handwritten (TrOCR)
│       └── structured.py     # /save-structured (YAML write)
├── frontend/                 # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── ImageCropper.jsx
│   │   ├── cropUtils.js
│   │   └── imageUtils.js
├── shared/
│   ├── uploads/
│   └── processed/            # YAML saved here
```

---

## 🚀 Setup Instructions

### 🧠 Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 🎨 Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## 🖥️ Web App Flow

1. Choose Document Type (Printed or Handwritten)
2. Upload Image → Preview + Crop
3. Extract OCR (Tesseract or TrOCR)
4. Edit & Tag content (formula/image)
5. Fill metadata (topic, type, author)
6. Click "💾 Save as YAML"

---

## ✍️ YAML Output Example

```yaml
topic: Darcy’s Law
type: theory
content: >
  The discharge rate is given by:
  {{formula: q = k i A}}
  Below is the seepage diagram.
  {{image: seepage-diagram.png}}
source: handwritten
author: Wife
```

Saved to: `/shared/processed/Darcy’s_Law.yaml`

---

## 🔜 Roadmap

- [x] Phase 1: Upload & OCR Pipeline
- [x] Phase 2: Editable Tagging + YAML Save
- [ ] Phase 3: Knowledge Base + Retrieval (FAISS/Chroma)
- [ ] Phase 4: Q&A and Test Generator (MCQ, RAG)
- [ ] Phase 5: Deployment (VPS + Ollama)
