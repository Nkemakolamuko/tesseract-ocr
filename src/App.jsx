import { useState } from "react";
import Tesseract from "tesseract.js";
import "./App.css";

function App() {
  const [imagePath, setImagePath] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copyText, setCopyText] = useState(false);

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

        <h3 className="text-xl mb-2">Extracted text</h3>
        <div className="relative mb-4 p-4 border border-gray-300 rounded w-full md:w-96">
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
          className="mb-4 p-2 border border-gray-300 rounded cursor-pointer"
        />
        {imagePath ? (
          <button
            onClick={handleClick}
            className={`bg-blue-500 text-white outline-double p-2 font-semibold ${
              loading && "opacity-60 cursor-wait"
            } rounded disabled:opacity-50`}
            disabled={loading}
          >
            {loading ? "Converting..." : "Convert to text"}
          </button>
        ) : (
          <button
            className={`outline-double p-2 font-semibold 
          } rounded disabled:opacity-50`}
          >
            No Image Selected
          </button>
        )}
      </main>
    </div>
  );
}

export default App;
