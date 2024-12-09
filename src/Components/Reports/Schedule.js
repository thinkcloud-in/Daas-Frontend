import "./Schedule.css";
import React, { useEffect, useState } from 'react';
import {useNavigate , Link, useLocation} from 'react-router-dom';
import TextField from '@mui/material/TextField';
import {Radio, RadioGroup, FormControlLabel, FormLabel } from '@mui/material';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { Toast } from "react-toastify/dist/components";


export default function Auto_Mail(tokenParsed) {  
    const [formData , setFormData] =useState({
        userEmail: tokenParsed.tokenParsed.email,
        reportName: '',
        schedule_date: '',
        time: '',
        receiverEmail: '',
        schedule_type: '',
        schedule_id: ''
    })

    const location = useLocation()
    const reports = location.state?.report;
    
    useEffect(()=>{
        if(reports){
            setFormData({
                id:reports.id,
                userEmail: reports.userEmail,
                reportName: reports.reportName, 
                schedule_date: reports.schedule_date,
                time: reports.time,
                receiverEmail: reports.receiverEmail,
                schedule_type: reports.schedule_type,
                schedule_id: reports.schedule_id,
            })
            
            console.log(reports)
            
        }
        
        
        
    },[reports])

    const curr_date = () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}/${month}/${year}`; 
    };

    const navigate = useNavigate();
    const handleSubmit = async(e) => {
        
        e.preventDefault();
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        try {
            if (reports) {
                const emails = formData.receiverEmail.split(",").map((email) => email.trim());
                const invalidEmails = emails.filter((email) => !emailRegex.test(email));

                if (invalidEmails.length > 0) {
                    toast.error(`Invalid email(s): ${invalidEmails.join(", ")}`);
                    return;
                }

                await axios.put(
                    `${process.env.REACT_APP_FRONTEND_URL}/update/${formData.id}`,
                    formData
                );
                toast.success("Report Updated Successfully");
            }
            else {
                const emails = formData.receiverEmail.split(",").map((email) => email.trim());
                const invalidEmails = emails.filter((email) => !emailRegex.test(email));

                if (invalidEmails.length > 0) {
                    toast.error(`Invalid email(s): ${invalidEmails.join(", ")}`);
                    return;
                }
                await axios.post(
                    `${process.env.REACT_APP_FRONTEND_URL}/add`,
                    formData
                );
                toast.success("Report Scheduled Successfully");
            }
            navigate('/reportdetails')
            console.log(formData)
        } catch (error) {
            console.error("Error updating or scheduling the report:", error);
            toast.error("An error occurred. Please try again.");
        }    
    };
    // const [scheduleOption , setScheduleOption] = useState('');
    // let deliveredDate = '';
    const [deliveredDate , setDeliveredDate] = useState('')
    const [ fromDate , setFromDate] = useState('');
    const [endDate , setEndDate] = useState('')


    const handleRadioChange = (e) => {
        document.getElementById('container-footer').style.display = 'block';

        const date = new Date();
        const curr_option = e.target.value;   
        setFormData({...formData, schedule_type: curr_option})
        
        if (!curr_option){
            toast.warning("Please select a Duration option");
            return;
        } else {
        const newDate = new Date(date);

        const pastSunday = new Date(newDate); 
        pastSunday.setDate(newDate.getDate() - newDate.getDay());

        if (curr_option === 'daily') {
            newDate.setDate(newDate.getDate() );
            setFromDate(newDate.toISOString().split('T')[0]);
            setEndDate(newDate.toISOString().split('T')[0]);
            let deliveredDate = new Date();
            deliveredDate.setDate(newDate.getDate() + 1);
            const formattedDeliveredDate = deliveredDate.toISOString().split('T')[0];
            setDeliveredDate(formattedDeliveredDate);

        } else if (curr_option === 'weekly') {
            const gap = 7 - newDate.getDay(); // Days until next Sunday
            newDate.setDate(newDate.getDate() + gap);
            setEndDate(newDate.toISOString().split('T')[0]);
            const fromDate = pastSunday.toISOString().split('T')[0];
            setFromDate(fromDate);
            let deliveredDate = new Date();
            deliveredDate.setDate(newDate.getDate() + 1);
            const formattedDeliveredDate = deliveredDate.toISOString().split('T')[0];
            setDeliveredDate(formattedDeliveredDate);
  

        } else if (curr_option === 'monthly') {
            const firstDayOfCurrentMonth = new Date(date);
            firstDayOfCurrentMonth.setDate(1); 
            
            const firstDayOfNextMonth = new Date(firstDayOfCurrentMonth);
            firstDayOfNextMonth.setMonth(firstDayOfNextMonth.getMonth() + 1); 
            firstDayOfNextMonth.setDate(1); 

            const deliveredDate = new Date(firstDayOfNextMonth);
            deliveredDate.setDate(deliveredDate.getDate() + 1);


            const fromDate = firstDayOfCurrentMonth.toISOString().split('T')[0]; 
            const endDate = firstDayOfNextMonth.toISOString().split('T')[0]; 
            const formattedDeliveredDate = deliveredDate.toISOString().split('T')[0];

            setFromDate(fromDate);
            setEndDate(endDate);
            setDeliveredDate(formattedDeliveredDate);
        }

    }

    setFormData(prevFormData => ({
        ...prevFormData,
        schedule_date: curr_date(),
        
    }));
          
    }
    return (
        <div className="form-body">
            <navbar className="navbar">
                <Link className="back-button" to='/reportdetails'><i className="bi bi-arrow-left-square"></i></Link>
                <h6>Schedule</h6>
            </navbar>
            <div className="container1">
                <form style={{marginTop:''}} onSubmit={handleSubmit}>
                    <div className="container-body">
                        <div className="reportname">
                            {/* <label htmlFor="report"></label> */}
                            <select
                                id="report"
                                value={formData.reportName}
                                onChange={(e) => setFormData({...formData, reportName: e.target.value})}    
                                required>

                                <option value='' >Select Report</option>
                                <option value="SessionReports">Session Reports</option>
                                <option value="DayReports">Day Reports</option>
                                <option value="ConsolidateReports">Consolidate Reports</option>
                            </select>
                        </div>
                        <TextField
                            label="Email Address"
                            value = {formData.receiverEmail}
                            variant="outlined"
                            type="text"
                            fullWidth
                            margin="normal"
                            required
                            onChange={(e) => setFormData({...formData, receiverEmail:e.target.value})}
                            helperText= "(Enter one or more email addresses separated by commas)"

                            
                        />
                        <TextField
                            id="time"
                            value={formData.time}
                            type="time"
                            fullWidth
                            margin="normal"
                            required
                            onChange={(e)=>setFormData({...formData, time:e.target.value })}
                        />

                        <FormLabel component="legend" className="frequency" >Choose an option </FormLabel>
                        <RadioGroup onChange={handleRadioChange} value={formData.schedule_type} required>
                            <FormControlLabel value="daily" control={<Radio />} label="Daily" />
                            <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
                            <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
                        </RadioGroup>
                    </div>
                    <div id="container-footer">
                      <h6>Scheduled on : <strong>{curr_date()}</strong> </h6>
                      <h6>Report Range : From <strong>{fromDate || 'N/A'} 00:00</strong>   To <strong>{endDate} 23:59</strong></h6>
                      <h6>Reports Will Be Generated on : <strong> {deliveredDate} </strong>  at <strong> {formData.time} </strong></h6>
                    </div>
                    <div className="submit-button">
                        <button type="submit" className="btn btn-outline-primary button-submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}