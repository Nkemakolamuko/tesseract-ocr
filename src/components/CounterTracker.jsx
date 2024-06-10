import React, { useEffect, useState } from "react";
import { FaGreaterThan } from "react-icons/fa";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../UserContext";

const CounterTracker = () => {
  const [entries, setEntries] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPlateNumbers = async () => {
      if (currentUser) {
        try {
          const q = query(
            collection(db, "phoneNumbers"),
            where("userId", "==", currentUser.uid)
          );
          const querySnapshot = await getDocs(q);
          const plateNumbers = querySnapshot.docs.map((doc) => doc.data());

          // Set the count of entries as the total number of plate numbers
          setEntries(plateNumbers.length);
        } catch (error) {
          console.error("Error fetching plate numbers: ", error);
        }
      }
    };

    fetchPlateNumbers();
  }, [currentUser]);

  return (
    <div className="md:w-3xl w-full divide-x border border-dashed divide-dashed grid grid-cols-2">
      <p className="font-medium px-4 py-4 text-center bg-slate-100">Entries</p>
      <p className="font-medium px-4 py-4 text-center text-rose-500 bg-rose-50">
        Exits
      </p>
      <p className="px-4 py-8 text-center border-t flex items-center justify-center gap-2">
        <span className="font-semibold text-2xl">{entries}</span>
        <FaGreaterThan className="opacity-50 text-2xl hidden" />
      </p>
      <p className="px-4 py-8 text-center border-t flex items-center justify-center gap-2">
        <span className="font-semibold text-2xl">0</span>
        <FaGreaterThan className="opacity-50 text-2xl hidden" />
      </p>
    </div>
  );
};

export default CounterTracker;
