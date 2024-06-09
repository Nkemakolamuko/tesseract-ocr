import { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "./App.css";

function App() {
  const [imagePath, setImagePath] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copyText, setCopyText] = useState(false);
  const [crop, setCrop] = useState({ aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imageRef = useRef(null);

  const handleChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const objectURL = URL.createObjectURL(file);
      setImagePath(objectURL);
    }
  };

  const handleCropComplete = (crop) => {
    setCompletedCrop(crop);
  };

  const getCroppedImg = () => {
    if (!completedCrop || !imageRef.current) {
      return;
    }
    const canvas = document.createElement("canvas");
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      imageRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    canvas.toBlob((blob) => {
      const croppedImageUrl = URL.createObjectURL(blob);
      setImagePath(croppedImageUrl);
    });
  };

  const handleClick = () => {
    if (imagePath) {
      setLoading(true);
      Tesseract.recognize(imagePath, "eng", {
        logger: (m) => console.log(m),
      })
        .catch((err) => {
          console.error(err);
        })
        .then((result) => {
          const text = result.data.text;
          setText(text);
          setLoading(false);
        });
    } else {
      console.error("No image selected");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyText(true);
      setTimeout(() => setCopyText(false), 2000);
    });
  };

  return (
    <div className="App p-4 md:max-w-3xl w-full mx-auto">
      <main className="flex flex-col items-center">
        <h3 className="text-xl mb-4">
          {imagePath ? "Crop the Image" : "Image To Text"}
        </h3>
        <div className="w-full mb-4">
          {imagePath && (
            <ReactCrop
              src={imagePath}
              crop={crop}
              ruleOfThirds
              onImageLoaded={(img) => (imageRef.current = img)}
              onChange={(newCrop) => setCrop(newCrop)}
              onComplete={handleCropComplete}
            />
          )}
        </div>
        {completedCrop && (
          <button
            onClick={getCroppedImg}
            className="mb-4 px-4 py-2 border border-gray-300 w-fit mx-auto rounded-lg cursor-pointer bg-[#292929] text-white font-semibold"
          >
            Confirm Crop
          </button>
        )}
        <div className="flex flex-col border w-full py-2 rounded">
          <h3 className="text-xl mb-2 text-center">Extracted text</h3>
          <div className="relative mb-4 p-4 border border-gray-300 rounded w-[95%] mx-auto md:w-96">
            <p>{text}</p>
            {text && (
              <button
                onClick={handleCopy}
                className="absolute top-0 right-0 mt-2 mr-2 bg-green-500 text-white p-1 rounded shadow-lg active:scale-95 active:shadow-none"
              >
                {copyText ? "Copied" : "Copy"}
              </button>
            )}
          </div>

          <input
            type="file"
            onChange={handleChange}
            className="hidden"
            id="file-input"
          />
          {!loading && (
            <label
              htmlFor="file-input"
              className="mb-4 px-4 py-2 border border-gray-300 w-fit mx-auto rounded-lg cursor-pointer bg-[#292929] text-white font-semibold"
            >
              Select Image
            </label>
          )}

          <div className="h-[1px] mb-2 w-full bg-gray-300"></div>

          {imagePath ? (
            <button
              onClick={handleClick}
              className={`bg-[#0000f1] text-white outline-double p-3 font-semibold w-[95%] md:w-[60%] mx-auto ${
                loading && "opacity-60 cursor-wait"
              } rounded disabled:opacity-50`}
              disabled={loading}
            >
              {loading ? "Extracting..." : "Extract text"}
            </button>
          ) : (
            <button
              className="outline-double p-3 w-[95%] md:w-[60%] mx-auto font-semibold rounded disabled:opacity-50"
              disabled
            >
              No Image Selected
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
