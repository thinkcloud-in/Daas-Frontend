import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PoolContext } from "../../Context/PoolContext";
import "./css/PoolCreationForm.css";
import VNCsettings from "./VNCsettings";
import SSHsettings from "./SSHsettings";
import RDPsettings from "./RDPsettings";
import CustomTabs from "../CustomTabs/CustomTabs";
import axios from "axios";

import { Slide, toast } from "react-toastify";
import Loading from "../../images/loading.png";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const EditPool = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let [poolDetails, setPoolDetails] = useState({});
  let [poolId, setPoolId] = useState(useParams().id);
  let [displayName, setDisplayName] = useState();
  let [loading, setLoading] = useState(true);
   //pool context
   const pc = useContext(PoolContext);
   const token=pc.token;
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/v1/pool/${poolId}`,{
        headers: {
          Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
        }
      })
      .then((res) => {
        setPoolDetails(res.data);
        setDisplayName(res.data.name);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [poolId]);

  let poolType = ["Automated", "Manual"];
 
  let templates = [];
  let tablist = ["RDP", "SSH", "VNC"];
  let handleTabSelection = (i) => {
    setSelectedTab(i);
    console.log(i);
  };
  let [selectedTab, setSelectedTab] = useState("RDP");
  //on change function
  const handleOnChange = (e) => {
    const { name, type, checked, value } = e.target;

    setPoolDetails((prevData) => {
      let newValue;

      if (type === "checkbox") {
        newValue = checked;
      } else if (
        [
          "pool_guacd_port",
          "pool_max_connections",
          "pool_max_connections_per_user",
          "pool_gateway_port",
          "pool_width",
          "pool_height",
          "pool_dpi",
          "pool_sftp_port",
          "pool_sftp_server_alive_interval",
          "pool_scrollback",
          "pool_font_size",
          "pool_destination_port",
          "pool_port",
        ].includes(name)
      ) {
        newValue = value ? parseInt(value, 10) : null;
      } else {
        newValue = value;
      }

      return {
        ...prevData,
        [name]: newValue,
      };
    });
  };

  //on click function
  let handleOnClick = () => {
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/v1/update_pool/${poolDetails.id}`,
        poolDetails,{
          headers: {
            Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
          }
        }
      )
      .then((res) => {
        if (res.data.pool) {
          setPoolDetails(res.data.pool);
        }
        toast.success(res.data.msg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
        });
        navigate("/pools");
        pc.getPools();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Pool modification failed", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
        });
      });
    // console.log(poolDetails);
  };
  let securityMode = [
    "None",
    "Any",
    "NLA",
    "RDP encryption",
    "TLS encryption",
    "Hyper-V / VMConnect",
  ];
  const Goback = () => {
    navigate(-1);
  };
  return (
    <div>
      <div className="flex justify-start ml-7">
        <button
          onClick={Goback}
          className="ml-4 bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-10"
        >
          Go Back
        </button>
      </div>
      <div className="pool-creation-form w-full ">
        {loading ? (
          <div className="flex flex-col items-center justify-center bg-white m-10 loading_editpool">
            <img
              src={Loading}
              alt="Loading..."
              className="w-10 h-10 animate-spin" // Tailwind classes for loader image
            />
            <p className="mt-4 text-lg text-gray-600">Loading...</p>
          </div> // Loading spinner or any loading indicator
        ) : (
          <div className="space-y-5 m-2">
            <div className="mx-10 p-3 rounded-md shadow-md  bg-white w-3/4 border-2 border-indigo-500">
              <h2 className="font-semibold leading-7 text-gray-900">
                <span className="text-gray-500 text-lg">Edit </span> : <span className="text-indigo-500">{poolDetails.pool_name}</span> 
              </h2>
              <div className="text-left table-auto">
                <div className="tr">
                  <div className="th">
                    <label className="block text-sm font-medium leading-6 text-gray-900  border-0">
                      Pool Type
                    </label>
                  </div>
                  <div className="td">
                    <div className="mt-2 border-0 ">
                      <select
                        onChange={handleOnChange}
                        value={poolDetails.pool_type}
                        name="pool_type"
                        disabled
                        className=" w-full cursor-pointer rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 border-2"
                      >
                        <option selected value="" disabled>
                          Pool Type
                        </option>
                        {poolType.map((item) => {
                          return (
                            <option
                              key={item}
                              value={item}
                              className="capitalize px-1"
                            >
                              {item}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
                {poolDetails.pool_type && (
                  <div className="tr">
                    <div className="th">
                      <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                        Pool Name
                      </label>
                    </div>
                    <div className="td">
                      <div className="mt-2  border-0">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                          <input
                            type="text"
                            name="pool_name"
                            onChange={handleOnChange}
                            value={poolDetails.pool_name}
                            className="block flex-1 rounded-md bg-white bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {poolDetails.pool_type == "Automated" && (
                  <>
                    <div className="text-red-500">
                      Automated pools will be available in the upcoming beta
                      version.
                    </div>
                    <div className="tr">
                      <div className="th">
                        <label className="block text-sm font-medium leading-6 text-gray-900  border-0">
                          Template
                        </label>
                      </div>
                      <div className="td">
                        <div className="mt-2 border-0 ">
                          <select
                            onChange={handleOnChange}
                            value={poolDetails.dataTemplate}
                            name="dataTemplate"
                            className=" w-full cursor-pointer rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 border-2"
                          >
                            <option selected value="" disabled>
                              Choose Template
                            </option>
                            {templates.map((item) => {
                              return (
                                <option
                                  key={item}
                                  value={item}
                                  className="capitalize px-1"
                                >
                                  {item}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="tr">
                      <div className="th">
                        <label className="block text-sm font-medium leading-6 text-gray-900 border-0 ">
                          CPU
                        </label>
                      </div>
                      <div className="td">
                        <div className="mt-2  border-0">
                          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                            <input
                              onChange={handleOnChange}
                              value={poolDetails.cpu}
                              type="number"
                              name="cpu"
                              className="block flex-1 rounded-md bg-white bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tr">
                      <div className="th">
                        <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                          RAM
                        </label>
                      </div>
                      <div className="td">
                        <div className="mt-2  border-0">
                          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                            <input
                              type="text"
                              name="ram"
                              onChange={handleOnChange}
                              value={poolDetails.ram}
                              className="block flex-1 rounded-md bg-white bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tr">
                      <div className="th">
                        <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                          Naming Pattern
                        </label>
                      </div>
                      <div className="td">
                        <div className="mt-2  border-0">
                          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                            <input
                              type="text"
                              name="naming_pattern"
                              onChange={handleOnChange}
                              value={poolDetails.naming_pattern}
                              disabled
                              className="block flex-1 rounded-md bg-white bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tr">
                      <div className="th">
                        <label className="block text-sm font-medium leading-6 text-gray-900 border-0 ">
                          Number of Machines
                        </label>
                      </div>
                      <div className="td">
                        <div className="mt-2  border-0">
                          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                            <input
                              onChange={handleOnChange}
                              value={poolDetails.number_of_machines}
                              type="number"
                              name="number_of_machines"
                              className="block flex-1 rounded-md bg-white bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tr">
                      <div className="th">
                        <label className="block text-sm font-medium leading-6 text-gray-900  border-0">
                          Domain
                        </label>
                      </div>
                      <div className="td">
                        <div className="mt-2 border-0 ">
                          <select
                            onChange={handleOnChange}
                            value={poolDetails.domain}
                            name="domain"
                            disabled
                            className=" w-full cursor-pointer rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 border-2"
                          >
                            <option selected value="" disabled>
                              Domain
                            </option>
                            {templates.map((item) => {
                              return (
                                <option
                                  key={item}
                                  value={item}
                                  className="capitalize px-1"
                                >
                                  {item}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="tr">
                      <div className="th">
                        <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                          OU
                        </label>
                      </div>
                      <div className="td">
                        <div className="mt-2  border-0">
                          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                            <input
                              type="text"
                              name="ou"
                              onChange={handleOnChange}
                              value={poolDetails.ou}
                              disabled
                              className="block flex-1 rounded-md bg-white bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tr">
                      <div className="th">
                        <label className="block text-sm font-medium leading-6 text-gray-900  border-0">
                          Cluster
                        </label>
                      </div>
                      <div className="td">
                        <div className="mt-2 border-0 ">
                          <select
                            onChange={handleOnChange}
                            value={poolDetails.cluster.name}
                            name="cluster"
                            disabled
                            className=" w-full cursor-pointer rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 border-2"
                          >
                            <option selected value="" disabled>
                              Cluster
                            </option>
                            {pc.availableClusters.map((item) => {
                              return (
                                <option
                                  key={item}
                                  value={item.name}
                                  className="capitalize px-1"
                                >
                                  {item.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                    {poolDetails.cluster.type == "VMware" && (
                      <>
                        <div className="tr">
                          <div className="th">
                            <label className="block text-sm font-medium leading-6 text-gray-900  border-0">
                              Select DC
                            </label>
                          </div>
                          <div className="td">
                            <div className="mt-2 border-0 ">
                              <select
                                onChange={handleOnChange}
                                value={poolDetails.DC}
                                name="DC"
                                disabled
                                className=" w-full cursor-pointer rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 border-2"
                              >
                                <option selected value="" disabled>
                                  Select DC
                                </option>
                                {pc.availableClusters.map((item) => {
                                  return (
                                    <option
                                      key={item}
                                      value={item._id}
                                      className="capitalize px-1"
                                    >
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="tr">
                          <div className="th">
                            <label className="block text-sm font-medium leading-6 text-gray-900  border-0">
                              Select Folder
                            </label>
                          </div>
                          <div className="td">
                            <div className="mt-2 border-0 ">
                              <select
                                onChange={handleOnChange}
                                value={poolDetails.Folder}
                                name="Folder"
                                className=" w-full cursor-pointer rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 border-2"
                              >
                                <option selected value="" disabled>
                                  Select Folder
                                </option>
                                {pc.availableClusters.map((item) => {
                                  return (
                                    <option
                                      key={item}
                                      value={item._id}
                                      className="capitalize px-1"
                                    >
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className=" mx-10 rounded-md shadow-md bg-white w-3/4 ">
              <CustomTabs
                tablist={tablist.filter(
                  (tab) => tab === poolDetails.pool_protocol
                )}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                handleTabSelection={handleTabSelection}
              />
              {selectedTab == "RDP" && poolDetails.pool_protocol === "RDP" && (
                <RDPsettings
                  onChange={handleOnChange}
                  poolDetails={poolDetails}
                  securityMode={securityMode}
                />
              )}
              {poolDetails.pool_protocol === "SSH" && (
                <SSHsettings
                  onChange={handleOnChange}
                  poolDetails={poolDetails}
                  securityMode={securityMode}
                />
              )}
              {poolDetails.pool_protocol === "VNC" && (
                <VNCsettings
                  onChange={handleOnChange}
                  poolDetails={poolDetails}
                  securityMode={securityMode}
                />
              )}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="buttons ml-10 mt-5 pl-5 flex items-start justify-start">
          <button
            onClick={handleOnClick}
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPool;
