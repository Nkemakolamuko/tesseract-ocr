import React, { useState, useEffect } from "react";
import Header from "./Header";
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

const WelcomePage = () => {
  const { currentUser, userData, loading } = useAuth();
  const [start, setStart] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [plateData, setPlateData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
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
    const fetchPlateData = async () => {
      setDataLoading(true);
      try {
        const q = query(
          collection(db, "phoneNumbers"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlateData(data);
      } catch (error) {
        console.error("Error fetching plate data: ", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchPlateData();
  }, [currentUser]);

  // Delete an entry
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "phoneNumbers", id));
      setPlateData(plateData.filter((entry) => entry.id !== id));
      toast.success("Deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("Error deleting document.");
    }
    setDeleteModalOpen(false);
    setDeleteId(null);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
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
            <p className="text-sm md:text-base">{greeting}.</p>
            {currentUser && (
              <div className="text-sm md:text-base flex items-center gap-1">
                {userData && <p>Welcome to your vehicle counter dashboard.</p>}
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
          {start ? (
            "End Session"
          ) : (
            <span>
              {plateData.length == 0 ? "Start Counting" : "Continue Counting"}
            </span>
          )}
        </p>
      </div>

      {!start && (
        <div className="p-2">
          <p className="text-sm md:text-base">Click on any to see all.</p>
          <CounterTracker />
          {plateData && (
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
                    <th className="py-2 px-2 border-b text-center">
                      Entry Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {plateData.map((entry) => (
                    <tr key={entry.id} className="divide-x">
                      <td className="py-2 px-4 border-b text-center text-sm">
                        {entry.phoneNumber}
                      </td>
                      <td className="py-2 px-4 border-b text-center text-sm flex items-center justify-center gap-5">
                        <span>
                          {new Date(
                            entry.createdAt.seconds * 1000
                          ).toLocaleTimeString()}
                        </span>
                        <span
                          className="p-2 bg-rose-50 text-rose-500 rounded-full"
                          onClick={() => openDeleteModal(entry.id)}
                        >
                          <FaTrash />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {start && <PlateRecognition />}

      {/* Delete confirmation modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-2 z-[9999]">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <h3 className="font-medium mb-4 bg-rose-50 py-2 px-6">
              Confirm Deletion
            </h3>
            <p className="mb-4 px-6 border-b pb-2">
              Are you sure you want to delete this entry?
            </p>
            <div className="flex justify-end gap-4 px-6 pb-6">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WelcomePage;
