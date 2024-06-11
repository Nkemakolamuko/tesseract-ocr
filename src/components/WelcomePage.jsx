import React, { useState, useEffect } from "react";
import { FiLoader } from "react-icons/fi";
import PlateRecognition from "./PlateRecognition";
import { useAuth } from "../UserContext";
import CounterTracker from "./CounterTracker";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { FaTrash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import ConfirmationModal from "./ConfirmationModal";

const WelcomePage = () => {
  const { currentUser, userData, loading, plateNumbers, refreshPlateNumbers } =
    useAuth();
  const [start, setStart] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [dataLoading, setDataLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good morning");
    } else if (currentHour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  useEffect(() => {
    setDataLoading(false);
    refreshPlateNumbers();
  }, [plateNumbers]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "phoneNumbers", id));
      await refreshPlateNumbers(); // Refresh the plate numbers after deletion
      toast.success("Deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("Error deleting document.");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  if (loading || dataLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <FiLoader className="w-24 h-24 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Toaster />
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
            <p className="text-sm md:text-base">{greeting}</p>
            {currentUser && (
              <div className="text-sm md:text-base flex items-center gap-1">
                {userData && (
                  <p>
                    Welcome to{" "}
                    <span className="font-semibold text-[#0000f1]">
                      {userData.churchName}
                    </span>{" "}
                    vehicle counter dashboard.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        <p
          className={`py-2 ${
            !start
              ? "bg-[#0000f1] border-b-4 px-3 border-[#0f8bff]"
              : "bg-rose-500 border-b-4 px-3 border-rose-300"
          } text-white font-medium rounded-md outline w-fit shadow-md active:scale-x-95 cursor-pointer`}
          onClick={() => setStart(!start)}
        >
          {start ? "End Session" : "Start Counting"}
        </p>
      </div>

      {!start && (
        <div className="p-2">
          <p className="text-sm md:text-base">Click on any to see all.</p>
          <CounterTracker />
          <div className="mt-4 border">
            <h3 className="font-medium p-2 text-sm">
              Plate Numbers and Entry Times
            </h3>
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-slate-300 divide-x">
                  <th className="py-2 px-2 border-b text-center">
                    Plate Number
                  </th>
                  <th className="py-2 px-2 border-b text-center">Entry Time</th>
                </tr>
              </thead>
              <tbody>
                {plateNumbers.map((entry) => (
                  <tr key={entry.id} className="divide-x">
                    <td className="py-2 px-4 border-b text-center text-sm">
                      {entry.phoneNumber.toUpperCase()}
                    </td>
                    <td className="py-2 px-4 border-b text-center text-sm flex items-center justify-center gap-5">
                      <span>
                        {new Date(
                          entry.createdAt.seconds * 1000
                        ).toLocaleTimeString()}
                      </span>
                      <span
                        className="p-2 bg-rose-50 text-rose-500 rounded-full cursor-pointer"
                        onClick={() => confirmDelete(entry.id)}
                      >
                        <FaTrash />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {start && <PlateRecognition />}

      {showModal && (
        <ConfirmationModal
          onConfirm={() => {
            handleDelete(deleteId);
            setShowModal(false);
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default WelcomePage;
