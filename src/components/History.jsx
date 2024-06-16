import React, { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoryData = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "history"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHistoryData(data);
      } catch (error) {
        console.error("Error fetching history data:", error);
      }
      setLoading(false);
    };

    fetchHistoryData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <FiLoader className="w-24 h-24 animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-6 px-2 w-full h-screen">
      <h2 className="mb-2 font-medium">History</h2>
      {historyData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200 text-sm">
                <th className="py-2 px-4 border-b text-start">Car ID</th>
                <th className="py-2 px-4 border-b text-start">Entry Time</th>
                <th className="py-2 px-4 border-b text-start">Exit Time</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((entry) => (
                <tr key={entry.id}>
                  <td className="py-2 px-4 border-b text-sm">
                    {entry.phoneNumber}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    {new Date(
                      entry?.createdAt?.seconds * 1000
                    ).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    {entry.exitedAt
                      ? new Date(entry.exitedAt.seconds * 1000).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No historical data available.</p>
      )}
    </div>
  );
};

export default History;
