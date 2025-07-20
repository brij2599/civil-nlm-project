from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import os
import yaml

router = APIRouter()

SAVE_DIR = "../../shared/processed"
os.makedirs(SAVE_DIR, exist_ok=True)

@router.post("/save-structured")
async def save_structured(request: Request):
    try:
        data = await request.json()
        topic = data.get("topic", "untitled").replace(" ", "_")
        filename = f"{topic}.yaml"

        yaml_data = {
            "topic": data.get("topic", "Untitled"),
            "type": data.get("type", "theory"),
            "content": data.get("text", ""),
            "source": data.get("source", "unknown"),
            "author": data.get("author", "unknown"),
        }

        with open(os.path.join(SAVE_DIR, filename), "w") as f:
            yaml.dump(yaml_data, f, sort_keys=False)

        return {"status": "success", "file": filename}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
