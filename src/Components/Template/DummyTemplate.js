// import React, { useState, useRef, useEffect } from "react";
// import TemplateSettings from "./TemplateSettings";
// import TemplatePreview from "./TemplatePreview";
// import { Slide, toast } from "react-toastify";
// import axios from "axios";
// import { secondsInHour } from "date-fns";

// const Template = (tokenParsed) => {
//   const [open, setOpen] = useState(false);
//   const [templateSettings, setTemplateSettings] = useState([]);
//   const [imageBase64, setImageBase64] = useState();
//   http://10.1.3.199:5000/companies?report_type=Session Reports
//   useEffect(() => {
//     const fetchData = async () => {
//       let url = `${process.env.REACT_APP_REPORT_URL}/companies`;
//       try {
//         const response = await axios.get(url);
//         setTemplateSettings(response.data);
//         console.log(response.data)
//       } catch (error) {
//         console.error("There was an error fetching the data!", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleOnChange = (e) => {
//     if (e.target.files) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const base64String = reader.result;
//         setImageBase64(base64String);
//       };
//       reader.readAsDataURL(e.target.files[0]);
//     } else {
//       const { name, value } = e.target;
//       setTemplateSettings((prevSettings) => ({
//         ...prevSettings,
//         [name]: value,
//       }));

//       if (name === "companyName") {
//         const selectedCompany = templateSettings.find(
//           (company) => company.name === value
//         );
//         if (selectedCompany) {
//           setImageBase64(selectedCompany.logo);
//           console.log(selectedCompany)
//         }
//       }
//     }
//   };

//   const handleOnClick = () => {
//     if (
     
//       templateSettings.company_name &&
//       templateSettings.company_logo &&
//       imageBase64
//     ) {
//       setOpen(true);
//     } else {
//       toast.error("Please enter all details", {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//         transition: Slide,
//       });
//     }
//   };

//   const sendData = async () => {
//     const companyExists = companyList.some(
//       (company) => company.company_name === templateSettings.companyName
//     );
  
//     if (!companyExists) {
//       try {
//         const response = await axios.post(`${process.env.REACT_APP_REPORT_URL}/companies`, {
//           company_name: templateSettings.companyName,
//           company_logo: imageBase64,
//           report_type: templateSettings.report,
//         });
//         setCompanyList((prevList) => [
//           ...prevList,
//           { company_name: templateSettings.companyName, company_logo: imageBase64, id: response.data.id }, // Assuming response.data.id is the new company ID
//         ]);
//       } catch (error) {
//         console.error("Error posting company data:", error);
//       }
//     }
  
//     setOpen(false);
//   };
  
//   return (
//     <div className="report-template w-full flex justify-evenly items-center">
//       <TemplateSettings
//         handleOnClick={handleOnClick}
//         handleOnChange={handleOnChange}
//         reports={["Session Reports", "Daily Reports"]}
//         open={open}
//         setOpen={setOpen}
//         sendData={sendData}
//         imageBase64={imageBase64}
//         setImageBase64={setImageBase64}
//         templateSettings={templateSettings}
//       />
//       <TemplatePreview
//         templateSettings={templateSettings}
//         imageBase64={imageBase64}
//         tokenParsed={tokenParsed}
//       />
//     </div>
//   );
// };

// export default Template;


// import React, { useState, useEffect } from "react";
// import TemplateSettings from "./TemplateSettings";
// import TemplatePreview from "./TemplatePreview";
// import { Slide, toast } from "react-toastify";
// import "./Template.css"
// import axios from "axios"
// // import Popup from "./Popup"; 
// import Popup from "../Popup/Popup";
// import { PhotoIcon } from "@heroicons/react/24/solid";

// const Template = ({ tokenParsed }) => {
//   const today = new Date();
//   const formattedDateTime = today.toLocaleString();
//   const userProfileIcon = tokenParsed.name;
//   const [open, setOpen] = useState(false);
//   const [templateSettings, setTemplateSettings] = useState({
//     report: "",
//     companyName: "",
//   });
//   const [companyList, setCompanyList] = useState([]);
//   const [imageBase64, setImageBase64] = useState("");
  
 
//   useEffect(() => {
//     const fetchData = async () => {
//       let reports=[]
//       let url = `${process.env.REACT_APP_REPORT_URL}/companies`;
//       try {
//         const response = await axios.get(url);
//         setCompanyList(response.data);
//       } catch (error) {
//         console.error("Error fetching company data:", error);
//       }
//     };          

//     fetchData();
//   }, []);

//   const handleOnChange = (e) => {
//     if (e.target.name === "file-upload") {
//       const file = e.target.files[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           const base64String = reader.result.split(",")[1]; // Remove the data URL prefix
//           setImageBase64(base64String);
//         };
//         reader.readAsDataURL(file);
//       }
//     } else {
//       const { name, value } = e.target;
//       setTemplateSettings((prevSettings) => ({
//         ...prevSettings,
//         [name]: value,
//       }));
  
//       if (name === "companyName") {
//         const selectedCompany = companyList.find(
//           (company) => company.company_name === value
//         );
//         if (selectedCompany) {
//           setImageBase64(selectedCompany.company_logo);
//         }
//       }
//     }
//   };
  
  
  
//   const handleOnClick = () => {
//     if (templateSettings.report && templateSettings.companyName && imageBase64) {
//       sendData(); // Call sendData to post company data
//     } else {
//       toast.error("Please enter all details", {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//         transition: Slide,
//       });
//     }
//   };
  

