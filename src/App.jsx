import { useState } from "react";
import Tesseract from "tesseract.js";
import "./App.css";
import ImageCropper from "./components/ImageCropper";

function App() {
  const [imagePath, setImagePath] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copyText, setCopyText] = useState(false);
  const [crop, setCrop] = useState(false);

  const handleChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImagePath(URL.createObjectURL(event.target.files[0]));
    }
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
          let confidence = result.data.confidence;
          let text = result.data.text;
          setText(text);
          setLoading(false);
        });
    } else {
      console.error("No image selected");
    }
  };

  // Generating Cropped Image When Done Button Clicked
  const onCropDone = (imgCroppedArea) => {
    const canvasEle = document.createElement("canvas");
    canvasEle.width = imgCroppedArea.width;
    canvasEle.height = imgCroppedArea.height;

    const context = canvasEle.getContext("2d");

    let imageObj1 = new Image();
    imageObj1.src = imagePath;
    imageObj1.onload = function () {
      context.drawImage(
        imageObj1,
        imgCroppedArea.x,
        imgCroppedArea.y,
        imgCroppedArea.width,
        imgCroppedArea.height,
        0,
        0,
        imgCroppedArea.width,
        imgCroppedArea.height
      );

      const dataURL = canvasEle.toDataURL("image/jpeg");

      setImagePath(dataURL);
      setCrop(false);
    };
  };

  // Handle Cancel Button Click
  const onCropCancel = () => {
    setCrop(false);
    // setImage("");
  };

  // Copy Image Text
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyText(true);
      setTimeout(() => setCopyText(false), 2000);
    });
  };

  return (
    <div className={`md:max-w-3xl ${!crop && "p-4"} w-full mx-auto relative`}>
      {crop && (
        <ImageCropper
          image={imagePath}
          onCropCancel={onCropCancel}
          onCropDone={onCropDone}
        />
      )}
      <main className="flex flex-col items-center">
        <h3 className="text-xl mb-4">
          {imagePath ? "Selected Image" : "Image To Text"}
        </h3>
        <div className="h-[30vh] border border-dashed w-full mb-4">
          {imagePath && (
            <img
              src={imagePath}
              className="mb-4 h-full w-fit mx-auto"
              alt="uploaded"
            />
          )}
        </div>
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
            accept="image/*"
            onChange={handleChange}
            className="hidden"
            id="file-input"
          />
          {!loading && (
            <div className="flex items-center w-fit mx-auto gap-2">
              <label
                htmlFor="file-input"
                className="mb-4 px-4 py-2 border border-gray-300 w-fit mx-auto rounded-lg cursor-pointer bg-[#292929] text-white font-semibold text-nowrap text-sm md:text-base"
              >
                {imagePath ? "Choose Another Image" : "Choose Image"}
              </label>
              {imagePath && (
                <p
                  className="mb-4 px-4 py-2 border-2 border-gray-300 w-fit mx-auto rounded-lg cursor-pointer font-semibold text-nowrap text-sm md:text-base"
                  onClick={() => {
                    setCrop(true);
                  }}
                >
                  Crop Image
                </p>
              )}
            </div>
          )}

          <div className="h-[1px] mb-2 w-full bg-gray-300"></div>

          {imagePath ? (
            <button
              onClick={handleClick}
              className={`bg-[#0000f1] text-white outline-double md:p-3 p-2 font-semibold w-[95%] md:w-[60%] mx-auto ${
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
