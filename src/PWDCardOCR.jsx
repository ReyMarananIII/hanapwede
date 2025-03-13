import { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";

export default function PwdCardOCR({ formData, setFormData }) {
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  // full name
  useEffect(() => {
    setFormData({
      ...formData,
      name: `${formData.first_name} ${formData.last_name}`.trim(),
    });
  }, [formData.first_name, formData.last_name]);

  // file upload
  const handleImageUpload = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      checkImageBlur(imgURL, file);
    }
  };

  // blur
  const checkImageBlur = (imgURL, file) => {
    const img = new Image();
    img.src = imgURL;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const grayData = getGrayScale(imageData);
      const variance = computeVarianceOfLaplacian(grayData);

      if (variance < 500) {
        setError("Image is too blurry. Please upload a clearer image.");
        setImage(null);
      } else {
        setError("");
        setImage(imgURL);
        processOCR(file);
      }
    };
  };

  
  const getGrayScale = (imageData) => {
    const grayData = [];
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      grayData.push(gray);
    }
    return grayData;
  };

  // para sa blur
  const computeVarianceOfLaplacian = (grayData) => {
    let sum = 0, sumSq = 0;
    for (let i = 1; i < grayData.length - 1; i++) {
      const diff = grayData[i] - grayData[i - 1];
      sum += diff;
      sumSq += diff * diff;
    }
    const mean = sum / grayData.length;
    return sumSq / grayData.length - mean * mean;
  };

  
  const processOCR = (file) => {
    setLoading(true);
    Tesseract.recognize(file, "eng", {
      logger: (m) => console.log(m),
    }).then(({ data: { text } }) => {
      console.log("🔍 Extracted Text:", text);
      extractFields(text);
      setLoading(false);
    });
  };

  // kunin mga details
  const extractFields = (text) => {
    const lines = text.split("\n").map(line => line.trim()).filter(line => line !== "");

    let extractedData = {
      disability: "",
      idNumber: "",
    };

    for (let i = 0; i < lines.length; i++) {
      const currLine = lines[i];

      // kunin disability type
      if (/type of disability/i.test(currLine) && i > 0) {
        extractedData.disability = lines[i - 1];
      }
    }


    const idMatch = text.match(/\b\d{6,}(?:-\d{2,})*\b/);
    if (idMatch) {
      extractedData.idNumber = idMatch[0];
    }

   
    setFormData({
      ...formData,
      user_disability: extractedData.disability,
      ID_number: extractedData.idNumber,
    });
  };

  
  const handleCapture = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-xl font-bold">Upload or Capture PWD Card</h2>
      <p className="text-sm text-muted-foreground"> Please ensure your details are correct before submitting. </p>  
      <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />

      <button type="button" onClick={handleCapture} className="mt-4 bg-[#4CAF50] text-white px-4 py-2 rounded">
  Take Photo / Upload
</button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {image && <img src={image} alt="Uploaded PWD Card" className="mt-4 max-w-xs" />}
      {loading && <p className="mt-4 text-blue-500">Processing image, please wait...</p>}

      <div className="mt-4 w-full max-w-md p-4 border rounded bg-gray-100">
        <h3 className="text-lg font-semibold">Extracted Details</h3>
        <form className="mt-2 flex flex-col gap-2">
          <label className="text-sm">Name</label>
          <input type="text" className="border p-2 rounded" value={formData.name} readOnly />

          <label className="text-sm">Type of Disability</label>
          <input type="text" className="border p-2 rounded" value={formData.user_disability} readOnly />

          <label className="text-sm">ID Number</label>
          <input type="text" className="border p-2 rounded" value={formData.ID_number} readOnly />
        </form>
      </div>
    </div>
  );
}
