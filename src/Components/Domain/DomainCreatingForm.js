import { useState, useContext } from "react";
import { PoolContext } from "../../Context/PoolContext";
import "./Domain.css";
import Popup from "../Popup/Popup";
import { Slide, toast } from "react-toastify";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function DomainCreationForm() {
  const navigate = useNavigate();
  //pool context
  const pc = useContext(PoolContext);
  const token=pc.token;
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  //state for popup
  const [open, setOpen] = useState(false);
  let [syncSettingsEnable, setSyncSettingsEnable] = useState({
    fullSyncEnabled: false,
    changedSyncEnabled: false,
  });
  //state for all input fields
  let [ad, setAd] = useState({
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
    serverPrincipal: "",
    krbPrincipalAttribute: "",
  });
  //function for confirmation in popup menu
  let sendData = () => {
    console.log(ad);
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/v1/ad_ldap_connection`, ad,{
        headers: {
          Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
        }
      })
      .then((res) => {
        console.log(res);
        if (res.data.status_code == 201) {
          toast.success("LDAP configuration success", {
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
          pc.setisDomainAvailable(true);
          pc.setAvailableDomains(res.data.ldaps);
          navigate("/domain");
          reset();
        } else {
          toast.error("LDAP configuration failed", {
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
        toast.error("LDAP configuration failed", {
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
    setAd({ ...ad, [e.target.name]: e.target.value });
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
      e.target.name == "fullSyncEnabled"
        ? setAd({ ...ad, fullSyncPeriod: "604800" })
        : setAd({ ...ad, fullSyncPeriod: "-1" })(
            e.target.name == "fullSyncEnabled"
          )
        ? setAd({ ...ad, changedSyncPeriod: "86400" })
        : setAd({ ...ad, changedSyncPeriod: "-1" });
    } else {
      setAd({ ...ad, [e.target.name]: e.target.checked });
    }
  };
  //opens confirmation popup and check for any empty fields
  let handleOnClick = (e) => {
    if (
      // true
      ad.name &&
      ad.vendor &&
      ad.connectionUrl &&
      ad.authType &&
      ad.bindDn &&
      ad.bindCredential &&
      ad.editMode &&
      ad.usersDn &&
      ad.usernameLDAPAttribute &&
      ad.rdnLDAPAttribute &&
      ad.uuidLDAPAttribute &&
      ad.userObjectClasses
    ) {
      console.log(ad);
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
    setAd({
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
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/test_ldap_connection`,
        {
          authType: ad.authType,
          bindCredential: ad.bindCredential,
          bindDn: ad.bindDn,
          connectionTimeout: ad.connectionTimeout,
          connectionUrl: ad.connectionUrl,
          startTls: ad.startTls,
          useTruststoreSpi: ad.useTruststoreSpi,
          headers: {
            Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
          }
        }
      )
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
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/test_ldap_authenticaion`,
        {
          authType: ad.authType,
          bindCredential: ad.bindCredential,
          bindDn: ad.bindDn,
          connectionTimeout: ad.connectionTimeout,
          connectionUrl: ad.connectionUrl,
          startTls: ad.startTls,
          useTruststoreSpi: ad.useTruststoreSpi,
          headers: {
            Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
          }
        }
      )
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
    navigate(-1);
  };
  return (
    <div className="space-y-5 m-2 w-full domain_creation_form  ">
      <div className="flex justify-around items-center ">
      <h2 className="font-semibold mx-10 p-3 pb-0 text-3xl text-gray-700 ">
        LDAP
      </h2>
      <div className="flex justify-start ml=0">
        <button
          onClick={Goback}
          className="mr-11 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-10 w-69 h-10"
        >
          Go Back
        </button>
      </div>
      </div>

      {/*Logic for popup*/}
      <Popup
        open={open}
        setOpen={setOpen}
        sendData={sendData}
        heading="Please confirm"
        text="Are you sure you want to submit?"
        color="yellow"
      />
      {/*General options*/}
      <div className="shadow-md mx-10 p-3 pb-0 bg-white w-3/4 rounded-md">
        <h2 className="font-bold leading-7 text-indigo-600">
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
                    value={ad.name}
                    onChange={handleOnChange}
                    className="block flex-1 bg-transparent bg-white rounded-md border-2 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 w-full"
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
                  value={ad.vendor}
                  onChange={handleOnChange}
                  className="block  cursor-pointer rounded-md border-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
      <div className="shadow-md bg-white mx-10 p-3 pb-0  w-3/4 rounded-md">
        <h2 className="font-bold leading-7 text-indigo-600">
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
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    type="text"
                    name="connectionUrl"
                    value={ad.connectionUrl}
                    onChange={handleOnChange}
                    className="block flex-1 bg-transparent bg-white rounded-md border-2 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 "
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
                  value={ad.useTruststoreSpi}
                  onChange={handleOnChange}
                  className="block  cursor-pointer rounded-md border-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                <div className="flex bg-white rounded-md border-2 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                  <input
                    type="number"
                    name="connectionTimeout"
                    onChange={handleOnChange}
                    value={ad.connectionTimeout}
                    className="block flex-1 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 "
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
            <div className=" domain-td flex gap-1">
              <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                Bind Type
              </label>
              <span className="text-lg text-red-700">*</span>
            </div>
            <div className=" domain-td">
              <div className="mt-2 border-0">
                <select
                  name="authType"
                  value={ad.authType}
                  onChange={handleOnChange}
                  className="block  cursor-pointer rounded-md border-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  
                >
                  {/* block w-full cursor-pointer rounded-md border-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 w-80 */}
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
                    value={ad.bindDn}
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
                    value={ad.bindCredential}
                    className="block flex-1 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 "
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
      <div className="shadow-md bg-white p-3 mx-10  w-3/4 rounded-md">
        <h2 className="font-bold leading-7 text-indigo-600 ">
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
                  value={ad.editMode}
                  className="block  cursor-pointer rounded-md border-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                    value={ad.usersDn}
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
                    value={ad.usernameLDAPAttribute}
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
                    value={ad.rdnLDAPAttribute}
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
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    type="text"
                    name="uuidLDAPAttribute"
                    onChange={handleOnChange}
                    value={ad.uuidLDAPAttribute}
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
                <div className="flex bg-white rounded-md border-2 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    type="text"
                    name="userObjectClasses"
                    onChange={handleOnChange}
                    value={ad.userObjectClasses}
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
                    value={ad.customUserSearchFilter}
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
                  value={ad.searchScope}
                  onChange={handleOnChange}
                  className="block  cursor-pointer rounded-md border-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                    value={ad.readTimeout}
                    onChange={handleOnChange}
                    className="block flex-1 bg-white rounded-md border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 "
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
                  value={ad.referral}
                  onChange={handleOnChange}
                  className="block  cursor-pointer rounded-md border-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
      <div className="shadow-md bg-white mx-10 p-3 pb-0 w-3/4 rounded-md">
        <h2 className="font-bold leading-7 text-indigo-600">
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
                    checked={ad.importEnabled}
                    // ref={checkboxRef}
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
                    checked={ad.syncRegistrations}
                    // ref={checkboxRef}
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
                    value={ad.batchSizeForSync}
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
                    // ref={checkboxRef}
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
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                    <input
                      type="text"
                      name="fullSyncPeriod"
                      value={ad.fullSyncPeriod}
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
                    // ref={checkboxRef}
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
                      value={ad.changedSyncPeriod}
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
      <div className="shadow-md bg-white mx-10 p-3 pb-0  w-3/4 rounded-md">
        <h2 className="font-bold leading-7 text-indigo-600">
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
                    checked={ad.allowKerberosAuthentication}
                    // ref={checkboxRef}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
          {ad.allowKerberosAuthentication && (
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
                        value={ad.kerberosRealm}
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
                        value={ad.serverPrincipal}
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
                        value={ad.keyTab}
                        onChange={handleOnChange}
                        className="block flex-1 bg-transparent bg-white rounded-md border-2 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 "
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className=" domain-tr">
                <div className=" domain-td">
                  <label className="block text-sm font-medium leading-6 text-gray-900 border-0">
                    Kerberos principal attribute
                  </label>
                </div>
                <div className=" domain-td">
                  <div className="mt-2 border-0">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        name="krbPrincipalAttribute"
                        value={ad.krbPrincipalAttribute}
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
                        checked={ad.debug}
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
                    checked={ad.useKerberosForPasswordAuthentication}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*Cache settings*/}
      <div className="shadow-md bg-white mx-10 p-3 pb-0 w-3/4 rounded-md">
        <h2 className="font-bold leading-7 text-indigo-600">
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
                  value={ad.cachePolicy}
                  onChange={handleOnChange}
                  className="block  cursor-pointer rounded-md border-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
      <div className="shadow-md bg-white mx-10 p-3 pb-0  w-3/4 rounded-md">
        <h2 className="font-bold leading-7 text-indigo-600">
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
                    checked={ad.usePasswordModifyExtendedOp}
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
                    checked={ad.validatePasswordPolicy}
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
                    checked={ad.trustEmail}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Buttons */}
      <div className="ml-10 pl-5 buttons">
        {/* <button
          type="reset"
          className="rounded-md bg-gray-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          onClick={reset}
        >
          Reset
        </button> */}
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleOnClick}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
