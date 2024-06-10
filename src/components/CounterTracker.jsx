import React from "react";
import { FaGreaterThan } from "react-icons/fa";

const CounterTracker = () => {
  return (
    <div className="md:w-3xl w-full divide-x border border-dashed divide-dashed grid grid-cols-2">
      <p className="font-medium px-4 py-4 text-center text-lg bg-slate-100">
        Entries
      </p>
      <p className="font-medium px-4 py-4 text-center text-lg text-rose-500 bg-rose-50">
        Exits
      </p>
      <p className="px-4 py-8 text-center border-t flex items-center justify-center gap-2">
        <span className="font-semibold text-2xl">87</span>
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
