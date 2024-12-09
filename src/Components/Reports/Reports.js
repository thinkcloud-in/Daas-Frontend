import React, { useState, useEffect, useRef,useContext } from "react";
import "./Reports.css";
import axios from "axios";
import dayjs from "dayjs";
import Datepicker from "react-tailwindcss-datepicker";
import { useReactToPrint } from "react-to-print";
import { RotatingLines, ColorRing } from "react-loader-spinner";
import { DatePicker, Space } from "antd";
import { set } from "date-fns";
import { PoolContext } from "../../Context/PoolContext";
import VamanitReports from "./VamanitReports";
import { useNavigate } from "react-router-dom";
const { RangePicker } = DatePicker;


// Utility function to format durations
const formatDuration = (seconds) => {
  if (seconds < 60) {
    return `${Math.floor(seconds)} seconds`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return ` ${minutes} minutes ${Math.floor(seconds % 60)} seconds`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hours ${minutes} minutes ${Math.floor(
      seconds % 60
    )} seconds`;
  } else if (seconds >= 86400) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days} days ${hours} hours ${Math.floor(
      (seconds % 3600) / 60
    )} minutes ${Math.floor(seconds % 60)} seconds`;
  } else {
    return "NA";
  }
};

const formatDateTime = (dateTimeString) => {
  if (dateTimeString === "Not Applicable") {
    return "Not Applicable";
  } else {
    const date = new Date(dateTimeString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
};
const formatHoursDuration = (totalDurationInSeconds) => {
  if (!totalDurationInSeconds || totalDurationInSeconds === "Not Applicable") {
    return "Not Applicable";
  }

  const hours = Math.floor(totalDurationInSeconds / 3600);
  const minutes = Math.floor((totalDurationInSeconds % 3600) / 60);
  const seconds = Math.round(totalDurationInSeconds % 60); // Round seconds

  return `${hours} hours ${minutes} minutes ${seconds} seconds`;
};


const Reports = (tokenParsed) => {
  const [userOptions, setUserOptions] = useState([]);
  const [user, setUser] = useState("All Users");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });
  const [sessionReports, setSessionReports] = useState([]);
  const [dayReports, setDayReports] = useState([]);
  const [consolidateReports,setConsolidateReports]=useState([]);
  const [showSessionReports, setShowSessionReports] = useState(false);
  const [showDayReports, setShowDayReports] = useState(false);
  const[showConsolidateReports,setShowConsolidateReports]=useState(false)
  const [loader, setLoader] = useState(false);
  const [company, setCompany] = useState({
    company_name: "",
    company_logo: "",
  });
   const [showHorizonReports,setShowHorizanReports]=useState(true)
   const [showVamanitReports,setShowVamanitReports]=useState(false)
   
  const componentRef = useRef();
  const pc = useContext(PoolContext);
 
  const token=pc.token
  let Userprofileicon = tokenParsed.tokenParsed.name;
  const today = new Date();
  const formattedDateTime = today.toLocaleString();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


  useEffect(() => {
    const { start, end } = dateRange;
    if (!start || !end) {
      return; // Don't fetch if start or end date is missing
    }

    setLoader(true); // Show loader before fetching users
    axios
      .get(`${process.env.REACT_APP_HORIZON_REPORT_URL}/allusers/${start}/${end}`,{
        headers: {
          Authorization: `Bearer ${token}` 
        }
      })
      .then((response) => {
        const sortedUsers = response.data.sort((a, b) => a.localeCompare(b));
        setUserOptions(sortedUsers); // Assuming response.data is an array of strings
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      })
      .finally(() => {
        setLoader(false); // Hide loader after fetching users
      });
  }, [dateRange]);

  const fetchCompanyDetails = (reportType) => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/v1/guacamole/reports/${reportType}`,{
        headers: {
          Authorization: `Bearer ${token}` 
        }
      })
      .then((response) => {
        const companyData = response.data.find(
          (company) => company.report_type === reportType
        );
        if (companyData) {
          setCompany({
            company_name: companyData.company_name,
            company_logo: companyData.company_logo,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching company details:", error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ user, dateRange });
  };

  const handleValueChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange({
        start: dates[0].format("YYYY-MM-DD HH:mm:ss.SSSSSS"),
        end: dates[1].format("YYYY-MM-DD HH:mm:ss.SSSSSS"),
      });
    } else {
      // If dates are not selected or cleared, reset all reports and user options
      setDateRange({ start: "", end: "" });
      setSessionReports([]);
      setDayReports([]);
      setUserOptions([]);
      setShowSessionReports(false);
      setShowDayReports(false);
      setShowConsolidateReports(false);
    }
  };
  const fetchSessionReports = () => {
    const { start, end } = dateRange;
    if (!start || !end) {
      console.error("Start date or end date is missing!");
      return;
    }

    setLoader(true); // Show loader before fetching session reports
    fetchCompanyDetails("Session Reports");

    let url = `${process.env.REACT_APP_HORIZON_REPORT_URL}/user-session-durations/${start}/${end}`;
    if (user !== "All Users") {
      url += `/${user}`;
    }

    axios
      .get(url,{
        headers: {
          Authorization: `Bearer ${token}` 
        }
      })
      .then((response) => {
        setSessionReports(response.data);

        setShowSessionReports(true); // Show session reports
        setShowDayReports(false); // Hide day reports
      })
      .catch((error) => {
        console.error("Error fetching session reports:", error);
      })
      .finally(() => {
        setLoader(false); // Hide loader after fetching session reports
      });
  };

  const fetchDayReports = () => {
    const { start, end } = dateRange;
    if (!start || !end) {
      console.error("Start date or end date is missing!");
      return;
    }

    setLoader(true); // Show loader before fetching day reports
    fetchCompanyDetails("Daily Reports");

    let url = `${process.env.REACT_APP_HORIZON_REPORT_URL}/daily-report/${start}/${end}`;
    if (user !== "All Users") {
      url += `/${user}`;
    }

    axios
      .get(url,{
        headers: {
          Authorization: `Bearer ${token}` 
        }
      })
      .then((response) => {
        setDayReports(response.data);
        setShowSessionReports(false); // Hide session reports
        setShowDayReports(true); // Show day reports
      })
      .catch((error) => {
        console.error("Error fetching day reports:", error);
      })
      .finally(() => {
        setLoader(false); // Hide loader after fetching day reports
      });
  };



  const fetchConsolidateReports = () => {
    const { start, end } = dateRange;
    if (!start || !end) {
      console.error("Start date or end date is missing!");
      return;
    }

    setLoader(true); // Show loader before fetching day reports
    fetchCompanyDetails("Daily Reports");

    let url = `${process.env.REACT_APP_HORIZON_REPORT_URL}/total_durations_within_range/${start}/${end}`;
    if (user !== "All Users") {
      url += `/${user}`;
    }

    axios
      .get(url,{
        headers: {
          Authorization: `Bearer ${token}` 
        }
      })
      .then((response) => {
        setConsolidateReports(response.data);
        setShowSessionReports(false); // Hide session reports
        setShowDayReports(false); // hide day reports
        setShowConsolidateReports(true); // Show console reports
      })
      .catch((error) => {
        console.error("Error fetching day reports:", error);
      })
      .finally(() => {
        setLoader(false); // Hide loader after fetching day reports
      });
  };


  // useEffect(() => {
  //   let url = `${process.env.REACT_APP_VAMANIT_DAAS_URL}/vamanit_session_reports/2024-07-19/2024-07-24`;

  //   axios.get(url).then((response) => {
  //     console.log("Got response:", response.data);
  //   });
  // }, []);
const fetchHorizonReports=()=>{
  setShowHorizanReports(true)
  setShowVamanitReports(false)
}
const fetchVamanitReports=()=>{
  setShowVamanitReports(true)
  setShowHorizanReports(false)

}
const navigate = useNavigate();
const handleSchedule = (e)=>{
  e.preventDefault();
  navigate("/reportdetails")
}
  return (
    <div>
      <div className="Report_page">
      
        <div className="Reports_name">
          <h1>Reports</h1>
          <div className="reports_title">
          <button className="report_type" type="button" onClick={fetchHorizonReports}>
            Horizon Reports
          </button>
          <button className="report_type" type="button" onClick={fetchVamanitReports}>
            Vamanit Daas Reports
          </button>
          <button className="report_type" type="button" onClick={handleSchedule}>
            Schedule
          </button>
          
        </div>
        </div>
      
       {showHorizonReports && <form className="report-form" onSubmit={handleSubmit}>
          <div className="form_main_container">
            <div className="form_sub_container">
              <div className="form-group">
                <label>Date Range : </label>
                {/* <div className="sm:max-w-xs sm:text-sm sm:leading-6 border-0 w-full datepicker">
                  <Datepicker
                    toggleClassName="absolute bg-indigo-600 rounded-r-lg text-white right-0 h-full px-4 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                    inputClassName="border-2 rounded h-full w-full p-3 sm:max-w-xs sm:text-sm sm:leading-6 text-sm datepicker-input"
                    separator={"/"}
                    value={value}
                    onChange={handleValueChange}
                    showShortcuts={true}
                    primaryColor={"indigo"}
                  />
                </div> */}
                <RangePicker
                  onChange={handleValueChange}
                  showTime={{
                    hideDisabledOptions: true,
                    defaultValue: [
                      dayjs("00:00:00", "HH:mm:ss"),
                      dayjs("23:59:59", "HH:mm:ss"),
                    ],
                  }}
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </div>
              <div className="form-group">
                <label htmlFor="user">Select User : </label>
                <select
                  id="user"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                >
                  <option value="All Users">All Users</option>
                  {userOptions.map((userName, index) => (
                    <option key={index} value={userName}>
                      {userName}
                    </option>
                  ))}
                </select>
                {loader && (
                  <ColorRing
                    visible={true}
                    height="50"
                    width="50"
                    ariaLabel="color-ring-loading"
                    wrapperStyle={{}}
                    wrapperClass="color-ring-wrapper"
                    colors={[
                      "#3725dddc",
                      "#3725dddc",
                      "#3725dddc",
                      "#3725dddc",
                      "#3725dddc",
                    ]}
                  />
                )}
              </div>
            </div>
            <div className="button_group">
              <div className="report_name">Horizon Reports : </div>
              <button
                className="button wide-button"
                type="button"
                onClick={fetchSessionReports}
              >
                Session Reports
              </button>
              <button
                className="button wide-button"
                type="button"
                onClick={fetchDayReports}
              >
                Day Reports
              </button>
              <button
                className="button wide-button"
                type="button"
                onClick={fetchConsolidateReports}
              >
                Consolidate Reports
              </button>
              <button
                type="button"
                className="button wide-button"
                onClick={handlePrint}
              >
                Print
              </button>
            </div>
          </div>
          <div ref={componentRef}>
            {/* Display Session Reports */}

            {showSessionReports && sessionReports.length > 0 && (
              <div className="Report_container fixed-header">
                <table>
                  <thead className="report_thead">
                    <tr>
                      <th colSpan={3} className="company_name">
                      <h3 style={{color:"black"}}>Company Name : <span  style={{color:"gray"}} > {company.company_name}</span> </h3>
                      </th>
                      <th rowSpan={2} className="company_logo">
                        <img
                          src={`data:image/png;base64,${company.company_logo}`}
                          alt="Company Logo"
                          className="company-logo"
                        />
                      </th>
                    </tr>
                    <tr>
                      <th>
                        Date Range:{" "}
                        <span>
                          {new Date(dateRange.start).toLocaleString()} -{" "}
                          {new Date(dateRange.end).toLocaleString()}
                        </span>
                      </th>

                      <th>
                        User Name :<span>{user}</span>
                      </th>
                      <th>
                        Report Type : <span>Session Reports</span>
                      </th>
                    </tr>
                  </thead>
                </table>
                <table>
                  <thead className="report_reports">
                    <tr>
                      <th>Username</th>
                      <th>Login Time</th>
                      <th>Logout Time</th>
                      <th>Machine Name</th>
                      <th>Session Duration</th>
                      {/* Add more headers as needed */}
                    </tr>
                  </thead>
                  <tbody className="report_tbody">
                    {sessionReports.map((report, index) => (
                      <tr key={index}>
                        <td>{report.username}</td>
                        <td>{formatDateTime(report.login_time)}</td>
                        <td>{formatDateTime(report.logout_time)}</td>
                        <td>{report.machine_name}</td>
                        <td>{formatDuration(report.session_duration)}</td>
                        {/* Add more cells as needed */}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <table>
                  <tr>
                    <td>
                      <div className="info-row-container">
                        <div className="generated-by">
                          Generated By:{" "}
                          <span className="bold">{Userprofileicon}</span>
                        </div>
                        <div className="date">
                          Date:{" "}
                          <span className="bold">{formattedDateTime}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            )}

            {/* Display Day Reports */}
            {showDayReports && dayReports.length > 0 && (
              <div className="Report_container">
                <table>
                  <thead className="report_thead">
                    <tr>
                      <th colSpan={3} className="company_name">
                      <h3 style={{color:"black"}}>Company Name : <span  style={{color:"gray"}} > {company.company_name}</span> </h3>
                      </th>
                      <th rowSpan={2} className="company_logo">
                        <img
                          src={`data:image/png;base64,${company.company_logo}`}
                          alt="Company Logo"
                          className="company-logo"
                        />
                      </th>
                    </tr>
                    <tr>
                      <th>
                        Date Range:{" "}
                        <span>
                          {new Date(dateRange.start).toLocaleString()} -{" "}
                          {new Date(dateRange.end).toLocaleString()}
                        </span>
                      </th>

                      <th>
                        User Name :<span>{user}</span>
                      </th>
                      <th>
                        Report Type : <span>Daily Reports</span>
                      </th>
                    </tr>
                  </thead>
                </table>
                <table>
                  <thead className="report_reports">
                    <tr>
                      <th>Username</th>
                      <th>Machine Name</th>
                      <th>Date</th>
                      <th>Day Session Count</th>
                      <th>Daily Duration</th>
                    </tr>
                  </thead>
                  <tbody className="report_tbody">
                    {dayReports.map((report, index) => (
                      <tr key={index}>
                        <td>{report.username}</td>
                        <td>{report.machine_name}</td>
                        <td>{report.date}</td>
                        <td>{report.day_session_count}</td>
                        <td>{formatDuration(report.daily_duration)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <table>
                  <tr>
                    <td>
                      <div className="info-row-container">
                        <div className="generated-by">
                          Generated By:{" "}
                          <span className="bold">{Userprofileicon}</span>
                        </div>
                        <div className="date">
                          Date:{" "}
                          <span className="bold">{formattedDateTime}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            )}
             {/* Display Console Reports */}
             {showConsolidateReports && consolidateReports.length > 0 && (
              <div className="Report_container">
                <table>
                  <thead className="report_thead">
                    <tr>
                      <th colSpan={3} className="company_name">
                      <h3 style={{color:"black"}}>Company Name : <span  style={{color:"gray"}} > {company.company_name}</span> </h3>
                      </th>
                      <th rowSpan={2} className="company_logo">
                        <img
                          src={`data:image/png;base64,${company.company_logo}`}
                          alt="Company Logo"
                          className="company-logo"
                        />
                      </th>
                    </tr>
                    <tr>
                      <th>
                        Date Range:{" "}
                        <span>
                          {new Date(dateRange.start).toLocaleString()} -{" "}
                          {new Date(dateRange.end).toLocaleString()}
                        </span>
                      </th>

                      <th>
                        User Name :<span>{user}</span>
                      </th>
                      <th>
                        Report Type : <span>Consolidate Reports</span>
                      </th>
                    </tr>
                  </thead>
                </table>
                <table>
                  <thead className="report_reports">
                    <tr>
                      <th>Username</th>
                      <th>Machine Name</th>   
                      <th>Session Count</th>
                      <th>Total Duration</th>
                    </tr>
                  </thead>
                  <tbody className="report_tbody">
                    {consolidateReports.map((report, index) => (
                      <tr key={index}>
                        <td>{report.username}</td>
                        <td>{report.machine_name}</td>
                       
                        <td>{report.day_session_count}</td>
                        <td>{formatHoursDuration(report.total_duration)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <table>
                  <tr>
                    <td>
                      <div className="info-row-container">
                        <div className="generated-by">
                          Generated By:{" "}
                          <span className="bold">{Userprofileicon}</span>
                        </div>
                        <div className="date">
                          Date:{" "}
                          <span className="bold">{formattedDateTime}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            )}
          </div>
        
        </form>}
        {showVamanitReports&&<VamanitReports Userprofileicon={Userprofileicon}/>}
      </div>
    </div>
  );
};

export default Reports;
