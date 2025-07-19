from fastapi import APIRouter, UploadFile, File
import os
import shutil
from services.ocr import extract_text_from_image

router = APIRouter()

UPLOAD_DIR = "/Users/brijeshrai/Documents/civil_engg_project/civil-nlm-project/shared/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # Run OCR
    extracted_text = extract_text_from_image(file_path)

    return {
        "filename": file.filename,
        "status": "uploaded",
        "text": extracted_text
    }
