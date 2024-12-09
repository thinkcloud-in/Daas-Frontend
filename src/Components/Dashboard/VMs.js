import './css/Dashboard.css'
import { useEffect, useContext, useState } from "react";
import TimeRangeSelector from "./TimeRangeSelector";
import AutoRefresh from "./AutoRefresh";
import { GrafanaToolbarContext } from '../../Context/GrafanaToolbarContext';
import Dropdown from "../Dropdown/Dropdown";
// import { useKeycloak } from '@react-keycloak/web';
let VMs = () => {
  let gc = useContext(GrafanaToolbarContext);
console.log(`${process.env.REACT_APP_GRAFANA_URL}/d/vsphereVMs/vmware-vsphere-vms?orgId=1&from=${gc.timeStamp.startDate}&to=${gc.timeStamp.endDate}&theme=light&disableLazyLoad=true&kiosk`)
 
  return (
    <div className='w-full'>
      <div className="nav-toolbar h-auto flex flex-wrap">
        <TimeRangeSelector />
        <AutoRefresh />
        {/* <Dropdown name="Sampling"/>
        <Dropdown name="VCenter Server"/>
        <Dropdown name="Cluster"/>
        <Dropdown name="ESXi Server"/>
        <Dropdown name="Data Store"/>
        <Dropdown name="VM"/> */}
      </div>
      {/* <iframe
        src={`${process.env.REACT_APP_GRAFANA_BASE_URL}/d/${process.env.REACT_APP_GRAFANA_DASHBOARD_ID}/${process.env.REACT_APP_GRAFANA_DASHBOARD_NAME}?orgId=1&refresh=5s&from=${gc.timeStamp.startDate}&to=${gc.timeStamp.endDate}&theme=light&disableLazyLoad=true&kiosk`}
      ></iframe> */}
     
       <iframe
        src={`${process.env.REACT_APP_GRAFANA_URL}/d/vsphereVMs/vmware-vsphere-vms?orgId=1&from=${gc.timeStamp.startDate}&to=${gc.timeStamp.endDate}&theme=light&disableLazyLoad=true&kiosk`}
      ></iframe>
    </div>
  );
};
export default VMs;
