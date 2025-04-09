import { useState, useRef, useEffect } from "react";


export default function PwdCardOCR({ formData, setFormData, onFileChange }) {
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
      onFileChange(file);
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
      const sharpness = computeVarianceOfLaplacian(grayData);
  

  
      // Set a threshold for sharpness (adjust as needed)
      const threshold = 140; 
      if (sharpness < threshold) {
        console.log("Applying Grayscale for OCR...");
        for (let i = 0; i < imageData.data.length; i += 4) {
          const gray = grayData[i / 4];
          imageData.data[i] = gray;
          imageData.data[i + 1] = gray;
          imageData.data[i + 2] = gray;
        }
        ctx.putImageData(imageData, 0, 0);
      }
  
      canvas.toBlob((blob) => {
        if (blob) {
          setError("");
          setImage(canvas.toDataURL()); 
          processOCR(blob); 
      

        
        }
      }, "image/png");
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

 
  
  const processOCR = async (file) => {
    setLoading(true);
  
    const ocrFormData = new FormData(); // Temporary FormData for OCR
    ocrFormData.append("image", file);
    console.log("Image File in OCR:", file);
    console.log("Form Data:", ocrFormData.get("image"));
  
    try {
      const response = await fetch("https://hanapwede.com/api/ocr/", {
        method: "POST",
        body: ocrFormData,
      });
  
      const data = await response.json();
      console.log("🔍 Extracted Text:", data.text);
  
      extractFields(data.text);
    } catch (error) {
      console.error("OCR Error:", error);
      setError("Failed to process image.");
    } finally {
      setLoading(false);
    }
  };

  // kunin mga details
  const extractFields = (text) => {
    let extractedData = {
      disability: "",
      idNumber: "",
    };
  
    let cleanedText = text.replace(/[_]/g, " ").replace(/\.+/g, "").toLowerCase();
  
    // List of disabilities with flexible matching
    const disabilityRegexList = [
      { name: "Deaf or Hard of Hearing", pattern: /\b(deaf|d[ea]{2}f|hard\s*of\s*hearing|hear\w*|h[ea]{2}r\w*)\b/i },
      { name: "Learning Disability", pattern: /\b(learning|lear\w*\s*(disabil\w*|impair\w*)|lea)\b/i },
      { name: "Mental Disability", pattern: /\b(mental|ment\w*\s*(disabil\w*|impair\w*)|men)\b/i },
      { name: "Physical Disability (Orthopedic)", pattern: /\b(physical|phy\w*\s*(disabil\w*|impair\w*|ortho\w*)|phy)\b/i },
      { name: "Psychosocial Disability", pattern: /\b(psychosocial|\w*chosocial|\w*hosocial|\w*osocial|psych\w*\s*(disabil\w*|impair\w*)|pscho\w*|psy)\b/i },
      { name: "Speech and Language Impairment", pattern: /\b(speech|spe\w*\s*(impair\w*|disabil\w*)|spe)\b/i },
      { name: "Visual Disability", pattern: /\b(visual|vis\w*\s*(disabil\w*|impair\w*)|vis)/i },  // Removed \b at the end
      { name: "Intellectual Disability", pattern: /\b(intellectual|intel\w*\s*(disabil\w*|impair\w*)|intelectual|int)\b/i },
     
      { name: "Cancer (RA11215)", pattern: /\b(cancer|canc\w*\s*\(?r[ao]?t?\s*[01il!]{1}[0-9]{3,4}[il1]?\)?)\b/i },
      { name: "Rare Disease (RA10747)", pattern: /\b(rare disease|rare\s*dise\w*\s*\(?ra?\s*10747\)?)\b/i },
  ];
  
  
  
  
    // Find the first matching disability
    for (let { name, pattern } of disabilityRegexList) {
      if (pattern.test(cleanedText)) {
        extractedData.disability = name;
        break;
      }
    }
  
    // Extract ID Number
    const idMatch = cleanedText.match(/id no[.:_]*\s*([\d\s-]+)/i);
if (idMatch) {
  let extractedID = idMatch[1].replace(/\D/g, "").trim();

  if (extractedID) {
    extractedData.idNumber = extractedID;
    console.log("ID Number Match:", extractedData.idNumber);
  } else {
    console.log("ID Match Found, but Empty - Falling Back");
    
    // Get all number matches and find the longest one
    const allNumbers = cleanedText.match(/\b\d[\d\s-]*\d\b/g);
    if (allNumbers) {
      extractedData.idNumber = allNumbers
        .map(num => num.replace(/\D/g, "").trim()) // Remove non-digits
        .reduce((a, b) => (a.length >= b.length ? a : b), ""); // Pick longest
    }
  }
} else {
  console.log("No ID NO. Found - Using Fallback");

  // Get all number matches and find the longest one
  const allNumbers = cleanedText.match(/\b\d[\d\s-]*\d\b/g);
  if (allNumbers) {
    extractedData.idNumber = allNumbers
      .map(num => num.replace(/\D/g, "").trim()) // Remove non-digits
      .reduce((a, b) => (a.length >= b.length ? a : b), ""); // Pick longest
  }
}

    
  
setFormData(prevFormData => ({
  ...prevFormData,
  user_disability: extractedData.disability,
  ID_number: extractedData.idNumber,
}));
  
    console.log("Extracted Data:", extractedData);
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

   
    </div>
  );
}
