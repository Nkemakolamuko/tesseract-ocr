import React, { useState } from "react";
import Header from "./Header";
import { FiLoader } from "react-icons/fi";
import PlateRecognition from "./PlateRecognition";
import { useAuth } from "../UserContext";
import CounterTracker from "./CounterTracker";

const WelcomePage = () => {
  const { currentUser, userData, loading } = useAuth();
  const [start, setStart] = useState(false);

  if (loading) {
    return (
      <div>
        <FiLoader className="w-24 h-24 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="p-2 flex flex-col gap-3 my-2">
        {!start && (
          <div className="bg-white py-4 px-2 rounded-lg shadow-sm w-full max-w-md">
            {currentUser && (
              <h2 className="md:text-2xl text-lg font-bold mb-2">
                {userData && (
                  <p className="font-semibold text-[#0000f1]">
                    {userData.churchName}
                  </p>
                )}
              </h2>
            )}
            <p className="text-sm md:text-base">Good morning </p>
            {currentUser && (
              <div className="text-sm md:text-base flex items-center gap-1 text-nowrap">
                <p>welcome to </p>
                {/* <p>Email: {currentUser.email}</p> */}
                {userData && (
                  <p className="font-semibold text-[#0000f1]">
                    {userData.churchName}
                  </p>
                )}
                <p className="truncate">vehicle counter dashboard.</p>
              </div>
            )}
          </div>
        )}
        <p
          className={`py-2 ${
            !start
              ? "bg-[#0000f1] border-b-4 px-3 border-[#0f8bff]"
              : "bg-rose-500 border-b-4 px-3 border-rose-300"
          } text-white font-medium rounded-md outline w-fit shadow-md active:scale-x-95`}
          onClick={() => setStart(!start)}
        >
          {start ? "End Session" : "Start Counting"}
        </p>
      </div>

      {!start && (
        <div className="p-2">
          <p className="text-sm md:text-base">Click on any to see all.</p>
          <CounterTracker />
        </div>
      )}

      {start && <PlateRecognition />}
    </>
  );
};

export default WelcomePage;
