import React, { useState, useEffect } from "react";
import { UserPlusIcon } from "@heroicons/react/24/solid";


function EntitleUser(props) {
  return (
    props.showPopup && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
        <div className="bg-white p-6 rounded shadow-lg w-1/4">
          <h2 className="text-xl mb-4">Select User</h2>
          <input
            type="text"
            placeholder="Search..."
            value={props.searchTerm}
            onChange={props.handleSearch}
            className="w-full p-2 border rounded"
          />
          {props.filteredData.length === 0 ? (
            <div className="text-center text-gray-600 mt-4">No users found</div>
          ) : (
            <ul className="mt-4 text-left h-[300px] overflow-y-auto overflow-x-hidden">
              {props.filteredData.map((user) => (
                <span className="flex w-full justify-between items-center border-b-2 p-2 mx-2">
                  <li
                    key={user}
                    className="py-1 m-1 cursor-default text-base"
                  >
                    {user.username}
                  </li>
                  <UserPlusIcon
                    className="h-6 w-6 text-gray-400 cursor-pointer mx-3"
                    onClick={() => props.entitleUser(user.username)}
                  />
                </span>
              ))}
            </ul>
          )}
          <button
            onClick={() => props.setShowPopup(false)}
            className="mt-4 p-2 bg-indigo-500 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    )
  );
}

export default EntitleUser;
