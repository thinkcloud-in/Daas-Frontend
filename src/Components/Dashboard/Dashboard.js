import "./css/Dashboard.css";
import { useEffect, useContext, useState } from "react";
import TimeRangeSelector from "./TimeRangeSelector";
import AutoRefresh from "./AutoRefresh";
import { GrafanaToolbarContext } from "../../Context/GrafanaToolbarContext";
import Dropdown from "../Dropdown/Dropdown";

// import { useKeycloak } from '@react-keycloak/web';
let Dashboard = () => {
  let gc = useContext(GrafanaToolbarContext);

  return (
    <div className="w-full">
      <div className="nav-toolbar h-auto flex flex-wrap">
        <TimeRangeSelector />
        <AutoRefresh />
      </div>
      {/* <iframe
        src={`${process.env.REACT_APP_GRAFANA_BASE_URL}/d/${process.env.REACT_APP_GRAFANA_DASHBOARD_ID}/${process.env.REACT_APP_GRAFANA_DASHBOARD_NAME}?orgId=1&refresh=5s&from=${gc.timeStamp.startDate}&to=${gc.timeStamp.endDate}&theme=light&disableLazyLoad=true&kiosk`}
      ></iframe> */}

      <iframe
        title="dash"
        src={`${process.env.REACT_APP_GRAFANA_URL}/d/${process.env.REACT_APP_GRAFANA_DASHBOARD_ID}/${process.env.REACT_APP_GRAFANA_DASHBOARD_NAME}?orgId=1&from=${gc.timeStamp.startDate}&to=${gc.timeStamp.endDate}&theme=light&disableLazyLoad=true&kiosk`}
      ></iframe>
    </div>
  );
};
export default Dashboard;
