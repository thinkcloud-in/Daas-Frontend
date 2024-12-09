import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PoolContext } from "../../Context/PoolContext";
import "./css/PoolCreationForm.css";
import axios from "axios";
import VNCsettings from "./VNCsettings";
import SSHsettings from "./SSHsettings";
import RDPsettings from "./RDPsettings";
import CustomTabs from "../CustomTabs/CustomTabs";
import { Slide, toast } from "react-toastify";
import CreateNewPool from "./CreateNewPool";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const PoolCreationForm = (props) => {
  // console.log("props", props);
  // let obj = useOutletContext();
  let tablist = ["RDP", "SSH", "VNC"];
  let [selectedTab, setSelectedTab] = useState("RDP");
  const [selectedProtocol, setSelectedProtocol] = useState("");
  let token=props.token
  
  let navigate = useNavigate();
  let handleTabSelection = (i) => {
    setSelectedTab(i);
    console.log(i);
  };
  //pool context
  const pc = useContext(PoolContext);
  let [selectedCluster, setSelectedCluster] = useState();
  let poolType = ["Automated", "Manual"];
  let securityMode = [
    "None",
    "Any",
    "NLA",
    "RDP encryption",
    "TLS encryption",
    "Hyper-V / VMConnect",
  ];
  let templates = [];
  //state
  // name: "",
  // cpu: null,
  // ram: null,
  // naming_pattern: "",
  // number_of_machines: null,
  // machines: [],
  // cluster: 1,
  // domain: "",
  // ou: "",
  // entitled: null,
  const [poolDetails, setPoolDetails] = useState({
    pool_protocol: "",
    pool_port: null,
    pool_type: "",
    pool_name: "",
    entitled: null,
    pool_machines: [],
    pool_username: "",
    pool_password: "",
    pool_security: "",
    pool_weight: 0,
    pool_domain: "",
    pool_disable_auth: false, // Boolean field
    pool_ignore_cert: false, // Boolean field
    pool_max_connections: null, // Integer field
    pool_max_connections_per_user: null, // Integer field
    pool_guacd_port: null, // Integer field
    pool_guacd_encryption: "",
    pool_gateway_port: null, // Integer field
    pool_gateway_username: "",
    pool_gateway_password: "",
    pool_gateway_domain: "",
    pool_initial_program: "",
    pool_client_name: "",
    pool_timezone: "",
    pool_console: false, // Boolean field
    pool_width: null, // Integer field
    pool_height: null, // Integer field
    pool_dpi: null, // Integer field
    pool_color_depth: "",
    pool_resize_method: "",
    pool_read_only: false, // Boolean field
    pool_clipboard_encoding: "",
    pool_disable_copy: false, // Boolean field
    pool_disable_paste: false, // Boolean field
    pool_console_audio: false, // Boolean field
    // pool_custom_disable_audio: false, // Boolean field
    pool_enable_audio_input: false, // Boolean field
    pool_enable_printing: false, // Boolean field
    pool_printer_name: "",
    pool_enable_drive: false, // Boolean field
    pool_drive_name: "",
    pool_drive_path: "",
    pool_cursor: "",
    pool_enable_wallpaper: false, // Boolean field
    pool_enable_theming: false, // Boolean field
    pool_enable_font_smoothing: false, // Boolean field
    pool_enable_full_window_drag: false, // Boolean field
    pool_enable_desktop_composition: false, // Boolean field
    pool_enable_menu_animations: false, // Boolean field
    pool_disable_bitmap_caching: false, // Boolean field
    pool_disable_offscreen_caching: false, // Boolean field
    pool_disable_glyph_caching: false, // Boolean field
    pool_load_balance_info: "",
    pool_recording_path: "",
    pool_recording_name: "",
    pool_create_recording_path: false, // Boolean field
    pool_recording_exclude_mouse: false, // Boolean field
    pool_recording_include_keys: false, // Boolean field
    pool_exclude_touch_events: false, // Boolean field
    pool_enable_sftp: false, // Boolean field
    pool_sftp_port: null, // Integer field
    pool_sftp_username: "",
    pool_font_name: "",
    pool_sftp_password: "",
    pool_sftp_host_key: "",
    pool_sftp_private_key: "",
    pool_sftp_passphrase: "",
    pool_sftp_root_directory: "",
    pool_sftp_directory: "",
    pool_sftp_server_alive_interval: null, // Integer field
    pool_private_key: "",
    pool_passphrase: "",
    pool_color_scheme: "",
    pool_custom_font_name: "",
    pool_scrollback: 0, // Integer field
    pool_font_size: 0, // Integer field
    pool_backspace: "",
    pool_terminal_type: "",
    pool_typescript_path: "",
    pool_typescript_name: "",
    pool_create_typescript_path: false, // Boolean field
    pool_swap_red_blue: false, // Boolean field
    pool_dest_host: "",
    pool_dest_port: null, // Integer field
    pool_exclude_mouse: false, // Boolean field
    pool_exclude_graphics_streams: false, // Boolean field
    pool_enable_audio: false, // Boolean field
    pool_audio_servername: "",
    pool_failover_only: "false", // Boolean field
    pool_args: [],
  });

  const handleOnChange = (e) => {
    const { name, value, type, checked } = e.target;

    setPoolDetails((prevState) => {
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
          "pool_weight",
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
        newValue = value ? parseInt(value, 10) : 0;
      } else {
        newValue = value;
      }

      return {
        ...prevState,
        [name]: newValue,
      };
    });
  };
  let handleOnClick = () => {
    
    
    if (!poolDetails.pool_type&&poolDetails.pool_name) {
      toast.error("Please fill all the details", {
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
    } else {
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/v1/create_pool`,token,
          poolDetails
        )
        .then((res) => {
          let msg = res.data.msg;
          let pool = res.data.pool;
          toast.success("Pool created successfully", {
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
          pc.setAvailablePools([...pc.availablePools, pool]);
          pc.setIsPoolAvailable(true);
          navigate("/pools");
          setPoolDetails({
            pool_protocol: "",
            pool_port: null,

            pool_type: "",
            pool_name: "",
            entitled: null,
            pool_machines: [],
            pool_username: "",
            pool_password: "",
            pool_security: "",
            pool_weight: null,
            pool_domain: "",
            pool_disable_auth: false, // Boolean field
            pool_ignore_cert: false, // Boolean field
            pool_max_connections: null, // Integer field
            pool_max_connections_per_user: null, // Integer field
            pool_guacd_port: null, // Integer field
            pool_guacd_encryption: "",
            pool_gateway_port: null, // Integer field
            pool_gateway_username: "",
            pool_gateway_password: "",
            pool_gateway_domain: "",
            pool_initial_program: "",
            pool_client_name: "",
            pool_timezone: "",
            pool_console: false, // Boolean field
            pool_width: null, // Integer field
            pool_height: null, // Integer field
            pool_dpi: null, // Integer field
            pool_color_depth: "",
            pool_resize_method: "",
            pool_read_only: false, // Boolean field
            pool_clipboard_encoding: "",
            pool_disable_copy: false, // Boolean field
            pool_disable_paste: false, // Boolean field
            pool_console_audio: false, // Boolean field
            // pool_custom_disable_audio: false, // Boolean field
            pool_enable_audio_input: false, // Boolean field
            pool_enable_printing: false, // Boolean field
            pool_printer_name: "",
            pool_enable_drive: false, // Boolean field
            pool_drive_name: "",
            pool_drive_path: "",
            pool_cursor: "",
            pool_enable_wallpaper: false, // Boolean field
            pool_enable_theming: false, // Boolean field
            pool_enable_font_smoothing: false, // Boolean field
            pool_enable_full_window_drag: false, // Boolean field
            pool_enable_desktop_composition: false, // Boolean field
            pool_enable_menu_animations: false, // Boolean field
            pool_disable_bitmap_caching: false, // Boolean field
            pool_disable_offscreen_caching: false, // Boolean field
            pool_disable_glyph_caching: false, // Boolean field
            pool_load_balance_info: "",
            pool_recording_path: "",
            pool_recording_name: "",
            pool_create_recording_path: false, // Boolean field
            pool_recording_exclude_mouse: false, // Boolean field
            pool_recording_include_keys: false, // Boolean field
            pool_exclude_touch_events: false, // Boolean field
            pool_enable_sftp: false, // Boolean field
            pool_sftp_port: null, // Integer field
            pool_sftp_username: "",
            pool_font_name: "",
            pool_sftp_password: "",
            pool_sftp_host_key: "",
            pool_sftp_private_key: "",
            pool_sftp_passphrase: "",
            pool_sftp_root_directory: "",
            pool_sftp_directory: "",
            pool_sftp_server_alive_interval: null, // Integer field
            pool_private_key: "",
            pool_passphrase: "",
            pool_color_scheme: "",
            pool_custom_font_name: "",
            pool_scrollback: 0, // Integer field
            pool_font_size: 0, // Integer field
            pool_backspace: "",
            pool_terminal_type: "",
            pool_typescript_path: "",
            pool_typescript_name: "",
            pool_create_typescript_path: false, // Boolean field
            pool_swap_red_blue: false, // Boolean field
            pool_dest_host: "",
            pool_dest_port: null, // Integer field
            pool_exclude_mouse: false, // Boolean field
            pool_exclude_graphics_streams: false, // Boolean field
            pool_enable_audio: false, // Boolean field
            pool_audio_servername: "",
            pool_failover_only: "false", // Boolean field
            pool_args: [],
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
    }
  };

  const handleProtocolChange = (e) => {
    const value = e.target.value;
    setPoolDetails({ ...poolDetails, [e.target.name]: value });
    setSelectedProtocol(value);
    setSelectedTab(value); // Automatically set tab based on selected protocol
  };
  const Goback = () => {
    navigate(-1);
  };
  return (
    <div className="pool_creation ">
      <div className="flex justify-start ml-7">
        <button
          onClick={Goback}
          className="ml-4 bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-10"
        >
          Go Back
        </button>
      </div>
      <div className="pool-creation-form w-full  ">
        <div className="space-y-5 m-2 ">
          <div className="w-3/4 mx-10 p-3 rounded-md shadow-md bg-white border-2 border-indigo-500">
            <h2 className="font-semibold leading-7 text-gray-900">
              Create New Pool
            </h2>
            <div className="text-left table-auto">
              <div className="tr">
                <div className="th">
                  <label className="block text-sm font-medium leading-6 text-gray-900  border-0">
                    Pool Type <span className="text-red-500 text-xl">*</span>
                  </label>
                </div>
                <div className="td">
                  <div className="mt-2 border-0 ">
                    <select
                      onChange={handleOnChange}
                      value={poolDetails.pool_type}
                      name="pool_type"
                      required
                      className="block  cursor-pointer rounded-md border-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
              <div className="protocol_field mb-4 mt-3">
                <div className="tr">
                  <div className="th">
                    <label
                      htmlFor="protocol"
                      className="block text-sm font-medium leading-6 text-gray-900 border-0"
                    >
                      Protocol
                    </label>
                  </div>
                  <div className="td">
                    <div className="mt-2 border-0">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                        <select
                          id="protocol"
                          name="pool_protocol"
                          onChange={handleProtocolChange}
                          value={selectedProtocol}
                          className="block flex-1 rounded-md bg-white bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
                        >
                          <option value="">Select Protocol</option>
                          <option value="RDP">RDP</option>
                          <option value="SSH">SSH</option>
                          <option value="VNC">VNC</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {poolDetails.pool_type && (
                <div className="tr">
                  <div className="th">
                    <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                      Pool Name <span className="text-red-500 text-xl">*</span>
                    </label>
                  </div>
                  <div className="td">
                    <div className="mt-2  border-0">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                        <input
                          type="text"
                          name="pool_name"
                          onChange={handleOnChange}
                          required
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
                    Automated pools will be available in the upcoming version.
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
                          // value={poolDetails.dataTemplate}
                          disabled
                          name="dataTemplate"
                          className=" block cursor-pointer rounded-md border-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                          <input
                            onChange={handleOnChange}
                            // value={poolDetails.cpu}
                            disabled
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
                            disabled
                            // value={poolDetails.ram}
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
                            // value={poolDetails.naming_pattern}
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
                            // value={poolDetails.number_of_machines}
                            disabled
                            type="number"
                            name="pool_machines"
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
                          // value={poolDetails.domain}
                          disabled
                          name="pool_domain"
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
                            // value={poolDetails.ou}
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
                          // value={poolDetails.cluster}
                          disabled
                          name="cluster"
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
                  {poolDetails.cluster == "VMware" && (
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
                              // value={poolDetails.DC}
                              name="DC"
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
                              // value={poolDetails.Folder}
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
          <div className="mx-10 w-3/4 rounded-md shadow-md bg-white ">
            {selectedProtocol && (
              <CustomTabs
                tablist={tablist.filter((tab) => tab === selectedProtocol)}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                handleTabSelection={(tab) => setSelectedTab(tab)}
              />
            )}
            {selectedProtocol === "RDP" && (
              <RDPsettings
                onChange={handleOnChange}
                poolDetails={poolDetails}
              />
            )}
            {selectedProtocol === "SSH" && (
              <SSHsettings
                onChange={handleOnChange}
                poolDetails={poolDetails}
              />
            )}
            {selectedProtocol === "VNC" && (
              <VNCsettings
                onChange={handleOnChange}
                poolDetails={poolDetails}
              />
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="buttons ml-10 mt-5 pl-5 flex items-start justify-start">
          <button
            onClick={handleOnClick}
            type="submit"
            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoolCreationForm;
