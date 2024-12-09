import React, { useContext, useState, useEffect, useRef } from "react";
import { PoolContext } from "../../Context/PoolContext";
import axios from "axios";
import "./css/ShowPools.css";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import EntitleUser from "./EntitleUser";
import { Slide, toast } from "react-toastify";
import AddMachinePopover from "./AddMachinePopover";
import Loading from "../../images/loading.png";
import {
  XMarkIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import EditMahchinePopover from "./EditMachinePopover";
import { Co2Sharp } from "@mui/icons-material";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ManagePool = (props) => {
  //state for loading
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [machinesLoading, setMachinesLoading] = useState(true);
  const location = useLocation();
  let [selectedPoolDetails, setSelectedPoolDetails] = useState({});

  let [poolId, setPoolId] = useState(useParams().id);
  const token = props.token;
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/v1/pool/${poolId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the Bearer token in the Authorization header
        },
      })
      .then((res) => {
        setSelectedPoolDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const navigate = useNavigate();
  //pool context
  const pc = useContext(PoolContext);
  //state for vms available in the pool
  let [vmAvailable, setVmAvailable] = useState([]);

  //state for assigned users
  let [assignedUsers, setAssignedUsers] = useState([]);
  //state for available users
  let [users, setUsers] = useState([]);
  //state for selected vm
  let [selectedVm, setSelectedVm] = useState();
  //State for machine identifier
  let [selectedVmIdentifier, setSelectedVmIdentifier] = useState();

  //state for entitle user popup
  const [showEntitlePopup, setShowEntitlePopup] = useState(false);

  //state for add machine popover
  const [open, setOpen] = useState(false);
  //state for edit machine popover
  const [editMachinePopupOpen, setEditMachinePopupOpen] = useState(false);

  //state for pool type
  const [poolType, setPoolType] = useState();
  //entitle user
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(users);

  //function to show entitle popup
  let entitlePopup = () => {
    if (selectedVm != undefined) {
      setShowEntitlePopup(true);
    } else {
      setShowEntitlePopup(false);
      //toast is generated if any input fields are empty
      toast.error("Select any machine to entitle", {
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
  //function to edit VM
  let editPool = () => {
    navigate(`/pools/edit-pool/${selectedPoolDetails.id}`);
  };
  //function to display assigned users
  let showAssignedUsers = (machineIdentifier, machineId) => {
    setUsersLoading(true);
    setSelectedVm(machineId);
    setSelectedVmIdentifier(machineIdentifier);
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/machine/users/${machineId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Bearer token in the Authorization header
          },
        }
      )
      .then((res) => {
        const assignedUsersData = res.data || []; // Ensure data is not undefined
        setAssignedUsers(assignedUsersData);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setUsersLoading(false);
      });
  };

  // Function to delete an assigned user
  let deleteAssignedUser = (user) => {
    setUsersLoading(true);

    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_URL}/v1/delete_user_from_machine/${selectedVmIdentifier}/${user}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Bearer token in the Authorization header
          },
        }
      )
      .then((res) => {
        // Ensure response contains assignedUsers
        if (res.data && res.data.users_assigned) {
          setAssignedUsers([...res.data.users_assigned]); // Create a new array
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
        }
        pc.setAvailablePools(res.data.pools);
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        // Handle error gracefully, show toast or any appropriate UI feedback
        toast.error("Failed", {
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
      .finally(() => {
        setUsersLoading(false);
      });
  };
  useEffect(() => {
    // Define the function inside useEffect to avoid unnecessary re-creation
    const fetchVMs = async () => {
      // Make sure selectedPoolId is valid before making the request
      if (!selectedPoolDetails.id) return;

      setMachinesLoading(true);

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/v1/pool/machines/${selectedPoolDetails.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the Bearer token in the Authorization header
            },
          }
        );

        // Check if the response data is an array and update the state accordingly
        if (Array.isArray(response.data)) {
          setVmAvailable(response.data);
        } else {
          setVmAvailable([]);
        }
      } catch (err) {
        console.error("Error fetching VMs:", err);
        // Optionally handle error states here, such as displaying an error message
        setVmAvailable([]);
      } finally {
        setMachinesLoading(false);
      }
    };

    fetchVMs();
  }, [selectedPoolDetails.id]);

  //function to handle search
  const handleSearch = (e) => {
    try {
      const searchText = e.target.value.toLowerCase();
      const filteredResults = users.filter((user) =>
        user.username.toLowerCase().includes(searchText)
      );
      setFilteredData(filteredResults);
      setSearchTerm(searchText);
    } catch (err) {
      setFilteredData([]);
    }
  };
  // Function to entitle a user
  let entitleUser = (usr) => {
    setUsersLoading(true);
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/v1/add_user_to_machine/${selectedVmIdentifier}/${usr}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        // Ensure response contains assignedUsers
        if (res.data && res.data.users_assigned) {
          setAssignedUsers([...res.data.users_assigned]); // Create a new array
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
        }
        pc.setAvailablePools(res.data.pools);
        console.log(res.data.pools);
      })
      .catch((error) => {
        console.error("Error entitling user:", error);
        // Handle error gracefully, show toast or any appropriate UI feedback
        toast.error("Failed", {
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
      .finally(() => {
        setUsersLoading(false);
      });
  };
  //delete Pool
  let deletePool = () => {
    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_URL}/v1/delete_pool/${selectedPoolDetails.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Bearer token in the Authorization header
          },
        }
      )
      .then((res) => {
        console.log(res);
        if (res.status == 200) {
          pc.setAvailablePools(res.data.pools);
          toast.success("Pool deleted successfully", {
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
          navigate("/pools");
          if (res.data.available_pools.length == 0) {
            pc.setIsPoolAvailable(false);
          }
        } else {
          setLoading(false); // Hide loading indicator
          toast.error("Failed to delete machine", {
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
        setLoading(false); // Hide loading indicator
        console.error("Error deleting pool:", err);
      });
  };
  let [editMachineDetails, setEditMachineDetails] = useState();

  //state for machine data
  let editVM = (mach) => {
    setEditMachineDetails(mach);
    setEditMachinePopupOpen(true);
  };
  // Function to delete VM
  let deleteVM = (mach) => {
    setLoading(true); // Show loading indicator
    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_URL}/v1/delete_machine/${mach}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Bearer token in the Authorization header
          },
        }
      )
      .then((res) => {
        // Update vmAvailable state with the updated list of machines
        setVmAvailable([...res.data.machines] || []); // Ensure vmAvailable is updated even if res.data.machines is empty
        setLoading(false); // Hide loading indicator
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
        setLoading(false); // Hide loading indicator
        console.error("Error deleting machine:", err);
        toast.error("Failed to delete machine", {
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

  //get all user details when render
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/v1/guacamole/list_users`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the Bearer token in the Authorization header
        },
      })
      .then((res) => {
        const availableUsers = res.data.data.filter(
          (user) => !assignedUsers.includes(user.username)
        );
        setUsers(availableUsers);
        setFilteredData(availableUsers);
      })
      .catch((err) => {
        setUsers([]);
        setFilteredData([]);
      });
  }, [assignedUsers]);

  const checkboxRef = useRef(null);
  const Goback = () => {
    navigate("/pools");
  };
  return (
    <div className="show-pools flex justify-start items-start gap-2 w-full h-4/5 manage_pool">
      <button
        onClick={Goback}
        className="ml-4 bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-10"
      >
        Go Back
      </button>
      <div className="m-10 p-3 pb-0 shadow-lg w-2/4 h-full bg-white">
        <div className="flex justify-between mb-3 items-center">
          <h2 className="font-bold leading-7 text-gray-600 uppercase">
            <span className="text-indigo-700">Pool Name : </span>
            {selectedPoolDetails.pool_name}
          </h2>
          <div className="flex gap-2 justify-evenly items-center">
            <button
              className="bg-indigo-500 hover:bg-indigo-600 hover:text-gray-300 text-white rounded-md px-3 py-2 text-sm font-medium flex flex-col gap-2"
              onClick={editPool}
            >
              Edit
            </button>
            <AddMachinePopover
              open={open}
              setOpen={setOpen}
              poolId={poolId}
              vmAvailable={vmAvailable}
              setVmAvailable={setVmAvailable}
              selectedPoolDetails={selectedPoolDetails}
            />
            <EditMahchinePopover
              open={editMachinePopupOpen}
              setOpen={setEditMachinePopupOpen}
              poolId={poolId}
              vmAvailable={vmAvailable}
              setVmAvailable={setVmAvailable}
              machine={editMachineDetails}
            />
            <div className="bg-indigo-500 hover:bg-indigo-600 hover:text-gray-300 text-white rounded-md px-3 py-2 text-sm font-medium flex gap-1">
              <PlusIcon className="h-5 w-5" />
              <button
                type="button"
                id="options-menu"
                aria-expanded="true"
                aria-haspopup="true"
                onClick={() => setOpen(!props.isOpen)}
              >
                Add Machine
              </button>
            </div>
            <button
              className="bg-indigo-500 hover:bg-indigo-600 hover:text-gray-300 text-white rounded-md px-3 py-2 text-sm font-medium flex flex-col gap-2"
              onClick={entitlePopup}
            >
              Entitle
            </button>
            <button className="bg-indigo-500 hover:bg-indigo-600 hover:text-gray-300 text-white rounded-md px-3 py-2 text-sm font-medium flex flex-col gap-2">
              Restart
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white rounded-md px-3 py-2 text-sm font-medium flex flex-col gap-2"
              onClick={deletePool}
            >
              Delete
            </button>
          </div>
        </div>
        {machinesLoading ? ( // Show loading state
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={Loading}
              className="App-logo animate-spin"
              alt="loading"
            />
          </div>
        ) : vmAvailable.length > 0 ? ( // Show machines if available
          <div className="overflow-y-auto">
            <table className="bg-white table-auto w-full">
              <thead className="divide-y-2">
                <tr className="rounded-md">
                  {[
                    "Name",
                    "Protocol",
                    "IP/Host",
                    "Port",
                    "Custom Settings",
                  ].map((header, index) => (
                    <th
                      key={index}
                      className="p-3 border-gray-300 text-left text-sm uppercase font-bold text-gray-600"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-500 text-sm">
                {vmAvailable
                  .sort((a, b) => {
                    const nameA = a.name || ""; // Use empty string if name is undefined
                    const nameB = b.name || ""; // Use empty string if name is undefined
                    return nameA.localeCompare(nameB);
                  })
                  .map((item) => (
                    <tr
                      key={item.identifier}
                      className={`text-left border-b-2 cursor-pointer ${
                        selectedVm === item.id
                          ? "bg-gray-200"
                          : "hover:bg-gray-200 hover:text-black"
                      }`}
                      onClick={() =>
                        showAssignedUsers(item.identifier, item.id)
                      }
                    >
                      <td className="p-3">{item.name}</td>
                      <td className="p-3">{item.protocol}</td>
                      <td className="p-3">{item.hostname}</td>
                      <td className="p-3">{item.port}</td>
                      <td
                        className="p-3 text-center cursor-pointer   transition duration-150 ease-in-out rounded-md"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.is_custom_machine ? (
                          <i className="fa-regular fa-circle-check text-indigo-500 text-lg"></i> // Green check icon for true state
                        ) : (
                          <i className="fa-regular fa-circle-xmark text-red-500 text-lg"></i> // Red cross icon for false state
                        )}
                      </td>

                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <PencilSquareIcon
                          className="h-5 w-5 text-indigo-500 cursor-pointer hover:text-indigo-700"
                          onClick={() => {
                            editVM(item);
                          }}
                        />
                      </td>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <TrashIcon
                          className="h-5 w-5 text-red-500 cursor-pointer"
                          onClick={() => {
                            deleteVM(item.identifier);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Show "No machines available" if not loading and no machines
          <div className="h-full w-full flex justify-center items-center">
            No machines available
          </div>
        )}
      </div>
      {/* display assigned users */}
      {selectedVm && (
        <div className="m-10 p-3 pb-0 shadow-lg w-1/4 text-left h-full overflow-y-auto flex flex-col gap-2 bg-white ">
          <div className="flex justify-between mb-3 items-center ">
            <h2 className="font-semibold leading-7 text-gray-600">
              Assigned Users
            </h2>
          </div>
          {usersLoading && (
            <center>
              <img
                src={Loading}
                className="App-logo animate-spin"
                alt="loading"
              />
            </center>
          )}
          {!usersLoading && assignedUsers.length > 0
            ? assignedUsers.sort().map((item) => (
                <div className="flex w-full justify-between border-b-2">
                  <p key={item} className="m-1 cursor-default">
                    {item}
                  </p>
                  <TrashIcon
                    className="h-5 w-5  cursor-pointer text-red-500"
                    onClick={() => deleteAssignedUser(item)}
                  />
                </div>
              ))
            : !usersLoading && <p>No Users Assigned</p>}
        </div>
      )}
      <EntitleUser
        showPopup={showEntitlePopup}
        setShowPopup={setShowEntitlePopup}
        selectedVm={selectedVm}
        poolId={selectedPoolDetails.id}
        assignedUsers={assignedUsers}
        setAssignedUsers={setAssignedUsers}
        entitleUser={entitleUser}
        handleSearch={handleSearch}
        searchTerm={searchTerm}
        filteredData={filteredData}
      />
    </div>
  );
};

export default ManagePool;
