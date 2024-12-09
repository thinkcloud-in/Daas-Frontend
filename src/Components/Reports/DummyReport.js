import Datepicker from "react-tailwindcss-datepicker";
import { useRef, useState } from "react";
import "./Reports.css";
import axios from "axios";
import { Slide, toast } from "react-toastify";
import pdf from "./../../files/ReactApp.pdf";

const Reports = () => {
  let userRef = useRef();
  //State for Date Picker
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });
  const handleValueChange = (newValue) => {
    setValue(newValue);
  };
  //State for user details
  let [user, setUser] = useState("");
  let handleChange = (e) => {
    setUser(e.target.value);
  };
  // function executes when submit button is clicked
  let handleOnClick = () => {
    if (value.startDate && value.endDate && userRef.current.value) {
      console.log(userRef.current.value, value.startDate, value.endDate);
      window.open(pdf);
    } else {
      //toast message
      toast.error("Please enter all details", {
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
  //get users
  let getUsers = () => {
    axios
      .get(process.env.REACT_APP_EMPLOYEE_API_BASE_URL + "/getusers")
      .then((res) => {
        const userNames = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // Functions to get reports pdf
  const getPdf = (data) => {
    // Make a GET request to fetch the PDF data
    console.log(process.env.REACT_APP_EMPLOYEE_API_BASE_URL);
    axios({
      method: "post",
      data: data,
      url: process.env.REACT_APP_EMPLOYEE_API_BASE_URL + "/getpdf", // Replace with the actual API endpoint
      responseType: "arraybuffer", // Important to treat the response as binary data
    })
      .then((response) => {
        // Create a Blob from the binary PDF data
        const blob = new Blob([response.data], { type: "application/pdf" });

        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Open the PDF in a new tab or download it
        window.open(url);
      })
      .catch((error) => {
        console.error("Error fetching PDF:", error);
      });
  };
  return (
    <div className="space-y-5 m-2 reports w-full">
      <div className="border-2 border-gray-900/10 mx-10 p-3 shadow-md">
        <h2 className="font-bold leading-7 text-indigo-600">Reports</h2>
        <div className="text-left table-auto">
          <div className="tr">
            <div className="th">
              <label
                htmlFor="country"
                className="block text-sm font-medium leading-6 text-gray-900 border-0"
              >
                Select User
              </label>
            </div>
            <div className="reports-td">
              <div className="mt-2 border-0">
                <select
                  name="user"
                  className=" w-full cursor-pointer rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  ref={userRef}
                >
                  <option selected value="" disabled>
                    Select user
                  </option>
                  <option value="all">All users</option>
                </select>
              </div>
            </div>
          </div>
          <div className="tr">
            <div className="th">
              <label
                htmlFor="country"
                className="block text-sm font-medium leading-6 text-gray-900 border-0"
              >
                Date Range
              </label>
            </div>
            <div className="mt-2 sm:max-w-xs sm:text-sm sm:leading-6 reports-td">
              <div className="sm:max-w-xs sm:text-sm sm:leading-6 border-0 w-400">
                <Datepicker
                  toggleClassName="absolute bg-indigo-600 rounded-r-lg text-white right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                  inputClassName="border-2 rounded h-full w-full p-1.5 sm:max-w-xs sm:text-sm sm:leading-6 text-sm datepicker-input"
                  separator={"~"}
                  value={value}
                  onChange={handleValueChange}
                  showShortcuts={true}
                  primaryColor={"indigo"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Buttons */}
      <div className="ml-10 pl-5 buttons">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleOnClick}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Reports;
