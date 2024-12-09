import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import "./Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  UserIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@mui/material";
// import { useKeycloak } from '@react-keycloak/web';
import keycloakConfig from "../Login/keycloak/keycloak";
//navigation bar
const navigation = [
  { name: "Dashboard", href: "/", current: false, beta: false },
  { name: "Reports", href: "/reports", current: false, beta: false },
  { name: "Template", href: "/template", current: false, beta: false },
  { name: "Pools", href: "/pools", current: false, beta: false },
  { name: "Clusters", href: "/clusters", current: false, beta: false },
];
//config submenu
const config = [
  { name: "AD ", href: "/ad", current: false, beta: false },
  { name: "VCenter", href: "/vcenter", current: false, beta: false },
];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar(tokenParsed) {
  const navigate = useNavigate();
  const location = useLocation();
  //Update 'current' value based on the opened page
  const updateCurrentPage = () => {
    const currentPath = location.pathname;
    navigation.forEach((item) => {
      if (item.href === currentPath) {
        item.current = true;
      } else {
        item.current = false;
      }
    });
    config.forEach((item) => {
      if (item.href === currentPath) {
        item.current = true;
      } else {
        item.current = false;
      }
    });
  };

  let Userprofileicon = tokenParsed.tokenParsed.name;
  let nameoftheuser=tokenParsed.tokenParsed.preferred_username
  const profileicon = Userprofileicon.split(' ').map(word => word.charAt(0)).join('');
  updateCurrentPage();
  //keyclaok
  // const { keycloak } = useKeycloak();
  return (
    <Disclosure as="nav" className="sticky z-100">
      {({ open }) => (
        <div className="z-100">
          <div className="mx-auto w-full sm:px-6 lg:px-8 z-100">
            <div className="relative flex h-16 items-center justify-end sm:mx-4 inner-nav z-100">
              {/* Mobile menu button*/}
              {/* <div className="absolute inset-y-0 left-0 flex items-center sm:hidden z-30">
                <Disclosure.Button className="relative ml-3 file:inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6 " aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6 " aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div> */}
              {/* <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="p-2 border rounded-lg"
                  />
                </div>
              </div> */}
              <div className="absolute inset-y-0 right-0 flex gap-2 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-indigo-400 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div> */}
                {/* Config */}
                {/* <Menu as="div" className="relative mx-3">
                  <div>
                    <Menu.Button className="relative flex  text-sm focus:outline-none  focus:ring-offset-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open config menu</span>
                      <div className="rounded-md px-3 py-2 text-sm font-medium ">
                        Config
                      </div>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-30 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
                      {config.map((item) => {
                        return (
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href={item.href}
                                className={classNames(
                                  item.current ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        );
                      })}
                    </Menu.Items>
                  </Transition>
                </Menu> */}
                <button
                  type="button"
                  className="relative rounded-full p-1 text-gray-500 hover:text-gray-700"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                {/* Profile dropdown */}
                <Menu as="div" className="relative mx-1 z-100">
                  <div>
                    <Menu.Button className="relative flex rounded-full text-sm text-gray-500 hover:text-gray-700 z-100">
                      <span className="absolute -inset-1.5" />
                      {/* <UserCircleIcon className="h-8 w-8" aria-hidden="true" /> */}

                      <div className="rounded-full z-50 text-lg bg-indigo-700 text-white uppercase w-9 h-9 flex items-center justify-center border-1 border-gray-300 border-solid profileicon ">
                        {profileicon}
                      </div>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-50 mt-1 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
                      {/* <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item> */}
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 z-50 text-sm text-gray-700 bg-indigo-700 text-white"
                              
                            )}
                            style={{ borderRadius: '5px' }}
                          >
                            {nameoftheuser}
                          </div>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                            onClick={() => {
                              keycloakConfig.logout();
                              localStorage.clear();
                            }}
                          >
                            Sign out
                          </a>
                         
                        )}
                      </Menu.Item>
                      
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      )}
    </Disclosure>
  );
}
