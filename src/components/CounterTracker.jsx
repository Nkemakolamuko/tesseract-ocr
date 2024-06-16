import React from "react";
import { FaCarAlt, FaGreaterThan } from "react-icons/fa";
import { useAuth } from "../UserContext";
import { FaTruckMoving } from "react-icons/fa6";
import { Link } from "react-router-dom";

const CounterTracker = () => {
  const { plateNumbers, exitCount } = useAuth();

  return (
    <Link
      to="/all-vehicles"
      className="md:w-3xl w-full divide-x border border-dashed divide-dashed grid grid-cols-2"
    >
      <p className="text-sm font-semibold px-4 py-2 text-center bg-slate-100 flex items-center gap-2 justify-center">
        <FaCarAlt className="" />
        <span>Entries</span>
      </p>
      <p className="text-sm font-semibold px-4 py-2 text-center text-rose-500 bg-rose-50 flex items-center gap-2 justify-center">
        <span>Exits</span>
        <FaTruckMoving />
      </p>
      <p className="px-4 py-4 text-center border-t flex items-center justify-center gap-2">
        <span className="font-semibold text-lg">{plateNumbers.length}</span>
        <FaGreaterThan className="opacity-50 text-2xl hidden" />
      </p>
      <p className="px-4 py-4 text-center border-t flex items-center justify-center gap-2">
        <span className="font-semibold text-lg">{exitCount}</span>
        <FaGreaterThan className="opacity-50 text-2xl hidden" />
      </p>
    </Link>
  );
};

export default CounterTracker;
