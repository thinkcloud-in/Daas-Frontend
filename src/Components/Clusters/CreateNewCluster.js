import React from "react";
import { useNavigate } from "react-router-dom";
import { PlusIcon} from "@heroicons/react/24/outline";

const CreateNewCluster = () => {
  const navigate=useNavigate()
  return (
    <div className="h-full flex items-center justify-center m-3 p-5 border-dashed border-stone-300 border-2">
      <div className="text-center">
        <div className="mb-4">
        <PlusIcon className="w-12 h-12 mx-auto text-gray-400"/>
        </div>
        <p className="mb-2 text-lg text-gray-600">No Clusters Available</p>
        <p className="mb-8 text-gray-500">
          Get started by creating a new pool.
        </p>
        <div className="w-full flex justify-center items-center">
        <button 
        className="bg-indigo-500 hover:bg-indigo-400 hover:text-white text-gray-300 rounded-md px-3 py-2 text-sm font-medium flex flex-col gap-2"
        onClick={()=>navigate("/cluster/cluster-create-form")}
        >
          + New Cluster
        </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNewCluster;
