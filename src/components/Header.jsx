import React, { useState, useEffect, useCallback } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import Nav from "./Nav";
import { useAuth } from "../UserContext";
import { auth, db } from "../firebase";
import { FaSearch, FaTimes } from "react-icons/fa";
import { collection, query, where, getDocs } from "firebase/firestore";
import debounce from "lodash.debounce";
import { Link } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, userData, loading } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [search, setSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Cleanup the timer on component unmount
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    return `${hours}:${minutes}:${seconds} ${ampm}`;
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const performSearch = async (term) => {
    if (term.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const q = query(
        collection(db, "phoneNumbers"),
        where("phoneNumber", ">=", term),
        where("phoneNumber", "<=", term + "\uf8ff")
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching documents: ", error);
    }
  };

  const debouncedSearch = useCallback(
    debounce((term) => performSearch(term), 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  return (
    <div className="h-[50px] md:h-[50px] px-2 shadow-md w-full flex justify-between items-center gap-2 sticky top-0 z-[999] bg-white">
      {!search && (
        <div className="flex items-center gap-2">
          <GiHamburgerMenu
            className="w-6 h-6 cursor-pointer col-span-1"
            onClick={toggleNav}
          />

          <p
            className="flex items-center gap-2 bg-slate-200 p-2 rounded-md col-span-1 cursor-pointer"
            onClick={() => setSearch(true)}
          >
            <FaSearch />
            <span className="text-sm">Search</span>
          </p>
        </div>
      )}
      {search && (
        <div className="flex items-center border rounded-md w-full justify-between text-sm">
          <input
            type="text"
            className="py-2 px-2 outline-none w-[90%]"
            placeholder="Eg: KUJ-345UK"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <p
            className="px-2 py-3 w-[10%] flex items-center justify-center bg-rose-50"
            onClick={() => setSearch(false)}
          >
            <FaTimes />
          </p>
        </div>
      )}

      <Nav isOpen={isOpen} toggleNav={toggleNav} />

      {!search && (
        <div className="grid grid-cols-6 items-center">
          <div className="flex items-center text-slate-600 gap-2 text-nowrap col-span-5">
            <p className="text-sm">{formatDate(currentTime)}</p>
            <p className="text-sm">{formatTime(currentTime)}</p>
          </div>

          {/* <div className="flex items-center gap-2"> */}
          <div className="rounded-full border-2 overflow-hidden w-fit col-span-1">
            <img
              src="https://images.pexels.com/photos/3025593/pexels-photo-3025593.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Church image"
              className="w-[30px] h-[30px]"
            />
          </div>
          {/* </div> */}
        </div>
      )}

      {search && searchResults.length > 0 && (
        <div className="absolute top-[50px] left-0 w-full bg-white shadow-md border">
          <ul>
            {searchResults.map((result) => (
              <Link to={`/plate-number/${result.id}`} key={result.id}>
                <li key={result.id} className="p-2 border-b">
                  {result.phoneNumber}
                </li>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
