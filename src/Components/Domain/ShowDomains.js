import React, { useContext } from "react";
import { PoolContext } from "../../Context/PoolContext";
import DomainCard from "./DomainCard";
import { useNavigate } from "react-router-dom";

const ShowDomains = (props) => {
  const navigate = useNavigate();
  //pool context
  const pc = useContext(PoolContext);
  const Goback = () => {
    navigate("/");
  };
  return (
    <div className="mt-10">
      <div className="flex justify-start ml=0">
        <button
          onClick={Goback}
          className="ml-12 bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-10"
        >
          Go Back
        </button>
      </div>
    <div className="show-pools flex justify-start items-start gap-2 h-4/5">
      <div className="m-10 p-3 pb-0 w-full h-full overflow-y-auto overflow-x-hidden">
        <div className="flex justify-between mb-3 items-center">
          <h2 className="font-bold leading-7 text-gray-600 text-lg">
            Identity Providers
          </h2>
          <button
            onClick={() => navigate("/domain/domain-create-form")}
            className="bg-indigo-500 hover:bg-indigo-600 hover:text-gray-300 text-white rounded-md px-3 py-2 text-sm font-medium flex flex-col gap-2"
          >
            + Add new provider
          </button>
        </div>
        <div className="m-5 flex gap-10">
          {pc.availableDomains.length > 0 ? (
            pc.availableDomains
              .sort((a, b) => a.name.localeCompare(b.name)) // Sort the array by the 'name' property
              .map((item) => (
                <DomainCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  providerId={item.providerId}
                  enabled={
                    item.config.enabled == "true" ? "Enabled" : "Disabled"
                  }
                  
                />
              ))
          ) : (
            <div className="m-5 flex gap-10 w-full justify-center items-center">No domains available</div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default ShowDomains;
