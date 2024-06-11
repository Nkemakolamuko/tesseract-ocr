import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "./firebase";

const UserContext = createContext();

export const useAuth = () => useContext(UserContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [plateNumbers, setPlateNumbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setCurrentUser(user);
      if (user) {
        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, "Users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }

        // Fetch plate numbers associated with the user
        const q = query(
          collection(db, "phoneNumbers"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const plateNumbersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlateNumbers(plateNumbersData);
      } else {
        setUserData(null);
        setPlateNumbers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshPlateNumbers = async () => {
    if (currentUser) {
      const q = query(
        collection(db, "phoneNumbers"),
        where("userId", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const plateNumbersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlateNumbers(plateNumbersData);
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        userData,
        plateNumbers,
        loading,
        refreshPlateNumbers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
