import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faTimes,faTachometerAlt,faChartBar,faSwimmer,faCog } from '@fortawesome/free-solid-svg-icons';
import Beta from "../Beta/Beta";
import Vamanit from '../../images/vamanit.png'
import Thinkcloud from '../../images/t3.jpg'
import RCV from "../../images/rcvnew.png"
import Daas from "../../images/daasrcv.png"
import "./Sidebar.css"
import { ImportOutlined } from "@ant-design/icons";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    current: false,
    submenus: [
      { name: "Overview", href: "/", current: false, beta: false },
      { name: "Hosts", href: "/hosts", current: false, beta: false },
      { name: "Data Stores", href: "/data-stores", current: false, beta: false },
      { name: "VMS", href: "/vms", current: false, beta: false },
    ],
  },
  { name: "Reports", href: "/template", current: false, beta: true,
  submenus: [
    { name: "Template", href: "/template", current: false, beta: false },
    { name: "Generate Report", href: "/reports", current: false, beta: false },
  ]
 },{
  name: "Schedule", href: "/reportdetails", current: false
 },
  { name: "Pools", href: "/pools", current: false, beta: false },
  {
    name: "Settings",
    href: "/",
    current: false,
    submenus: [
      { name: "TOTP", href: "/totp", current: false, beta: true },
      { name: "Domain", href: "/domain", current: false, beta: false },
      { name: "Cluster", href: "/clusters", current: false, beta: false },
      // { name: "Vsphere Monitoring", href: "/vsphere-monitoring", current: false, beta: false },
      { name: "SSL", href: "/ssl", current: false, beta: true },
      { name: "SMPT", href: "/smtp", current: false },

    ],
  },
];
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isToggled, setIsToggled] = useState(true);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  useEffect(() => {
    const currentPath = location.pathname;
    navigation.forEach((item) => {
      if (item.href === currentPath) {
        item.current = true;
        setOpenSubMenu(item.name);
      } else {
        item.current = false;
      }
      if (item.submenus) {
        item.submenus.forEach((subitem) => {
          if (subitem.href === currentPath) {
            subitem.current = true;
            setOpenSubMenu(item.name);
          } else {
            subitem.current = false;
          }
        });
      }
    });
  }, [location.pathname]);

  const handleSubMenuClick = (name) => {
    setOpenSubMenu(openSubMenu === name ? null : name);
  };

  const handleMenuItemClick = (item) => {
    if (item.submenus) {
      // Toggle submenu open/close
      handleSubMenuClick(item.name);
    } else {
      // If it's not a submenu, navigate to the clicked page
      navigate(item.href);
      // Update the current property for top-level menu items
      navigation.forEach((menuItem) => {
        menuItem.current = menuItem === item;
        if (menuItem.submenus) {
          // Update the current property for submenu items
          menuItem.submenus.forEach((submenuItem) => {
            submenuItem.current = submenuItem === item;
          });
        }
      });
    }
  };
  const toggleSlide = () => {
    setIsToggled(!isToggled);
  };

  return (
    
    <div className="side_bar">
  <div onClick={toggleSlide} className="bg-indigo-600 p-2 cursor-pointer text-white flex justify-end">
      {isToggled ? (
        <FontAwesomeIcon icon={faTimes} />
      ) : (
        <div
          style={{
            width: '55px',
            height: '40px',
            backgroundImage: `url(${Thinkcloud})`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            borderRadius:"5px"
          }}
          alt="Thinkcloud Logo"
        />
      )}
    </div>
   {isToggled ?(<div className="h-screen bg-indigo-600 text-white w-64 space-y-6 shrink-0 py-7 px-2 z-30 inset-y-0 left-0 transform -translate-x-full md:translate-x-0 transition-transform duration-200 ease-in ">
      
      
      <div className="flex flex-shrink-0 items-center justify-center w-full">
        <img
          className="w-auto m-1 image_container" 
          src={Thinkcloud}
          alt="Thinkcloud logo"
        />
      </div>
      <nav className="flex flex-col gap-1 items-start mx-3 text-base">
        {navigation.map((item) => (
          <React.Fragment key={item.name}>
            <div
            key={item}
              onClick={() => handleMenuItemClick(item)}
              className={classNames(
                item.current
                  ? "bg-indigo-600"
                  : " hover:bg-indigo-700 hover:text-slate-300 text-white",
                "rounded-md px-3 py-2 text-base font-medium text-white w-full text-left cursor-pointer relative flex items-center"
              )}
              aria-current={item.current ? "page" : undefined}
            >
              {item.name}
              {item.submenus && (
                <span className="absolute right-3">
                  {openSubMenu === item.name ? (
                    <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                  )}
                </span>
              )}
              {/* {item.beta && <Beta />} */}
            </div>
            {item.submenus && (
              <div
                className={`pl-6 transition-all duration-300 ease-in-out overflow-hidden ${
                  openSubMenu === item.name ? "max-h-96" : "max-h-0"
                }`}
              >
                {item.submenus.map((subitem) => (
                  <li
                    key={subitem.name}
                    onClick={() => handleMenuItemClick(subitem)}
                    className={classNames(
                      subitem.current
                        ? "bg-indigo-600"
                        : " hover:bg-indigo-700 hover:text-slate-300",
                      "rounded-md px-3 py-2 text-base font-medium text-white w-full text-left cursor-pointer"
                    )}
                  >
                    <span className="inline-flex">
                    {subitem.name}
                    {subitem.beta && <Beta />}
                    </span>
                  </li>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}
      </nav>

    </div>):( 
      <div className="bg-indigo-600 p-4 text-white flex h-full">
      <div className="flex flex-col justify-around items-center h-64">
        {navigation.map((item) => (
          <a href={item.href}>
          <FontAwesomeIcon key={item.name} icon={getIcon(item.name)} title={item.name}  className="icons"/>
          </a>
        ))}
       
      </div>
    </div>)}
    </div>
    

  );
};
const getIcon = (name) => {
  switch (name) {
    case 'Dashboard':
      return faTachometerAlt;
    case 'Reports':
      return faChartBar;
    case 'Pools':
      return faSwimmer;
    case 'Settings':
      return faCog;
    default:
      return null;
  }
};
export default Sidebar;

