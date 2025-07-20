import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { Slider, Button } from "@mui/material";
import getCroppedImg from "./cropUtils";

export default function ImageCropper({ imageSrc, onCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropDone = async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropComplete(croppedImage); // pass blob back to App.jsx
  };

  return (
    <div>
      <div style={{ position: "relative", height: 400, background: "#333" }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
        />
      </div>
      <div style={{ margin: "1rem 0" }}>
        <Slider value={zoom} min={1} max={3} step={0.1} onChange={(e, z) => setZoom(z)} />
        <Button variant="contained" color="primary" onClick={onCropDone}>
          Confirm Crop
        </Button>
      </div>
    </div>
  );
}
