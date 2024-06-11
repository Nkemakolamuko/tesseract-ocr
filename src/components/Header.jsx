import React, { useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import Nav from "./Nav";
import { useAuth } from "../UserContext";
import { auth } from "../firebase";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, userData, loading } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

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

  return (
    <div className="py-2 md:py-3 px-2 shadow-md w-full flex items-center justify-between sticky top-0 z-[999] bg-white">
      <GiHamburgerMenu className="w-6 h-6 cursor-pointer" onClick={toggleNav} />

      <Nav isOpen={isOpen} toggleNav={toggleNav} />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center text-slate-600 gap-2">
          <p className="text-sm">{formatDate(currentTime)}</p>
          <p className="text-sm">{formatTime(currentTime)}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-full border-2 overflow-hidden w-fit">
            <img
              src="https://images.pexels.com/photos/3025593/pexels-photo-3025593.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Church image"
              className="w-[30px] h-[30px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
