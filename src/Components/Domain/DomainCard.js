import React, { useState, useContext } from "react";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Slide, toast } from "react-toastify";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { PoolContext } from "../../Context/PoolContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const DomainCard = (props) => {
  const navigate = useNavigate();
  //pool context
  const pc = useContext(PoolContext);
  const token=pc.token
  let [domainDetails, setDomainDetails] = useState();
  let get_domainDetails = (domain_id) => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/get_ldap_by_id/${domain_id}`,{
          headers: {
            Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
          }
        }
      )
      .then((res) => {
        setDomainDetails(res.data);
        navigate(`/domain/edit-domain/${domain_id}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };
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
          .get(
            `${process.env.REACT_APP_BACKEND_URL}/v1/sync_users/${id}`,{
              headers: {
                Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
              }
            }
          )
          .then((res) => {
            console.log(res);
            if (res.status == 200) {
              toast.success(res.data.status, {
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
              toast.error(res.data.status, {
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
      case "edit":
        get_domainDetails(id);
        break;
      case "delete":
        deleteDomain(id);
        break;
      default:
    }
  };
  return (
    <div className="rounded-md hover:shadow-md border-2 border-gray-900/10 text-left w-[250px] relative border-1 border-gray-50 bg-white">
      <Menu as="div" className="absolute top-3 right-3">
        <Menu.Button className="flex rounded-full text-sm hover:ring-2 ">
          <span className="" />
          <EllipsisVerticalIcon className="w-5 h-5" />
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
          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <div
                  onClick={() => handleOnClick("sync", props.id)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Sync all users
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div
                  onClick={() => handleOnClick("delete", props.id)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Delete
                </div>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>

      <div className="px-6 py-4 border-1 ">
        <div
          className="font-bold text-xl mb-2 cursor-pointer hover:text-blue-700 hover:underline"
          onClick={() => handleOnClick("edit", props.id)}
        >
          {props.name}
        </div>
        <p className="text-gray-700 text-base">{props.name}</p>
      </div>
      <div className="px-6 pt-4 pb-2 border-1 shadow-md">
        <span className="inline-block bg-indigo-600 rounded-full px-2 py-1 text-sm font-semibold text-white mr-2">
          {props.providerId}
        </span>
        <span className="inline-block bg-indigo-600 rounded-full px-2 py-1 text-sm font-semibold text-white mr-2">
          {props.enabled}
        </span>
      </div>
    </div>
  );
};

export default DomainCard;
