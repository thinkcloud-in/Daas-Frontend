import React, { useState, useContext, useRef } from "react";
import { PoolContext } from "../../Context/PoolContext";
import "./css/ClusterCreationForm.css";
import axios from "axios";
import { Slide, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ClusterCreationForm = () => {
  const navigate = useNavigate();
  // let obj = useOutletContext();
  const checkboxRef = useRef(null);
  //pool context
  const pc = useContext(PoolContext);
  const token=pc.token;
  let clusterType = ["VMware", "KVM"];
  let [isDisabled, setIsDisabled] = useState(false);
  let templates = [];
  //state
  const [clusterDetails, setClusterDetails] = useState({
    type: "",
    name: "",
    ip: "",
    port: "",
    username: "",
    password: "",
    tls: false,
  });
  //on change function
  let handleOnChange = (e) => {
    if (e.target.name == "type" && e.target.value == "KVM") {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
    setClusterDetails({ ...clusterDetails, [e.target.name]: e.target.value });
  };
  //on click function
  let handleOnClick = () => {
    console.log(clusterDetails);
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/create_cluster`,
        clusterDetails,{
          headers: {
            Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
          }
        }
      )
      .then((res) => {
        let msg = res.data.msg;
        let cluster = res.data.cluster;
        toast.success(msg, {
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
        pc.setAvailableClusters([...pc.availableClusters, cluster]);
        pc.setIsClusterAvailable(true);
        navigate("/clusters");
        setClusterDetails({
          type: "",
          name: "",
          ip: "",
          port: "",
          username: "",
          password: "",
          tls: false,
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Pool creation failed", {
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
  };
  //onChange event hanndler for toggle button
  let handleChange = (e) => {
    setClusterDetails({ ...clusterDetails, tls: e.target.checked });
  };
  const Goback = () => {
    navigate(-1);
  };
  return (
    <div>
      <div className="flex justify-start ml=0">
        <button
          onClick={Goback}
          className="ml-12 bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-10"
        >
          Go Back
        </button>
      </div>
      <div className="cluster-creation-form w-full ">
        <div className="space-y-5 m-2">
          <div className="shadow-md bg-white mx-10 p-3 rounded-md shadow-md w-3/4">
            <h2 className="font-bold leading-7 text-indigo-700">
              Create Cluster
            </h2>
            <div className="text-left table-auto ">
              <div className="tr">
                <div className="th">
                  <label className="block text-sm font-medium leading-6 text-gray-900  border-0">
                    Cluster Type
                  </label>
                </div>
                <div className="td">
                  <div className="mt-2 border-0 ">
                    <select
                      onChange={handleOnChange}
                      value={clusterDetails.type}
                      name="type"
                      className="block  cursor-pointer rounded-md border-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                    >
                      <option selected value="" disabled>
                        Cluster Type
                      </option>
                      {clusterType.map((item) => {
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
              {clusterDetails.type == "KVM" && (
                <div className="text-red-500">
                  KVM clusters will be available in the upcoming version.
                </div>
              )}
              <div className="tr">
                <div className="th">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Cluster Name
                  </label>
                </div>
                <div className="td">
                  <div className="mt-2  border-0">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        name="name"
                        disabled={isDisabled ? true : false}
                        onChange={handleOnChange}
                        value={clusterDetails.name}
                        className={classNames(
                          isDisabled
                            ? "bg-gray-200 border-slate-300"
                            : "bg-white bg-transparent",
                          "block flex-1 rounded-md py-2 px-3 text-base text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {clusterDetails.type == "VMware" && (
                <div className="tr">
                  <div className="th">
                    <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                      Vcenter IP / FQDN
                    </label>
                  </div>
                  <div className="td">
                    <div className="mt-2  border-0">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                        <input
                          type="text"
                          name="ip"
                          disabled={isDisabled ? true : false}
                          onChange={handleOnChange}
                          value={clusterDetails.ip}
                          className={classNames(
                            isDisabled
                              ? "bg-gray-200 border-slate-300 w-300"
                              : " bg-white bg-transparent",
                            "block flex-1 rounded-md py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2 "
                          )}
                          // className="block flex-1 rounded-md bg-white bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {clusterDetails.type === "KVM" && (
                <div className="tr">
                  <div className="th">
                    <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                      KVM IP / FQDN
                    </label>
                  </div>
                  <div className="td">
                    <div className="mt-2  border-0">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                        <input
                          type="text"
                          name="ip"
                          disabled={isDisabled ? true : false}
                          onChange={handleOnChange}
                          value={clusterDetails.ip}
                          className={classNames(
                            isDisabled
                              ? "bg-gray-200 border-slate-300"
                              : "  bg-white bg-transparent",
                            "block flex-1 rounded-md py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
                          )}
                          // className="block flex-1 rounded-md bg-white bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="tr">
                <div className="th">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0 ">
                    Port
                  </label>
                </div>
                <div className="td">
                  <div className="mt-2  border-0">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        onChange={handleOnChange}
                        value={clusterDetails.port}
                        disabled={isDisabled ? true : false}
                        type="number"
                        name="port"
                        className={classNames(
                          isDisabled
                            ? "bg-gray-200 border-slate-300"
                            : "  bg-white bg-transparent",
                          "block flex-1 rounded-md py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
                        )}
                        // className="block flex-1 rounded-md bg-white bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="tr">
                <div className="th">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Username
                  </label>
                </div>
                <div className="td">
                  <div className="mt-2  border-0">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        name="username"
                        disabled={isDisabled ? true : false}
                        onChange={handleOnChange}
                        value={clusterDetails.username}
                        className={classNames(
                          isDisabled
                            ? "bg-gray-200 border-slate-300"
                            : "  bg-white bg-transparent",
                          "block flex-1 rounded-md py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
                        )}
                        // className="block flex-1 rounded-md bg-white bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="tr">
                <div className="th">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Password
                  </label>
                </div>
                <div className="td">
                  <div className="mt-2  border-0">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="password"
                        name="password"
                        disabled={isDisabled ? true : false}
                        onChange={handleOnChange}
                        value={clusterDetails.password}
                        className={classNames(
                          isDisabled
                            ? "bg-gray-200 border-slate-300"
                            : "  bg-white bg-transparent",
                          "block flex-1 rounded-md py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
                        )}
                        // className="block flex-1 rounded-md bg-white bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="tr">
                <div className="th">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900 border-0"
                  >
                    Insecure Skip Verify
                  </label>
                </div>
                <div className="td">
                  <div className="mt-2 border-0">
                    <label className="switch">
                      <input
                        type="checkbox"
                        name="tls"
                        disabled={isDisabled ? true : false}
                        onChange={handleChange}
                        ref={checkboxRef}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Buttons */}
        <div className="buttons ml-10 mt-5 pl-5 flex items-start justify-start">
          <button
            onClick={handleOnClick}
            disabled={isDisabled ? true : false}
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClusterCreationForm;
