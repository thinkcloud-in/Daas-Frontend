import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
//faCircleCheck, faCircleXmark, faCircleExclamation, faCircleQuestion
import './ScheduleDetails.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const reportsPerPage = 9;
  const [expandedReport, setExpandedReport] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_FRONTEND_URL}/get`);
        setReports(response.data);
      } catch (error) {
        console.error("Error: ", error);
        toast.error("Data Not Found");
      }
    };
    fetchReports();
  }, []);

  const icon = (id)=>{
    return expandedReport === id ? "bi bi-chevron-up" : "bi bi-chevron-down";
  }

  const handleAddReport = (e) => {
    e.preventDefault();
    navigate('/autoschedule');
  };

  const handleEdit = (report) => {
    navigate('/autoschedule', { state: { report } });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/delete/${id}`);
        toast.success("Data Deleted Successfully");
        setReports((prevReports) => prevReports.filter(report => report.id !== id));
      } catch (error) {
        console.error("Error: ", error);
        toast.error("Failed to delete report");
      }
    }
  };

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(reports.length / reportsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    if(currentPage === 1){
      toast.success("This Is First Page")
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
    else {
      toast.success("This Is Last Page")
    }
  };

  // const handleReportStatus = (report) => {
  //   switch (report.status) {
  //     case 'success':
  //       return <FontAwesomeIcon icon={faCircleCheck} style={{ color: 'green', fontSize: '1.7rem' }} />;
  //     case 'failure':
  //       return <FontAwesomeIcon icon={faCircleXmark} style={{ color: 'red', fontSize: '1.7rem' }} />;
  //     case 'pending':
  //       return <FontAwesomeIcon icon={faCircleExclamation} style={{ color: 'orange', fontSize: '1.7rem' }} />;
  //     default:
  //       return <FontAwesomeIcon icon={faCircleQuestion} style={{ color: 'grey', fontSize: '1.7rem' }} />;
  //   }
  // };

  return (
    <div className='schedule-detail-body'>
      <div className="container">
        <h1>Reports</h1>
        <table>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>User</th>
              <th>Report Name</th>
              <th>Schedule Time</th>
              <th>Schedule Type</th>
              <th>Receiver</th>
              <th>Status</th>
              <th>Actions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentReports.map((report,index) => (
              <React.Fragment key={report.id}>
                <tr onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}>
                  <td>{(currentPage - 1) * reportsPerPage + (index + 1)}</td>
                  <td><div className='receiver-logo'>{report.userEmail[0]}</div></td>
                  <td>{report.reportName}</td>
                  <td>{report.time}</td>
                  <td style={{textTransform:'capitalize'}}>{report.schedule_type}</td>
                  <td><div className='receiver-logo'>{report.receiverEmail[0]}</div></td>
                  <td></td>

                  <td className="actions">
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      style={{ cursor: 'pointer',color: 'rgba(0, 0, 255, 0.7)', fontSize: '18px' ,marginRight:'25px'}}
                      onClick={(e) => { e.stopPropagation(); handleEdit(report); }}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ cursor: 'pointer', color: 'rgba(255, 0, 2, 0.8)', fontSize: '18px' }}
                      onClick={(e) => { e.stopPropagation(); handleDelete(report.id); }}
                    />
                  </td>
                  <td><i className={icon(report.id)}></i></td>
                </tr>
                {expandedReport === report.id && (
                  <tr className="additional-data-row">
                    <td colSpan={9}>
                      <div className="additional-data">
                        <span><span className="add-data-heading">User Email:</span> <span className='add-data'>{report.userEmail}</span></span>
                        <span><span className="add-data-heading">Created On:</span> <span className='add-data'>{report.schedule_date}</span></span>
                        <span><span className="add-data-heading">Receiver Email:</span> <span className='add-data'>{report.receiverEmail}</span></span>
                        <span><span className="add-data-heading">Delivered On:</span> <span className='add-data'>{report.time_duration}</span></span>

                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <div className='footer'>
          <div className="pagination">
            <button className='previous-button' onClick={handlePrev} disabled={currentPage === 1}>
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? 'active' : ''}
              >
                {i + 1}
              </button>
            ))}
            
            <button className='next-button' onClick={handleNext} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
          <div className='add-button'>
            <button className='btn btn-primary' style={{fontSize:'18px',fontWeight:'600',background:'rgba(55, 37, 221, 0.86)'}} onClick={handleAddReport}><i style={{fontSize:'1.2rem',marginRight:'10px'}} className="bi bi-calendar2-plus-fill"></i> Schedule Report</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
