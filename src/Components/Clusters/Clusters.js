import React, { useContext } from "react";
import { PoolContext } from "../../Context/PoolContext";
import ShowClusters from "./ShowClusters";
import CreateNewCluster from "./CreateNewCluster";
const Clusters = () => {
  //pool context
  const pc = useContext(PoolContext);

  return (
    <div className="pools h-4/5 w-full ">
      {/* <div className="w-full m-3 mx-8 flex justify-items-start">
        <button className="m-3 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded ">
          + New Pool
        </button>
        </div> */}
      {pc.isClusterAvailable ? <ShowClusters /> : <CreateNewCluster />}
    </div>
  );
};

export default Clusters;
