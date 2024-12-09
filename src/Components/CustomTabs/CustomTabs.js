import React from "react";
import './CustomTabs.css'

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CustomTabs = (props) => {
  return (
    <div className="bg-indigo-500 w-full rounded-t-md p-2 custom-tab-menu border-2 border-indigo-500">
      <ul className="flex space-x-4 ">
        {props.tablist.map((item) => (
          <li
            key={item}
            onClick={() => props.setSelectedTab(item)}
            className={classNames(
              "px-3 py-2 text-base font-medium text-indigo-600 text-left transition ease-in-out duration-300", // Added transition classes
              props.selectedTab === item
                ? "border-gray-700 border-b-2 text-indigo-600 bg-white rounded-md"
                : "hover:bg-gray-300 hover:text-indigo-700 hover:rounded-md"
            )}
          >
            {item} Settings
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomTabs;
