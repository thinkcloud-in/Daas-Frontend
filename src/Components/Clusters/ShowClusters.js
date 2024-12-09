import React, { useContext, useState, useEffect } from "react";
import { PoolContext } from "../../Context/PoolContext";
import { useNavigate } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { Slide, toast } from "react-toastify";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ShowClusters = () => {
  const navigate = useNavigate();
  //pool context
  const pc = useContext(PoolContext);
  const token =pc.token;
  //function to handle button click
  let handleClusterSelection = (cluster) => {
    navigate(`/cluster/edit-cluster/${cluster.id}`);
  };
  //function to delete cluster
  let deleteCluster = (cluster_id) => {
    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_URL}/v1/delete_cluster/${cluster_id}`,{
          headers: {
            Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
          }
        }
      )
      .then((res) => {
        console.log(res.data)
        pc.setAvailableClusters([...res.data.clusters] || []); // Ensure vmAvailable is updated even if res.data.machines is empty
        toast.success(res.data.msg, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
        });
      })
      .catch((err) => {
        console.error("Error deleting cluster:", err);
        toast.error("Failed to delete cluster", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
        });
      });
  };

  return (
    <div className="show-pools flex justify-start items-start gap-2 h-4/5">
      <div className="border-2 border-gray-900/10 m-10 p-3 pb-0 shadow-md w-full h-full overflow-y-auto overflow-x-hidden">
        <div className="flex justify-between mb-3 items-center">
          <h2 className="font-semibold leading-7 text-gray-900">
            Available Clusters
          </h2>
          <button
            onClick={() => navigate("/cluster/cluster-create-form")}
            className="bg-indigo-500 hover:bg-indigo-600 hover:text-gray-300 text-white  rounded-md px-3 py-2 text-sm font-medium flex flex-col gap-2"
          >
            + New Cluster
          </button>
        </div>
        {pc.isClusterAvailable && (
          <div className="overflow-x-auto">
            <table className="w-full bg-white table-auto">
              <thead>
                <tr className="rounded-md">
                  {["Name", "Type", "ip", "Port"].map((header, index) => (
                    <th
                      key={index}
                      className="p-3 border-b-2 border-gray-300 text-left text-sm uppercase font-bold"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pc.availableClusters.map((item) => (
                  <tr
                    key={item.id}
                    className="text-left border-b-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleClusterSelection(item)}
                  >
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.type}</td>
                    <td className="p-3">{item.ip}</td>
                    <td className="p-3">{item.port}</td>
                    <td className="p-3">
                      <TrashIcon
                        className="h-6 w-6 text-red-600 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent event from propagating to parent tr
                          deleteCluster(item.id);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowClusters;