//   const sendData = async () => {
//     const companyExists = companyList.some(
//       (company) => company.company_name === templateSettings.companyName
//     );
  
//     if (!companyExists) {
//       let url = `${process.env.REACT_APP_REPORT_URL}/add_company`;
//       try {
//         console.log("Sending data:", {
//           company_name: templateSettings.companyName,
//           company_logo: imageBase64, // Ensure imageBase64 is properly set
//           report_type: templateSettings.report,
//         });
//         await axios.post(url, {
//           company_name: templateSettings.companyName,
//           company_logo: imageBase64, // Send base64 encoded image data
//           report_type: templateSettings.report,
//         });
//         setCompanyList((prevList) => [
//           ...prevList,
//           { company_name: templateSettings.companyName, company_logo: imageBase64 },
//         ]);
//       } catch (error) {
//         console.error("Error posting company data:", error);
//       }
//     }
  
//     setOpen(false);
//   };
  

//   return (
//     <div className="report-template w-full flex justify-evenly items-center">
//       <div className="space-y-5 m-2 flex-1 template_class">
//          <Popup
//           open={open}
//           setOpen={setOpen}
//           sendData={sendData}
//           heading="Please confirm"
//           text="Are you sure you want to submit?"
//           color="yellow"
//         /> 
//         <div className="border-2 border-gray-700/10 mx-10 p-3 shadow-md text-indigo-600">
//           <h2 className="font-bold leading-7">PDF Template</h2>
//           <div className="text-left table-auto">
//             <div className="tr">
//               <div className="th">
//                 <label htmlFor="report" className="block text-sm font-medium leading-6 text-gray-900 border-0">
//                   Report
//                 </label>
//               </div>
//               <div className="td">
//                 <div className="mt-2 border-0">
//                   <select
//                     name="report"
//                     onChange={handleOnChange}
//                     className="w-full cursor-pointer rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
//                   >
//                     <option value=""defaultValue>
//                       Select Report
//                     </option>
//                     <option value="Session Reports" >Session Reports</option>
//                     <option value="Daily Reports">Daily Reports</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//             <div className="tr">
//               <div className="th">
//                 <label htmlFor="companyName" className="block text-sm font-medium leading-6 text-gray-900 border-0">
//                   Company Name
//                 </label>
//               </div>
//               <div className="td">
//                 <div className="mt-2 border-0">
//                   <div className="flex rounded-md shadow-sm ring-1 ring-inset bg-white ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
//                     <input
//                       type="text"
//                       name="companyName"
//                       onChange={handleOnChange}
//                       list="company-names"
//                       className="block flex-1 bg-transparent py-1.5 pl-1 text-gray-900 bg-gray-50 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border-2 rounded-md"
//                     />
                 
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="tr">
//               <div className="col-span-full flex-col justify-start align-top th">
//                 <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900 border-0">
//                   Company logo
//                 </label>
//               </div>
//               <div className="td px-2">
//                 {imageBase64 ? (
//                   <>
//                     <div
//                       className="img rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mt-2 border-2 background_image"
//                     ><img
//                     className="img"
//                     src={`data:image/png;base64,${imageBase64}`}
//                     alt="Company logo"
//                   /></div>
//                     <button
//                       type="button"
//                       className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mt-2 border-2"
//                       onClick={() => setImageBase64("")}
//                     >
//                       Remove
//                     </button>
//                   </>
//                 ) : (
//                   <div className="mt-2 flex justify-center rounded-lg border-dashed border-gray-900/25 px-6 py-10 border-2 bg-white">
//                     <div className="text-center flex flex-col justify-center items-center">
//                       <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
//                       <div className="flex text-sm leading-6 text-gray-600">
//                         <label
//                           htmlFor="file-upload"
//                           className="relative cursor-pointer rounded-md font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
//                         >
//                           <span>Upload a file</span>
//                           <input
//                             id="file-upload"
//                             name="file-upload"
//                             type="file"
//                             className="sr-only"
//                             accept="image/*"
//                             onChange={handleOnChange}
//                           />
//                         </label>
//                       </div>
//                       <p className="text-xs leading-5 text-gray-600">PNG, JPG, JPEG up to 10MB</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="ml-10 pl-5 buttons">
//           <button
//             type="submit"
//             onClick={handleOnClick}
//             className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//           >
//             Submit
//           </button>
//         </div>
//       </div>
//       <div className="report_divsion">
//         <h2>PDF Template Preview</h2>
//         <table className="report-table">
//           <thead>
//             <tr>
//               <th colSpan={3} className="company_name">
//                 {templateSettings.companyName || "Company Name"}
//               </th>
//               <th rowSpan={2} className="image">
//                 <img
//                   className="img"
//                   src={`data:image/png;base64,${imageBase64}`}
//                   alt="Company logo"
//                 />
//               </th>
//             </tr>
//             <tr>
//               <th>Date Range</th>
//               <th>Username</th>
//               <th>Report Type:{templateSettings.report}</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr className="data-row">
//               <td colSpan={4}>
//                 <i>Report data is displayed here</i>
//               </td>
//             </tr>
//             <tr>
//               <td colSpan={4}>
//                 <div className="info-row-container">
//                   <div className="generated-by">
//                     Generated By: <span className="bold">{userProfileIcon}</span>
//                   </div>
//                   <div className="date">
//                     Date: <span className="bold">{formattedDateTime}</span>
//                   </div>
//                 </div>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Template;
