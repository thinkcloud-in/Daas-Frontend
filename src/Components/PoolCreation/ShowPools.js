import React, { useContext, useState, useEffect } from "react";
import { PoolContext } from "../../Context/PoolContext";
import "./css/ShowPools.css";

import { useNavigate } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const ShowPools = () => {
  const navigate = useNavigate();
  //pool context
  const pc = useContext(PoolContext);
  // console.log("available pools",pc.availablePools)
  //state for assigned users
  let [assignedUsers, setAssignedUsers] = useState([]);

  //function to handle button click
  let handlePoolSelection = (pool) => {
    navigate(`/pools/manage-pool/${pool.id}`, { state: { pool: pool } });
  };
  const Goback = () => {
    navigate("/");
  };
  return (
    <div>
      <div className="flex justify-start ml=0">
        <button
          onClick={Goback}
          className="ml-4 bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-10"
        >
          Go Back
        </button>
      </div>
      <div className="show-pools flex justify-start items-start gap-2 h-auto w-3/4 m-auto">
        <div className=" mt-10 p-3 pb-0 shadow-md w-full h-full overflow-y-auto overflow-x-hidden bg-white available_pools ">
          <div className="flex justify-between mb-3 items-center mt-3">
            <h2 className="font-bold leading-7 text-gray-600">
              Available Pools
            </h2>
            <button
              onClick={() => navigate("/pools/pool-creation-form")}
              className="bg-indigo-500 hover:bg-indigo-700 hover:text-gray-300 text-white rounded-md px-3 py-2 text-sm font-medium flex flex-col gap-2"
            >
              + New Pool
            </button>
          </div>
          {pc.isPoolAvailable && (
            <div className="overflow-y-auto">
              <table className="bg-white table-auto w-full text-gray-600">
                <thead>
                  <tr className="rounded-md">
                    {[
                      "Name",
                      "Type",
                      "Cluster Name",
                      "Entitled",
                      "Machines",
                    ].map((header, index) => (
                      <th
                        key={index}
                        className="p-3 border-b-2 border-gray-400 text-left text-sm uppercase font-bold"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pc.availablePools
                    .sort((a, b) => a.pool_name.localeCompare(b.pool_name))
                    .map((item, index) => (
                      <tr
                        key={item.id}
                        className="text-left border-b-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => handlePoolSelection(item)}
                      >
                        <td className="p-3">{item.pool_name}</td>
                        <td className="p-3">{item.pool_type}</td>
                        <td className="p-3">
                          {item.cluster ? item.cluster : "NA"}
                        </td>
                        <td className="p-3">
                          {item.entitled ? item.entitled : 0}
                        </td>
                        <td className="p-3">
                          {Array.from(item.pool_machines).join(", ")}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowPools;
