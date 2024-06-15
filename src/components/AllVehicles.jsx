import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { FaAngleRight, FaCheckDouble } from "react-icons/fa6";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AllVehicles = () => {
  const { currentUser } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "phoneNumbers"),
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const vehicleData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVehicles(vehicleData);
      } catch (error) {
        console.error("Error fetching vehicle data: ", error);
        toast.error("Error fetching vehicle data.");
      }
      setLoading(false);
    };

    if (currentUser) {
      fetchVehicles();
    }
  }, [currentUser]);

  const handleCheckExit = async (id, isExited) => {
    setLoadingIds((prev) => [...prev, id]);
    try {
      const vehicleRef = doc(db, "phoneNumbers", id);
      await updateDoc(vehicleRef, {
        exitedAt: isExited ? null : new Date(),
      });
      setVehicles((prev) =>
        prev.map((vehicle) =>
          vehicle.id === id
            ? { ...vehicle, exitedAt: isExited ? null : new Date() }
            : vehicle
        )
      );
      toast.success(`Vehicle marked as ${isExited ? "not exited" : "exited"}.`);
    } catch (error) {
      console.error("Error updating vehicle status: ", error);
      toast.error("Error updating vehicle status.");
    } finally {
      setLoadingIds((prev) => prev.filter((loadingId) => loadingId !== id));
    }
  };

  return (
    <div className="w-full bg-white py-6 px-2 h-screen">
      <h2 className="mb-2 font-medium">All Vehicles</h2>
      {loading ? (
        <div className="w-full flex justify-center items-center h-screen">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="flex flex-col w-full md:w-[60%] shadow-md rounded divide-y">
          <p className="px-2 py-2 text-center flex items-center gap-2">
            List of today's entries:{" "}
            <span className="text-[#0000f1] font-semibold">
              {vehicles.length}
            </span>{" "}
          </p>

          <p className="text-sm px-2 py-2">
            Click on any Car ID for quick actions
          </p>

          <div className="grid grid-cols-1">
            <p className="grid grid-cols-3 items-center text-center w-full bg-blue-50 px-4 divide-x font-medium">
              <span className="py-2">Car ID</span>
              <span className="py-2">Entry at</span>
              <span className="py-2">Exit at</span>
            </p>
            {vehicles.map((vehicle) => (
              <p
                key={vehicle.id}
                className="grid grid-cols-3 items-center text-center w-full px-4 divide-x border-b text-sm"
              >
                <span className="flex col-span-1 justify-center">
                  <span
                    className={`text-nowrap rounded-md m-1 py-2 px-2 cursor-pointer flex items-center gap-2`}
                    onClick={() => {
                      navigate(`/plate-number/${vehicle.id}`);
                    }}
                  >
                    {vehicle.phoneNumber} <FaAngleRight />
                  </span>
                </span>
                <span className="py-2">
                  {new Date(
                    vehicle.createdAt.seconds * 1000
                  ).toLocaleTimeString()}
                </span>
                <span className="py-2">
                  {vehicle.exitedAt
                    ? new Date(
                        vehicle.exitedAt.seconds * 1000
                      ).toLocaleTimeString()
                    : "-"}
                </span>
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllVehicles;
