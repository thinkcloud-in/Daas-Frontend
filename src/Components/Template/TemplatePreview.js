import React from "react";
import "./TemplatePreview.css";

const TemplatePreview = (props) => {
 console.log(props)
  const today = new Date();
const formattedDateTime = today.toLocaleString();
const userProfileIcon = props.tokenParsed.name;

  return (
    <div className="report_divsion">
      <h2>PDF Template Preview</h2>
      <table className="report-table">
        <thead>
          <tr>
            <th colSpan={3} className="company_name">
              {props.templateSettings.companyName || "Company Name"}
            </th>
            <th rowSpan={2} className="image">
              <img
                className="img"
                src={props.imageBase64}
                alt="Company logo"
              />
            </th>
          </tr>
          <tr>
            <th>Date Range</th>
            <th>Username</th>
            <th>{props.templateSettings.report || "Report Type"}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="data-row">
            <td colSpan={4}>
              <i>Report data is displayed here</i>
            </td>
          </tr>
          <tr>
            <td colSpan={4}>
              <div className="info-row-container">
                <div className="generated-by">
                  Generated By: <span className="bold">{userProfileIcon}</span>
                </div>
                <div className="date">
                  Date: <span className="bold">{formattedDateTime}</span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TemplatePreview;