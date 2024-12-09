import { Fragment, useRef, useState,useEffect,useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import CustomTabs from "../CustomTabs/CustomTabs";
import { add } from "date-fns";
import axios from "axios";
import { PoolContext } from "../../Context/PoolContext";
import { Slide, toast } from "react-toastify";
import MachineRdp from "./MachineRdp";
import MachineSSH from "./MachineSSH";
import MachineVNC from "./MachineVNC";

export default function EditMahchinePopover(props) {
 
    const cancelButtonRef = useRef(null);
    const [editMachine, setEditMachine] = useState({ ...props.machine });
    const [isChecked, setIsChecked] = useState(false);
    const pc = useContext(PoolContext);
 
    const token=pc.token
    let securityMode = [
        "None",
        "Any",
        "NLA",
        "RDP encryption",
        "TLS encryption",
        "Hyper-V / VMConnect",
      ];
    useEffect(() => {
      setEditMachine({ ...props.machine });
    }, [props.machine]);
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      let newValue = value;
  
      if (type === "checkbox") {
        newValue = checked;
      } else if (
        [
          "guacd_port",
          "max_connections",
          "max_connections_per_user",
          "gateway_port",
          "width",
          "height",
          "dpi",
          "sftp_port",
          "sftp_server_alive_interval",
          "scrollback",
          "font_size",
          "destination_port",
          "port",
        ].includes(name)
      ) {
        newValue = value ? parseInt(value, 10) : null;
      }
      
  
      setEditMachine((prevState) => ({
        ...prevState,
        [name]: newValue,
      }));
      
    };
  
    const handleCheckboxChange = () => {
      setIsChecked((prevState) => !prevState); // Use a function to toggle the state
    };
  
    const handleConfirm = () => {
      console.log(editMachine,"editMachine");
        axios
          .put(`${process.env.REACT_APP_BACKEND_URL}/v1/update_machine/${editMachine.identifier}`, editMachine,{
            headers: {
              Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
            }
          })
          .then((res) => {
          
            
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
            
            // Update machine details in parent component
            props.setVmAvailable(res.data.machines)
            
            props.setOpen(false);

          })
          .catch((err) => {
            console.error("Failed to update machine:", err);
            toast.error("Failed to update machine", {
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
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={props.setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg w-auto divide-y divide-slate-400">
                <div className="p-6">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="pl-4">
                          <label
                            htmlFor="name"
                            className="mb-2 text-sm font-medium leading-6 text-gray-900"
                          >
                            Name
                          </label>
                        </td>
                        <td className="pr-4">
                          <div className="mt-2 border-0">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                              <input
                                type="text"
                                id="name"
                                name="name"
                                value={editMachine.name}
                                onChange={handleChange}
                                placeholder="Name"
                                
                                className="block flex-1 rounded-md  bg-white  border-slate-300 py-1.5 pl-1 text-gray-700 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="pl-4">
                          <label
                            htmlFor="ip"
                            className="mb-2 text-sm font-medium leading-6 text-gray-900"
                          >
                            Hostname/IP
                          </label>
                        </td>
                        <td className="pr-4">
                          <div className="mt-2 border-0">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                              <input
                                type="text"
                                id="ip"
                                name="hostname"
                                value={editMachine.hostname}
                                onChange={handleChange}
                                placeholder="Hostname / IP"
                                className="block flex-1 rounded-md bg-white bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="pl-4">
                          <label
                            htmlFor="protocol"
                            className="mb-2 text-sm font-medium leading-6 text-gray-900"
                          >
                            Protocol
                          </label>
                        </td>
                        <td className="pr-4 w-2/3">
                          <div className="mt-1">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                              <input
                                id="protocol"
                                name="protocol"
                                onChange={handleChange}
                                value={editMachine.protocol}
                                placeholder="Protocol"
                                className="block flex-1 rounded-md bg-blue-100 py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm border border-gray-300 focus:border-indigo-500"
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                      {/* <tr>
                        <td className="pl-4">
                          <label
                            htmlFor="port"
                            className="mb-2 text-sm font-medium leading-6 text-gray-900"
                          >
                            Port Number
                          </label>
                        </td>
                        <td className="pr-4">
                          <div className="mt-2  border-0">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                              <input
                                type="number"
                                id="port"
                                name="port"
                                value={editMachine.port}
                                onChange={handleChange}
                                placeholder="Port"
                                className="block flex-1 rounded-md bg-white bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2"
                              />
                            </div>
                          </div>
                        </td>
                      </tr> */}
                      <tr>
                        <td className="pl-4 col-span-2">
                          <input
                            type="checkbox"
                            className="mr-2"
                            name="is_custom_machine"
                            checked={editMachine.is_custom_machine} 
                            onChange={handleChange}
                          />

                          <label
                            htmlFor="custom settings"
                            className="mb-2 text-sm font-medium leading-6 text-gray-900"
                          >
                            Custom Settings
                          </label>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {editMachine.protocol == "RDP" &&  editMachine.is_custom_machine && (
                    <MachineRdp securityMode={securityMode}  poolDetails={editMachine}
                    onChange={handleChange}/>
                  )}
                  {editMachine.protocol == "SSH" &&  editMachine.is_custom_machine &&<MachineSSH  poolDetails={editMachine}
                      onChange={handleChange}/>}
                  {editMachine.protocol == "VNC" &&  editMachine.is_custom_machine &&<MachineVNC  poolDetails={editMachine}
                      onChange={handleChange}/>}
                </div>
                <div className="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm bg-indigo-500 hover:bg-indigo-700 sm:ml-3 sm:w-auto`}
                    onClick={handleConfirm}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-white hover:bg-slate-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => props.setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
