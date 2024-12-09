import React, { useContext, useState, useEffect } from "react";
import { PoolContext } from "../../Context/PoolContext";
import CreateNewPool from "./CreateNewPool";
import ShowPools from "./ShowPools";
import "./css/Pools.css";
import Loading from "../../images/loading.png";
const Pools = () => {
  
  const pc = useContext(PoolContext);
 
  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching data
  useEffect(() => {
    // Simulate an API call or data fetch
    const fetchPools = async () => {
      setIsLoading(true); // Set loading to true before starting data fetch
      try {
        // Simulate a delay for fetching data
        setTimeout(() => {
          setIsLoading(false); // Set loading to false once data is fetched
        }, 2000);
      } catch (error) {
        console.error("Error fetching pools:", error);
        setIsLoading(false);
      }
    };

    fetchPools();
  }, []);

  return (
    <div className="pools h-4/5 w-full">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center">
          <img
            src={Loading}
            alt="Loading..."
            className="w-12 h-12 animate-spin" // Tailwind classes for loader image
          />
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      ) : pc.isPoolAvailable ? (
        <ShowPools />
      ) : (
        <CreateNewPool />
      )}
    </div>
  );
};

export default Pools;
