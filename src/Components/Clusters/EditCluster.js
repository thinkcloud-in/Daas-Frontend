import React, { useState, useContext, useRef, useEffect } from "react";
import { PoolContext } from "../../Context/PoolContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Slide, toast } from "react-toastify";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const EditCluster = () => {
  const checkboxRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  let [cluster, setCluster] = useState({});
  let [clusterId, setClusterId] = useState(useParams().id);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/v1/cluster/${clusterId}`,{
        headers: {
          Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
        }
      })
      .then((res) => {
        setCluster({
          type: res.data.type,
          name: res.data.name,
          ip: res.data.ip,
          port: res.data.port,
          username: res.data.username,
          password: res.data.password,
          tls: res.data.tls,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  //pool context
  const pc = useContext(PoolContext);
  const token=pc.token;
  //on change function
  let handleOnChange = (e) => {
    setCluster({ ...cluster, [e.target.name]: e.target.value });
  };
  //onChange event hanndler for toggle button
  let handleChange = (e) => {

    setCluster({ ...cluster, [e.target.name]: e.target.checked });
  };
  //on click function to update cluster details
  let handleOnClick = () => {
    console.log(cluster);
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/v1/update_cluster/${clusterId}`,
        cluster,{
          headers: {
            Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
          }
        }
      )
      .then((res) => {
        if (res.data.cluster) {
          setCluster(res.data.cluster);
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
        navigate("/clusters");
        pc.getClusters();
      })
      .catch((err) => {
        console.log(err);
        toast.error("cluster modification failed", {
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
  return (
    <div className="pool-creation-form w-full">
      <div className="space-y-5 m-2">
        <div className="border-2 border-gray-900/10 mx-10 p-3 rounded-md shadow-md">
          <h2 className="font-semibold leading-7 text-gray-900">
            Edit Cluster
          </h2>
          <div className="text-left table-auto">
            <div className="tr">
              <div className="th">
                <label className="block text-sm font-medium leading-6 text-gray-900  border-0 ">
                  Cluster Type
                </label>
              </div>
              <div className="td">
                <div className="mt-2 border-0 ">
                  <select
                    disabled
                    onChange={handleOnChange}
                    value={cluster.type}
                    name="clusterType"
                    className=" w-full cursor-pointer rounded-md py-1.5 text-gray-900 bg-zinc-300 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 border-2"
                  >
                    <option selected value="" disabled>
                      {cluster.type}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className="tr">
              <div className="th">
                <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                  Cluster Name
                </label>
              </div>
              <div className="td">
                <div className="mt-2  border-0">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      disabled
                      type="text"
                      name="name"
                      onChange={handleOnChange}
                      value={cluster.name}
                      className="block flex-1 rounded-md bg-zinc-300 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
                    />
                  </div>
                </div>
              </div>
            </div>
            {cluster.type == "VMware" && (
              <div className="tr">
                <div className="th">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Vcenter IP / FQDN
                  </label>
                </div>
                <div className="td">
                  <div className="mt-2  border-0">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        name="vcenterIP"
                        disabled
                        onChange={handleOnChange}
                        value={cluster.ip}
                        className="block flex-1 rounded-md bg-zinc-300  py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {cluster.type === "KVM" && (
              <div className="tr">
                <div className="th">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    KVM IP / FQDN
                  </label>
                </div>
                <div className="td">
                  <div className="mt-2  border-0">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        name="KvmIP"
                        disabled
                        onChange={handleOnChange}
                        value={cluster.ip}
                        className="block flex-1 rounded-md bg-zinc-300 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
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
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      onChange={handleOnChange}
                      value={cluster.port}
                      type="number"
                      name="port"
                      className="block flex-1 rounded-md bg-white bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
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
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="text"
                      name="username"
                      onChange={handleOnChange}
                      value={cluster.username}
                      className="block flex-1 rounded-md bg-white bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
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
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="password"
                      name="password"
                      onChange={handleOnChange}
                      value={cluster.password}
                      className="block flex-1 rounded-md bg-white bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
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
                      onChange={handleChange}
                      name="tls"
                      checked={cluster.tls}
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
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default EditCluster;
