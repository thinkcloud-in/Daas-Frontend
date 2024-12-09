import React from "react";
import { useNavigate } from "react-router-dom";
import AddMachinePopover from "./AddMachinePopover";
import { PlusIcon} from "@heroicons/react/24/outline";

const CreateNewPool = () => {
  const navigate=useNavigate()
  return (
    <div className="h-full flex items-center justify-center m-3 p-5 border-dashed border-stone-300 border-2">
      <div className="text-center">
        <div className="mb-4">
          <PlusIcon className="w-12 h-12 mx-auto text-gray-400"/>
        </div>
        <p className="mb-2 text-lg text-gray-600">No Pools Available</p>
        <p className="mb-8 text-gray-500">
          Get started by creating a new pool.
        </p>
        <div className="w-full flex justify-center items-center">
        <button 
        className="bg-indigo-600 hover:bg-indigo-700 hover:text-white text-gray-300 rounded-md px-3 py-2 text-sm font-medium flex flex-col gap-2"
        onClick={()=>navigate("/pools/pool-creation-form")}
        >
          + New Pool
        </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNewPool;
