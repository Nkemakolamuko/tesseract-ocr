import React from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Nav = ({ isOpen, toggleNav }) => {
  const location = useLocation();
  const navVariants = {
    open: {
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    closed: {
      x: "-100%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "All Vehicles", path: "/all-vehicles" },
    { name: "History", path: "/history" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 h-full w-64 bg-blue-800 text-white pt-12 z-40 shadow-md"
      initial={false}
      animate={isOpen ? "open" : "closed"}
      variants={navVariants}
    >
      <div
        className="absolute top-4 left-4 z-50 cursor-pointer text-2xl text-slate-200"
        onClick={toggleNav}
      >
        <FaTimes />
      </div>
      <ul className="py-4 space-y-1">
        {navLinks.map((link) => (
          <li
            key={link.name}
            className={`p-4 ${
              location.pathname === link.path ? "bg-blue-900" : "bg-blue-800"
            } hover:bg-blue-900 transition-all duration-300`}
          >
            <Link
              to={link.path}
              className="block text-white"
              onClick={toggleNav}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
};

export default Nav;
