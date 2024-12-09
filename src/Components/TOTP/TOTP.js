import React, { useState, useEffect,useContext } from "react";
import "./TOTP.css";
import axios from "axios";
import { Slide, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { PoolContext } from "../../Context/PoolContext";
const TOTP = () => {
  let navigate = useNavigate();
  let [enableAdminOTP, setEnableAdminOTP] = useState(false);
  let [enableClientOTP, setEnableClientOTP] = useState(false);
  const pc = useContext(PoolContext);
  const token=pc.token
  
  useEffect(() => {
  
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/get-enable-disable-totp-browser`,{
          headers: {
            Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
          }
        }
      )
      .then((res) => {
        setEnableAdminOTP(res.data);
      });
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/v1/get-enable-disable-guac`,{
        headers: {
          Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
        }
      })
      .then((res) => {
        setEnableClientOTP(res.data);
      });
  }, []);

  let handleChange = (e) => {
    // setEnableOTP({ ...enableOTP, [e.target.name]: e.target.checked });
    if (e.target.name == "admin") {
      setEnableAdminOTP(e.target.checked);
      axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/v1/enable-disable-totp-browser/${e.target.checked}`,{},{
            headers: {
              Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
            }
          }
        )
        .then((res) => {
         
          if (res.statusText== "OK") {
            // console.log(res.data.msg);
            toast.success("Success", {
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
          } else {
            // console.log(res.data.msg);
            toast.error("enable-disable-totp-browser Faild", {
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
          }
        });
    }
    if (e.target.name == "client") {
      setEnableClientOTP(e.target.checked);
      axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/v1/enable-disable-guac/${e.target.checked}`,{},{
            headers: {
              Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
            }
          }
        )
        .then((res) => {
          if (res.statusText== "OK") {
            // console.log(res.data.msg);
            toast.success("Success", {
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
          } else {
            // console.log(res.data.msg);
            toast.error("enable-disable-guac Failed", {
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
          }
        });
    }
  };
  const Goback = () => {
    navigate("/");
  };

  return (
    <div>
    <div className="flex justify-start ml-0 sm:ml-4">
      <button
        onClick={Goback}
        className="ml-4 bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-10"
      >
        Go Back
      </button>
    </div>
  
    <div className="p-4 sm:p-6 md:p-8 rounded-lg shadow-md flex flex-col items-start m-4 sm:m-6 md:m-10 bg-white w-full sm:w-4/5 md:w-3/5">
      <h1 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-gray-600">
        OTP Verification
      </h1>
      <div className="flex items-center mb-2 sm:mb-4">
        <label htmlFor="totp" className="mr-2 text-sm font-medium text-gray-900">
          Enable TOTP for Admin
        </label>
        <div className="relative">
          <div className="mt-1 sm:mt-2 border-0">
            <label className="switch">
              <input
                type="checkbox"
                onChange={handleChange}
                name="admin"
                checked={enableAdminOTP}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>
      <div className="flex items-center mb-2 sm:mb-4">
        <label htmlFor="totp" className="mr-2 text-sm font-medium text-gray-900">
          Enable TOTP for Client
        </label>
        <div className="relative">
          <div className="mt-1 sm:mt-2 border-0">
            <label className="switch">
              <input
                type="checkbox"
                onChange={handleChange}
                name="client"
                checked={enableClientOTP}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default TOTP;
