import React from "react";
import { useNavigate } from "react-router-dom";
const SSL = () => {
  const navigate = useNavigate();
  const Goback = () => {
    navigate("/");
  };
  return (
    <div className="mt-5 flex flex-col space-y-6">
      <div className="flex justify-start ml=0">
        <button
          onClick={Goback}
          className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-10"
        >
          Go Back
        </button>
      </div>
    <div className="p-8 rounded-lg shadow-md flex flex-col items-start m-10 bg-white w-3/4">
      <h1 className="text-2xl font-semibold mb-4 text-indigo-700">SSL Certificate</h1>
      <div className="mb-4 flex flex-col items-start">
        <label htmlFor="privateKey" className="text-sm font-medium text-gray-900 mb-1 ml-1">Private Key:</label>
        <input
          type="file"
          id="privateKey"
          name="privateKey"
          accept=".key"
          className=" p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-indigo-500 w-80"
        />
      </div>
      <div className="mb-4 flex flex-col items-start">
        <label htmlFor="publicCertificate" className="text-sm font-medium text-gray-900 mb-1 ml-1">Public Certificate:</label>
        <input
          type="file"
          id="publicCertificate"
          name="publicCertificate"
          accept=".crt"
          className="w-80 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-indigo-500"
        />
      </div>
      <button className="bg-indigo-600 text-white font-medium text-slate-300 hover:bg-indigo-700 hover:text-gray-500  px-4 py-2 rounded-md">Submit</button>
    </div>
    </div>
  );
};

export default SSL;
