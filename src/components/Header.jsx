import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import Nav from "./Nav";
import { useAuth } from "../UserContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, userData, loading } = useAuth();

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="py-2 md:py-3 px-2 shadow-md w-full flex items-center justify-between sticky top-0 z-[999] bg-white">
      <GiHamburgerMenu className="w-6 h-6 cursor-pointer" onClick={toggleNav} />

      <Nav isOpen={isOpen} toggleNav={toggleNav} />

      <div className="flex items-center justify-between gap-2">
        {loading ? (
          "loading..."
        ) : (
          <p className="font-medium text-nowrap truncate">
            {userData && userData.churchName}
          </p>
        )}

        <div className="rounded-full border-2 overflow-hidden w-fit">
          <img
            src="https://images.pexels.com/photos/3025593/pexels-photo-3025593.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Church image"
            className="w-[30px] h-[30px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
