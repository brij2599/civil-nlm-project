from fastapi import APIRouter, UploadFile, File
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image, ImageOps, ImageFilter
import io

router = APIRouter()

processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten")
model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten")

@router.post("/upload-handwritten")
async def upload_handwritten(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        try:
            image = Image.open(io.BytesIO(contents)).convert("L")
            image = image.point(lambda x: 0 if x < 140 else 255, '1')
            image = image.filter(ImageFilter.MedianFilter(size=3))
            image = image.convert("RGB")
        except Exception as img_error:
            return {"error": f"Image preprocessing failed: {str(img_error)}"}

        try:
            pixel_values = processor(images=image, return_tensors="pt").pixel_values
            generated_ids = model.generate(pixel_values)
            text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
            return {"filename": file.filename, "ocr_text": text}
        except Exception as model_error:
            return {"error": f"OCR failed: {str(model_error)}"}

    except Exception as e:
        return {"error": f"Unhandled exception: {str(e)}"}

