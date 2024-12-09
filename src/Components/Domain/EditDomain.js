import React, { useState, useContext, useEffect } from "react";
import { PoolContext } from "../../Context/PoolContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Popup from "../Popup/Popup";
import axios from "axios";
import { Slide, toast } from "react-toastify";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import "./EditDomain.css"
const EditDomain = () => {
  function stringToBoolean(str) {
    return str === "true";
  }
  let [editAD, setEditAD] = useState({});
  let [domainID, setDomainID] = useState(useParams().id);
  let [pageReady, setPageReady] = useState(false);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/v1/get_ldap_by_id/${domainID}`,{
        headers: {
          Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
        }
      })
      .then((res) => {
        setEditAD({
          name: res.data.name,
          vendor: res.data.vendor,
          connectionUrl: res.data.connectionUrl,
          startTls: stringToBoolean(res.data.startTls),
          useTruststoreSpi: res.data.useTruststoreSpi,
          connectionPooling: stringToBoolean(res.data.connectionPooling),
          connectionTimeout: res.data.connectionTimeout,
          authType: res.data.authType,
          bindDn: res.data.bindDn,
          bindCredential: "",
          editMode: res.data.editMode,
          usersDn: res.data.usersDn,
          usernameLDAPAttribute: res.data.usernameLDAPAttribute,
          rdnLDAPAttribute: res.data.rdnLDAPAttribute,
          uuidLDAPAttribute: res.data.uuidLDAPAttribute,
          userObjectClasses: res.data.userObjectClasses,
          searchScope: res.data.searchScope,
          readTimeout: res.data.readTimeout,
          pagination: stringToBoolean(res.data.pagination),
          referral: res.data.referral,
          importEnabled: stringToBoolean(res.data.importEnabled),
          syncRegistrations: stringToBoolean(res.data.syncRegistrations),
          batchSizeForSync: res.data.batchSizeForSync,
          fullSyncPeriod: res.data.fullSyncPeriod,
          changedSyncPeriod: res.data.changedSyncPeriod,
          allowKerberosAuthentication: stringToBoolean(
            res.data.allowKerberosAuthentication
          ),
          useKerberosForPasswordAuthentication: stringToBoolean(
            res.data.useKerberosForPasswordAuthentication
          ),
          cachePolicy: res.data.cachePolicy,
          usePasswordModifyExtendedOp: stringToBoolean(
            res.data.usePasswordModifyExtendedOp
          ),
          validatePasswordPolicy: stringToBoolean(
            res.data.validatePasswordPolicy
          ),
          trustEmail: stringToBoolean(res.data.trustEmail),
          customUserSearchFilter: res.data.customUserSearchFilter,
          debug: stringToBoolean(res.data.debug),
          enabled: stringToBoolean(res.data.enabled),
          kerberosRealm: res.data.kerberosRealm,
          keyTab: res.data.keyTab,
          serverPrincipal: res.data.serverPrincipal,
          krbPrincipalAttribute: res.data.krbPrincipalAttribute,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      setPageReady(true);
    };
  }, []);
  const navigate = useNavigate();
  //pool context
  const pc = useContext(PoolContext);
  const token=pc.token;
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigation = useNavigate();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  //state for popup
  const [open, setOpen] = useState(false);
  let [syncSettingsEnable, setSyncSettingsEnable] = useState({
    fullSyncEnabled: false,
    changedSyncEnabled: false,
  });
  let deleteDomain = (domain_id) => {
    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_URL}/v1/delete_ldap_configuration/${domain_id}`,{
          headers: {
            Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
          }
        }
      )
      .then((res) => {
        let status_code = res.data.status_code;
        let ldaps = res.data.ldaps;
        if (status_code == 204) {
          toast.success("Deleted", {
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
          pc.setAvailableDomains(ldaps);
          navigate("/domain");
        } else {
          toast.error("Deletion failed", {
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
      })
      .catch((err) => {
        console.log(err);
        toast.error("Deletion failed", {
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

  let handleOnClick = (exp, id) => {
    switch (exp) {
      case "sync":
        console.log("sync");
        // sync_users
        axios
          .get(`${process.env.REACT_APP_BACKEND_URL}/v1/sync_users/${id}`,{
            headers: {
              Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
            }
          })
          .then((res) => {
            console.log(res);

            toast.info(res.data.status, {
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
        break;
      case "syncChanged":
        console.log("syncChanged");
        // sync_users
        axios
          .get(
            `${process.env.REACT_APP_BACKEND_URL}/v1/sync_changed_users/${id}`,{
              headers: {
                Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
              }
            }
          )
          .then((res) => {
            console.log(res);
            if (res.status == 200) {
              toast.info(res.data.status, {
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
        break;
      case "unlink":
        console.log("syncChanged");
        // sync_users
        axios
          .get(`${process.env.REACT_APP_BACKEND_URL}/v1/unlink_users/${id}`,{
            headers: {
              Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
            }
          })
          .then((res) => {
            let msg;
            if (res.data.status) {
              msg = res.data.status;
            } else {
              msg = res.data.msg;
            }
            toast.info(msg, {
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
        break;
      case "remove":
        console.log("remove");
        // sync_users
        axios
          .get(
            `${process.env.REACT_APP_BACKEND_URL}/v1/remove_imported_users/${id}`,{
              headers: {
                Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
              }
            }
          )
          .then((res) => {
            let msg;
            if (res.data.status) {
              msg = res.data.status;
            } else {
              msg = res.data.msg;
            }
            toast.info(msg, {
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
        break;
      case "delete":
        console.log("delete", id);
        deleteDomain(id);
        break;
      default:
    }
  };
  let sendData = () => {
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/v1/update_ldap_config/${domainID}`,
        editAD,{
          headers: {
            Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
          }
        }
      )
      .then((res) => {
        console.log(res);
        if (res.data.status_code == 204) {
          toast.success("AD configuration updated successfully", {
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
          pc.setAvailableDomains(res.data.ldaps);
          navigate("/domain");
        } else {
          toast.error("Updation failed", {
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
      })
      .catch((err) => {
        console.log(err);
        toast.error("Updation failed", {
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
    // setOpen(false);
  };

  //onChange event handler for all the input fields
  let handleOnChange = (e) => {
    setEditAD({ ...editAD, [e.target.name]: e.target.value });
  };
  //onChange event handler for toggle button
  let handleChange = (e) => {
    if (
      e.target.name == "fullSyncEnabled" ||
      e.target.name == "changedSyncEnabled"
    ) {
      setSyncSettingsEnable({
        ...syncSettingsEnable,
        [e.target.name]: e.target.checked,
      });
    } else {
      setEditAD({ ...editAD, [e.target.name]: e.target.checked });
    }
  };
  //opens confirmation popup and check for any empty fields
  let handleOnSubmit = (e) => {
    if (
      // true
      editAD.name &&
      editAD.vendor &&
      editAD.connectionUrl &&
      editAD.authType &&
      editAD.bindDn &&
      editAD.bindCredential &&
      editAD.editMode &&
      editAD.usersDn &&
      editAD.usernameLDAPAttribute &&
      editAD.rdnLDAPAttribute &&
      editAD.uuidLDAPAttribute &&
      editAD.userObjectClasses
    ) {
      // setOpen(true);
      sendData();
    } else {
      //toast is generated if any input fields are empty
      toast.error("Please enter all details", {
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
  };
  //function to reset all the input fields
  let reset = () => {
    setEditAD({
      name: "",
      vendor: "ad",
      connectionUrl: "",
      startTls: false,
      useTruststoreSpi: "always",
      connectionPooling: false,
      connectionTimeout: "",
      authType: "simple",
      bindDn: "",
      bindCredential: "",
      editMode: "read_only",
      usersDn: "",
      usernameLDAPAttribute: "",
      rdnLDAPAttribute: "",
      uuidLDAPAttribute: "",
      userObjectClasses: "",
      searchScope: "",
      readTimeout: "",
      pagination: false,
      referral: "",
      importEnabled: true,
      syncRegistrations: true,
      batchSizeForSync: "",
      fullSyncPeriod: "-1",
      changedSyncPeriod: "-1",
      allowKerberosAuthentication: false,
      useKerberosForPasswordAuthentication: false,
      cachePolicy: "DEFAULT",
      usePasswordModifyExtendedOp: false,
      validatePasswordPolicy: false,
      trustEmail: false,
      customUserSearchFilter: "",
      debug: false,
      enabled: true,
      kerberosRealm: "",
      keyTab: "",
      lastSync: "",
      serverPrincipal: "",
      krbPrincipalAttribute: "",
    });
    setSyncSettingsEnable({
      fullSyncEnabled: false,
      changedSyncEnabled: false,
    });
  };
  let handleTestConnection = () => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/v1/test_ldap_connection`, {
        authType: editAD.authType,
        bindCredential: editAD.bindCredential,
        bindDn: editAD.bindDn,
        connectionTimeout: editAD.connectionTimeout,
        connectionUrl: editAD.connectionUrl,
        startTls: editAD.startTls,
        useTruststoreSpi: editAD.useTruststoreSpi,
        headers: {
          Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
        }
      })
      .then((res) => {
        if (res.data.msg) {
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
        } else {
          toast.error(
            `Error when trying to connect to LDAP:'${res.data.errorMessage}'`,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Slide,
            }
          );
        }
      })
      .catch((err) => {
        toast.error(err, {
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
  let handleTestAuthentication = () => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/v1/test_ldap_authenticaion`, {
        authType: editAD.authType,
        bindCredential: editAD.bindCredential,
        bindDn: editAD.bindDn,
        connectionTimeout: editAD.connectionTimeout,
        connectionUrl: editAD.connectionUrl,
        startTls: editAD.startTls,
        useTruststoreSpi: editAD.useTruststoreSpi,
        headers: {
          Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
        }
      })
      .then((res) => {
        if (res.data.msg) {
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
        } else {
          toast.error(
            `Error when trying to connect to LDAP:'${res.data.errorMessage}'`,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Slide,
            }
          );
        }
        console.log(res.data);
      })
      .catch((err) => {
        toast.error(err, {
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
  const Goback = () => {
    navigate("/domain");
  };

  return (
    <div className="space-y-5 m-2 w-full edit_domain">
      <div className="flex justify-between items-center mx-10 p-3 pb-0 mt-3">
        <h2 className="font-bold text-3xl text-indigo-700">Edit LDAP</h2>
        <div className="flex items-center justify-center gap-10">
          <div className="flex justify-center items-center gap-2">
            <div className="flex justify-start ml=0">
              <button
                onClick={Goback}
                className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-10"
              >
                Go Back
              </button>
            </div>
            <label className="block text-lg font-medium leading-6 text-gray-900 border-0">
              Enabled
            </label>
            <div className="">
              <div className="mt-2 border-0">
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={handleChange}
                    name="enabled"
                    checked={editAD.enabled}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
          <div className="">
            <Menu as="div" className="relative">
              <Menu.Button className=" text-sm rounder-lg w-40 bg-white p-1 border-2 border-gray-900/10 hover:border-b-2 hover:border-b-blue-600 active:border-b-2 active:border-b-blue-600 focus:outline-none focus:boder-b-2 focus:border-b-blue-400 focus:boder-offset-2 focus:border-offset-gray-800">
                <div className="flex justify-center items-center gap-10 text-lg ">
                  Action
                  <ChevronDownIcon className="w-5 h-5" />
                </div>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 w-40 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 ">
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        onClick={() => handleOnClick("sync", domainID)}
                        className="block py-2 text-md text-left text-gray-700 hover:bg-gray-100 cursor-pointer px-2"
                      >
                        Sync changed users
                      </div>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        onClick={() => handleOnClick("syncChanged", domainID)}
                        className="block py-2 text-md text-gray-700 text-left hover:bg-gray-100 cursor-pointer px-2"
                      >
                        Sync all users
                      </div>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        onClick={() => handleOnClick("unlink", domainID)}
                        className="block py-2 text-md text-gray-700 text-left hover:bg-gray-100 cursor-pointer px-2"
                      >
                        Unlink users
                      </div>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        onClick={() => handleOnClick("remove", domainID)}
                        className="block py-2 text-md text-gray-700 text-left hover:bg-gray-100 cursor-pointer px-2"
                      >
                        Remove imported
                      </div>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        onClick={() => handleOnClick("delete", domainID)}
                        className="block py-2 text-sm text-gray-700 text-left hover:bg-gray-100 cursor-pointer px-2"
                      >
                        Delete
                      </div>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
      {/*Logic for popup*/}
      {/* <Popup
        open={open}
        setOpen={setOpen}
        sendData={sendData}
        heading="Please confirm"
        text="Are you sure you want to submit?"
        color="yellow"
      /> */}
      {/*General options*/}

      {editAD && (
        <div className="space-y-5 m-2 w-full">
          <div className="shadow-md bg-white mx-10 p-3 pb-0  rounded-md">
            <h2 className="font-semibold leading-7 text-indigo-700">
              General options
            </h2>

            <div className="text-left table-auto p-3">
              <div className=" domain-tr">
                <div className=" domain-td flex gap-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    UI display name
                  </label>
                  <span className="text-lg text-red-700">*</span>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        name="name"
                        value={editAD.name}
                        onChange={handleOnChange}
                        className="block flex-1 bg-transparent bg-white rounded-md border-2 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:leading-6"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className=" domain-tr">
                <div className=" domain-td flex gap-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Vendor
                  </label>
                  <span className="text-lg text-red-700">*</span>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <select
                      name="vendor"
                      value={editAD.vendor}
                      onChange={handleOnChange}
                      className="block  cursor-pointer rounded-md border-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                    >
                      <option value="ad">Active Directory</option>
                      <option value="rhds">Red Hat Directory Server</option>
                      <option value="tivoli">Tivoli</option>
                      <option value="edirectory">Novell eDirectory</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*Connection and authentication settings*/}
          <div className="shadow-md bg-white mx-10 p-3 pb-0  rounded-md ">
            <h2 className="font-semibold leading-7 text-indigo-700">
              Connection and authentication settings
            </h2>

            <div className="text-left table-auto p-3">
              <div className=" domain-tr">
                <div className=" domain-td flex gap-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Connection URL
                  </label>
                  <span className="text-lg text-red-700">*</span>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                      <input
                        type="text"
                        name="connectionUrl"
                        value={editAD.connectionUrl}
                        onChange={handleOnChange}
                        className="block flex-1 bg-transparent bg-white rounded-md border-2 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className=" domain-tr">
                <div className=" domain-td">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Enable StartTLS
                  </label>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <label className="switch">
                      <input
                        type="checkbox"
                        onChange={handleChange}
                        name="startTls"
                        checked={editAD.startTls}
                        
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className=" domain-tr">
                <div className=" domain-td">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Use Truststore SPI
                  </label>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <select
                      name="useTruststoreSpi"
                      value={editAD.useTruststoreSpi}
                      onChange={handleOnChange}
                      className="block  cursor-pointer rounded-md border-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option value="always">Always</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className=" domain-tr">
                <div className=" domain-td">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Connection pooling
                  </label>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <label className="switch">
                      <input
                        type="checkbox"
                        onChange={handleChange}
                        name="connectionPooling"
                        checked={editAD.connectionPooling}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className=" domain-tr">
                <div className=" domain-td">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Connection timeout
                  </label>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <div className="flex bg-white rounded-md border-2 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="number"
                        name="connectionTimeout"
                        onChange={handleOnChange}
                        value={editAD.connectionTimeout}
                        className="block flex-1 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="rounded-md border-indigo-600 px-3 py-2 border-2 text-sm font-semibold text-indigo-700 shadow-sm hover:border-indigo-500 hover:text-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleTestConnection}
              >
                Test Connection
              </button>
              <div className=" domain-tr">
                <div className=" domain-td">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Bind Type
                  </label>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <select
                      name="authType"
                      value={editAD.authType}
                      onChange={handleOnChange}
                      className="block  cursor-pointer rounded-md border-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option value="simple">Simple</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className=" domain-tr">
                <div className=" domain-td flex gap-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Bind DN
                  </label>
                  <span className="text-lg text-red-700">*</span>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <div className="flex bg-white rounded-md border-2 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        name="bindDn"
                        onChange={handleOnChange}
                        value={editAD.bindDn}
                        className="block flex-1 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className=" domain-tr">
                <div className=" domain-td flex gap-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Bind Credentials
                  </label>
                  <span className="text-lg text-red-700">*</span>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <div className="flex bg-white rounded-md border-2 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600  relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="bindCredential"
                        onChange={handleOnChange}
                        value={editAD.bindCredential}
                        className="block flex-1 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        id="passwordInput"
                      />
                      <span
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={togglePassword}
                      >
                        {showPassword ? (
                          <EyeIcon className="h-4 w-4" />
                        ) : (
                          <EyeSlashIcon className="h-4 w-4" />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="rounded-md border-indigo-600 px-3 py-2 border-2 text-sm font-semibold text-indigo-700 shadow-sm hover:border-indigo-500 hover:text-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleTestAuthentication}
              >
                Test authentication
              </button>
            </div>
          </div>
          {/*LDAP searching and updating */}
          <div className="shadow-md bg-white p-3 mx-10   rounded-md ">
            <h2 className="font-semibold leading-7 text-indigo-700 ">
              LDAP searching and updating
            </h2>

            <div className="text-left table-auto">
              <div className=" domain-tr">
                <div className=" domain-td flex gap-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Edit mode
                  </label>
                  <span className="text-lg text-red-700">*</span>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <select
                      name="editMode"
                      onChange={handleOnChange}
                      value={editAD.editMode}
                      className="block  cursor-pointer rounded-md border-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option selected value={""} disabled>
                        --
                      </option>
                      <option value="read_only">Read_only</option>
                      <option value="writable">Writable</option>
                      <option value="unsynced">Unsynced</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className=" domain-tr">
                <div className=" domain-td flex gap-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Users DN
                  </label>
                  <span className="text-lg text-red-700">*</span>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        name="usersDn"
                        onChange={handleOnChange}
                        value={editAD.usersDn}
                        className="block flex-1 bg-white rounded-md border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className=" domain-tr">
                <div className=" domain-td flex gap-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Username LDAP Attribute
                  </label>
                  <span className="text-lg text-red-700">*</span>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        name="usernameLDAPAttribute"
                        onChange={handleOnChange}
                        value={editAD.usernameLDAPAttribute}
                        className="block flex-1 bg-white rounded-md border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className=" domain-tr">
                <div className=" domain-td flex gap-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    RDN LDAP Attribute
                  </label>
                  <span className="text-lg text-red-700">*</span>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        name="rdnLDAPAttribute"
                        onChange={handleOnChange}
                        value={editAD.rdnLDAPAttribute}
                        className="block flex-1 bg-white rounded-md border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className=" domain-tr">
                <div className=" domain-td flex gap-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    UUID LDAP attribute
                  </label>
                  <span className="text-lg text-red-700">*</span>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                      <input
                        type="text"
                        name="uuidLDAPAttribute"
                        onChange={handleOnChange}
                        value={editAD.uuidLDAPAttribute}
                        className="block flex-1 bg-white rounded-md border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className=" domain-tr">
                <div className=" domain-td flex gap-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0 ">
                    User object classes
                  </label>
                  <span className="text-lg text-red-700">*</span>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <div className="flex bg-white rounded-md border-2 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                      <input
                        type="text"
                        name="userObjectClasses"
                        onChange={handleOnChange}
                        value={editAD.userObjectClasses}
                        className="block flex-1 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className=" domain-tr">
                <div className=" domain-td">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0 ">
                    User LDAP filter
                  </label>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <div className="flex bg-white rounded-md border-2 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        name="customUserSearchFilter"
                        onChange={handleOnChange}
                        value={editAD.customUserSearchFilter}
                        className="block flex-1 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className=" domain-tr">
                <div className=" domain-td">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Search scope
                  </label>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <select
                      name="searchScope"
                      value={editAD.searchScope}
                      onChange={handleOnChange}
                      className="block cursor-pointer rounded-md py-1.5 text-gray-900 shadow-sm "
                    >
                      <option value="One Level">One Level</option>
                      <option value="Sub tree">Sub tree</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className=" domain-tr">
                <div className=" domain-td">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Read timeout
                  </label>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        name="readTimeout"
                        value={editAD.readTimeout}
                        onChange={handleOnChange}
                        className="block flex-1 bg-white rounded-md border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className=" domain-tr">
                <div className=" domain-td">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Pagination
                  </label>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <label className="switch">
                      <input
                        type="checkbox"
                        onChange={handleChange}
                        name="pagination"
                        checked={editAD.pagination}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className=" domain-tr">
                <div className=" domain-td">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Referral
                  </label>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <select
                      name="referral"
                      value={editAD.referral}
                      onChange={handleOnChange}
                      className="block  cursor-pointer rounded-md border-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option value="ignore">ignore</option>
                      <option value="follow">follow</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*Synchronization settings*/}
          <div className="shadow-md bg-white mx-10 p-3 pb-0   rounded-md">
            <h2 className="font-semibold leading-7 text-indigo-700">
              Synchronization settings
            </h2>

            <div className="text-left table-auto p-3">
              <div className=" domain-tr">
                <div className=" domain-td">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Import users
                  </label>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <label className="switch">
                      <input
                        type="checkbox"
                        onChange={handleChange}
                        name="importEnabled"
                        checked={editAD.importEnabled}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className=" domain-tr">
                <div className=" domain-td">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Sync Registrations
                  </label>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <label className="switch">
                      <input
                        type="checkbox"
                        onChange={handleChange}
                        name="syncRegistrations"
                        checked={editAD.syncRegistrations}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className=" domain-tr">
                <div className=" domain-td">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Batch size
                  </label>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        name="batchSizeForSync"
                        value={editAD.batchSizeForSync}
                        onChange={handleOnChange}
                        className="block flex-1 bg-transparent bg-white rounded-md border-2 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className=" domain-tr">
                <div className=" domain-td">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Periodic full sync
                  </label>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <label className="switch">
                      <input
                        type="checkbox"
                        onChange={handleChange}
                        name="fullSyncEnabled"
                        checked={syncSettingsEnable.fullSyncEnabled}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
              {syncSettingsEnable.fullSyncEnabled && (
                <div className=" domain-tr">
                  <div className=" domain-td">
                    <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                      Full sync period
                    </label>
                  </div>
                  <div className=" domain-td">
                    <div className="mt-2 border-0">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                        <input
                          type="text"
                          name="fullSyncPeriod"
                          value={editAD.fullSyncPeriod}
                          onChange={handleOnChange}
                          className="block flex-1 bg-transparent bg-white rounded-md border-2 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className=" domain-tr">
                <div className=" domain-td">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Periodic changed users sync
                  </label>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <label className="switch">
                      <input
                        type="checkbox"
                        onChange={handleChange}
                        name="changedSyncEnabled"
                        checked={syncSettingsEnable.changedSyncEnabled}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
              {syncSettingsEnable.changedSyncEnabled && (
                <div className=" domain-tr">
                  <div className=" domain-td">
                    <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                      Changed users sync period
                    </label>
                  </div>
                  <div className=" domain-td">
                    <div className="mt-2 border-0">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                        <input
                          type="text"
                          name="changedSyncPeriod"
                          value={editAD.changedSyncPeriod}
                          onChange={handleOnChange}
                          className="block flex-1 bg-transparent bg-white rounded-md border-2 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/*Kerberos integration*/}
          <div className="shadow-md bg-white mx-10 p-3 pb-0  rounded-md ">
            <h2 className="font-semibold leading-7 text-indigo-700">
              Kerberos integration
            </h2>
            <div className="text-left table-auto p-3">
              <div className=" domain-tr">
                <div className=" domain-td">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Allow Kerberos authentication
                  </label>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <label className="switch">
                      <input
                        type="checkbox"
                        onChange={handleChange}
                        name="allowKerberosAuthentication"
                        checked={editAD.allowKerberosAuthentication}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
              {editAD.allowKerberosAuthentication && (
                <>
                  <div className=" domain-tr">
                    <div className=" domain-td flex gap-1">
                      <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                        Kerberos realm
                      </label>
                      <span className="text-lg text-red-700">*</span>
                    </div>
                    <div className=" domain-td">
                      <div className="mt-2 border-0">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                          <input
                            type="text"
                            name="kerberosRealm"
                            value={editAD.kerberosRealm}
                            onChange={handleOnChange}
                            className="block flex-1 bg-transparent bg-white rounded-md border-2 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" domain-tr">
                    <div className=" domain-t flex gap-1">
                      <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                        Server principal
                      </label>
                      <span className="text-lg text-red-700">*</span>
                    </div>
                    <div className=" domain-td">
                      <div className="mt-2 border-0">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                          <input
                            type="text"
                            name="serverPrincipal"
                            value={editAD.serverPrincipal}
                            onChange={handleOnChange}
                            className="block flex-1 bg-transparent bg-white rounded-md border-2 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" domain-tr">
                    <div className=" domain-td flex gap-1">
                      <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                        Key tab
                      </label>
                      <span className="text-lg text-red-700">*</span>
                    </div>
                    <div className=" domain-td">
                      <div className="mt-2 border-0">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                          <input
                            type="text"
                            name="keyTab"
                            value={editAD.keyTab}
                            onChange={handleOnChange}
                            className="block flex-1 bg-transparent bg-white rounded-md border-2 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" domain-tr">
                    <div className=" domain-td flex gap-1">
                      <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                        Kerberos principal attribute
                      </label>
                      <span className="text-lg text-red-700">*</span>
                    </div>
                    <div className=" domain-td">
                      <div className="mt-2 border-0">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                          <input
                            type="text"
                            name="krbPrincipalAttribute"
                            value={editAD.krbPrincipalAttribute}
                            onChange={handleOnChange}
                            className="block flex-1 bg-transparent bg-white rounded-md border-2 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" domain-tr">
                    <div className=" domain-td">
                      <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                        Debug
                      </label>
                    </div>
                    <div className=" domain-td">
                      <div className="mt-2 border-0">
                        <label className="switch">
                          <input
                            type="checkbox"
                            onChange={handleChange}
                            name="debug"
                            checked={editAD.debug}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className=" domain-tr">
                <div className=" domain-td">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Use Kerberos for password authentication
                  </label>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <label className="switch">
                      <input
                        type="checkbox"
                        onChange={handleChange}
                        name="useKerberosForPasswordAuthentication"
                        checked={editAD.useKerberosForPasswordAuthentication}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*Cache settings*/}
          <div className="shadow-md bg-white mx-10 p-3 pb-0   rounded-md">
            <h2 className="font-semibold leading-7 text-indigo-700">
              Cache settings
            </h2>

            <div className="text-left table-auto p-3">
              <div className=" domain-tr">
                <div className=" domain-td">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Cache policy
                  </label>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <select
                      name="cachePolicy"
                      value={editAD.cachePolicy}
                      onChange={handleOnChange}
                      className="block  cursor-pointer rounded-md border-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      {[
                        "DEFAULT",
                        "EVICT_DAILY",
                        "EVICT_WEEKLY",
                        "MAX_LIFESPAN",
                        "NO_CACHE",
                      ].map((item) => (
                        <option value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*Advanced settings*/}
          <div className="shadow-md bg-white mx-10 p-3 pb-0  rounded-md">
            <h2 className="font-semibold leading-7 text-indigo-700">
              Advanced settings
            </h2>

            <div className="text-left table-auto p-3">
              <div className=" domain-tr">
                <div className=" domain-td">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Enable the LDAPv3 password modify extended operation
                  </label>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <label className="switch">
                      <input
                        type="checkbox"
                        onChange={handleChange}
                        name="usePasswordModifyExtendedOp"
                        checked={editAD.usePasswordModifyExtendedOp}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className=" domain-tr">
                <div className=" domain-td">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Validate password policy
                  </label>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <label className="switch">
                      <input
                        type="checkbox"
                        onChange={handleChange}
                        name="validatePasswordPolicy"
                        checked={editAD.validatePasswordPolicy}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className=" domain-tr">
                <div className=" domain-td">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Trust Email
                  </label>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <label className="switch">
                      <input
                        type="checkbox"
                        onChange={handleChange}
                        name="trustEmail"
                        checked={editAD.trustEmail}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Buttons */}

          <div className="  flex justify-start items-center buttons mx-10 ">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 mx-1 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleOnSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditDomain;
