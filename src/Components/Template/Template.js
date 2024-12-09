import React, { useState,useContext } from "react";
import { toast } from "react-toastify";
import "./TemplatePreview.css";
import axios from "axios";
import "./Template.css"
import { PhotoIcon } from "@heroicons/react/24/solid";
import Popup from "../Popup/Popup";
import { PoolContext } from "../../Context/PoolContext";
const Template = ({ tokenParsed }) => {
  const today = new Date();
  const formattedDateTime = today.toLocaleString();
  const userProfileIcon = tokenParsed.name;

  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null); // Changed to null for better null checking
  const [reportType, setReportType] = useState("");
  const [reports, setReports] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const pc = useContext(PoolContext);
  const token=pc.token
  const handleFileOnChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1]; // Remove data URL part
        setImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleOnChange = async (event) => {
    const selectedReportType = event.target.value;
    setReportType(selectedReportType);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/guacamole/reports/${selectedReportType}`,{
        headers: {
          Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
        }
      });
      setReports(response.data);
      if (response.data.length > 0) {
        setImage(response.data[0].company_logo);
        setCompanyName(response.data[0].company_name);
      } else {
        setImage(null); // Use null to clear the image
        setCompanyName(""); // Set default or initial company name here
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to fetch reports");
    }
  };

  const handleCompanySelection = (event) => {
    const selectedCompanyName = event.target.value;
    setCompanyName(selectedCompanyName);
  };
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("company_name", companyName);
    formData.append("report_type", reportType);
  
    if (image) {
      if (typeof image === "string") {
        formData.append("company_logo", image); // For base64 string
      } else {
        formData.append("company_logo", image); // For file
      }
    }
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/guacamole/update_report`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
             Authorization: `Bearer ${token}`
          },
        }
      );
      toast.success("File uploaded successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to upload file");
    }
  };
  
  
  return (
    <div className="report-template w-full flex justify-around items-stretch items-center">
      <div className="space-y-5 m-2 flex-1 template_class">
        <Popup
          open={open}
          setOpen={setOpen}
          heading="Please confirm"
          text="Are you sure you want to submit?"
          color="yellow"
        />
        <div className="bg-white mx-10 p-3 shadow-md text-indigo-600 rounded-lg shadow-lg flex-1 pdf_template  border border-gray-200">
          <h2 className="font-bold leading-7">PDF Template</h2>
          <div className="text-left table-auto">
            <div className="tr">
              <div className="th">
                <label htmlFor="report" className="block text-sm font-medium leading-6 text-gray-900 border-0">
                  Report
                </label>
              </div>
              <div className="td">
                <div className="mt-2 border-0">
                  <select
                    name="report"
                    onChange={handleOnChange}
                    className="w-full cursor-pointer rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value="">Select Report</option>
                    <option value="Session Reports">Session Reports</option>
                    <option value="Daily Reports">Daily Reports</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="tr">
              <div className="th">
                <label htmlFor="companyName" className="block text-sm font-medium leading-6 text-gray-900 border-0">
                  Company Name
                </label>
              </div>
              <div className="td">
                <div className="mt-2 border-0">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset bg-white ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="text"
                      name="companyName"
                      list="company-names"
                      value={companyName}
                      onChange={handleCompanySelection}
                      className="block flex-1 bg-transparent py-1.5 pl-1 text-gray-900 bg-gray-50 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="tr">
              <div className="col-span-full flex-col justify-start align-top th">
                <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900 border-0">
                  Company logo
                </label>
              </div>
              <div className="td px-2">
                {image ? (
                  <>
                    <div className="img rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mt-2 border-2 background_image">
                      <img className="img" src={typeof image === "string" ? `data:image/png;base64,${image}` : URL.createObjectURL(image)} alt="Company logo" />
                    </div>
                    <button
                      type="button"
                      className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mt-2 border-2"
                      onClick={() => setImage(null)}
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <div className="mt-2 flex justify-center rounded-lg border-dashed border-gray-900/25 px-6 py-10 border-2 bg-white">
                    <div className="text-center flex flex-col justify-center items-center">
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                      <div className="flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFileOnChange}
                          />
                        </label>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">PNG, JPG, JPEG up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="ml-10 pl-5 buttons">
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        </div>
      </div>
      <div className="report_divsion report-preview bg-white p-6 rounded-lg shadow-lg  border border-gray-200 felx-1 border-2 border-black">
        <h2>PDF Template Preview</h2>
        <table className="report-table">
          <thead>
            <tr>
              <th colSpan={3} className="company_name">
                <span className="text-black">Company Name : </span>{companyName || (reports.length > 0 && reports[0].company_name)}
              </th>
              <th rowSpan={2} className="image">
                {image ? (
                  <img className="img" src={typeof image === "string" ? `data:image/png;base64,${image}` : URL.createObjectURL(image)} alt="Company logo" />
                ) : (
                  <img src={`data:image/png;base64,${reports.length > 0 ? reports[0].company_logo : ""}`} alt="Company logo" />
                )}
              </th>
            </tr>
            <tr>
              <th className="text-black">Date Range</th>
              <th className="text-black">Username</th>
              <th><span className="text-black">Report Type: </span>{reportType || (reports.length > 0 && reports[0].report_type)}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="data-row">
              <td colSpan={4}>
                <i className="text-gray-700 ">Report data is displayed here</i>
              </td>
            </tr>
            <tr>
              <td colSpan={4}>
                <div className="info-row-container">
                  <div className="generated-by">
                   <span className="text-black"> Generated By: </span><span className="bold">{userProfileIcon}</span>
                  </div>
                  <div className="date">
                    <span className="text-black">Date: </span><span className="bold">{formattedDateTime}</span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Template;
