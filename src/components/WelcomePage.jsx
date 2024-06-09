import React, { useState } from "react";
import Header from "./Header";
import PlateRecognition from "./PlateRecognition";

const WelcomePage = () => {
  const [start, setStart] = useState(false);
  return (
    <>
      {/* <Header /> */}
      <div className="p-2 flex flex-col gap-3 my-4">
        <p className="text-lg font-medium">Welcome,</p>
        <p
          className={`py-2 px-8 ${
            !start
              ? "bg-[#0000f1] border-b-4 border-[#0f8bff]"
              : "bg-rose-500 border-b-4 border-rose-300"
          } text-white font-medium rounded-md outline w-fit shadow-md active:scale-x-95`}
          onClick={() => setStart(!start)}
        >
          {start ? "End" : "Start"}
        </p>
      </div>

      {start && <PlateRecognition />}
    </>
  );
};

export default WelcomePage;
