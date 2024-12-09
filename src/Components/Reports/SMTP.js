import "./SMTP.css";
import React, { useState, useEffect } from 'react';
import {useNavigate , Link} from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { Checkbox, FormControlLabel, FormGroup, Button , RadioGroup, Radio} from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Switch } from '@mui/material';
import axios from "axios";
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
// import { LoginSharp } from "@mui/icons-material";
// import { faSleigh } from "@fortawesome/free-solid-svg-icons";

export default function SMTP() {
    const [recEmail, setReceiverEmail] = useState("");
    const [edit, checkEdit] = useState(false);
    const [popup, setPopup] = useState(false)

    const [data, setData] = useState({
        smtpStatus: true,
        serverIP : '',
        serverPort:'',
        userName:'',
        password:'',
        email:'',
        connOption:'',
        userAuthentication: 'false',
        receiverMail: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_FRONTEND_URL}/smtp-get`);
                console.log(res.data);
                if (res.data) {
                    setData({
                        smtpStatus:res.data[0].smtpStatus,
                        serverIP: res.data[0].serverIP,
                        serverPort: res.data[0].serverPort,
                        email: res.data[0].email,
                        connOption: res.data[0].connOption,
                        userName: res.data[0].userName || '',
                        password: res.data[0].password || '',
                        userAuthentication: String(!!res.data[0].userAuthentication),
                        receiverMail: res.data[0].receiverMail || '',
                    });
                    checkEdit(true);
                }
            } catch (error) {
                console.error("Failed to get SMTP configuration:", error);
                toast.info("There Is No SMTP configuration");
            }
        };

        fetchData();
    }, []);
    const handleToggle = async(e)=>{
        let check = e.target.checked;
        if (check === true) {
            document.getElementById('smtp-body').style.display = 'block';
            setData({...data, smtpStatus: check });

        }else if (check === false) {
            document.getElementById('smtp-body').style.display = 'none';
            setData({...data, smtpStatus: check });


            
        }
        await axios.patch(`${process.env.REACT_APP_FRONTEND_URL}/smtp-update-status`,{smtpStatus : check})
      
    }

    
    // const navigate = useNavigate()
    const handleCheck = (event) => {
        const isChecked = event.target.checked;
        setData(prevData => ({
            ...prevData,
            userAuthentication: String(isChecked),
            userName: isChecked === true ? prevData.userName : '',
            password: isChecked === true ? prevData.password : '' 
        }));
        if(isChecked === true) {
            document.getElementById("auth").style.display = "block";
            document.getElementById("username").setAttribute("required", "true");
            document.getElementById("password").setAttribute("required", "true");
        }else if (isChecked === false) {
            document.getElementById("auth").style.display = "none";
            document.getElementById("username").removeAttribute("required");
            document.getElementById("password").removeAttribute("required");
        }
    };
    const handleChange = (event) => {
        let value = event.target.value;
        setData({ ...data, connOption: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let gmail_valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!gmail_valid.test(data.email)) {
            toast.error("Please enter a valid Gmail address")
            return;}
        console.log(data)
        // navigate('/reports')
        try{
            if(edit){
                await axios.put(process.env.REACT_APP_FRONTEND_URL + "/smtp-update", data)
                toast.success('IP Updated Successfully')

            }else{
                await axios.post(process.env.REACT_APP_FRONTEND_URL + "/smtp-post", data)
                toast.success('IP Configed Successfully')
            }
        }catch(e){
            toast.error("Failed to configure SMTP")
            console.log(e)
        }
    };
   
    const handleTestMail = () => {
        setPopup(true)
    }
    const handleClose = () => {
        setPopup(false);
        setReceiverEmail('')
    };

    
    const handleSend = async () => {
        let gmail_valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!gmail_valid.test(recEmail)) {
            toast.error("Please enter a valid Email address")
            return;
        }
        const smtp_data = {...data,receiverMail:recEmail}
       
        try{
            const resp = await axios.post(process.env.REACT_APP_FRONTEND_URL + "/smtp-test-mail",
            smtp_data,
            )
            if (data.userAuthentication !== 'true') {
                toast.warning("User is not authenticated.");
            }else if (resp.data.message === "Test email sent successfully" ) {
                toast.success("Test Email sent successfully");
            }
            // } else if (resp.status !== 200) {
            //     toast.error("Failed to send email. Server error.");
            
        }catch(error){
            toast.error("Failed to send test email")
            console.log(error)
        }
           
    };
    
    return (
        <div className="form-body-smtp">
           
            <navbar className="navbar">
                <Link className="back-button" to='/'><i className="bi bi-arrow-left-square"></i></Link>
                <h6>SMTP Config</h6>
            </navbar>
            <div className="confirm-smtp">
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={data.smtpStatus}
                                onChange={handleToggle}
                                name="smtpConfig"
                            />
                        }
                        label="SMTP Configuration"
                    />
                </FormGroup>
            </div>
            <div id="smtp-body" style={{display:'none'}}>
                <div className="smtp-body">
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Server IP"
                            value={data.serverIP}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            onChange={(e) => setData({...data, serverIP: e.target.value})}
                        />
                        <TextField
                            label="Server Port"
                            value={data.serverPort}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            onChange={(e) => setData({...data, serverPort: e.target.value})}
                        />
                    
                        <TextField
                            label="Email "
                            value={data.email}
                            variant="outlined"
                            fullWidth
                            type="email"
                            margin="normal"
                            required
                            onChange={(e) => setData({...data, email: e.target.value})}
                        />
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handleCheck}
                                        name="userAuthentication"
                                    />
                                }
                                label="User Authentication"
                            />
                        </FormGroup>
                        <div id="auth" style={{display:'none'}}>
                            <TextField
                                id = 'username'
                                label="User Name"
                                variant="outlined"
                                fullWidth
                                value={data.userName}
                                margin="normal"
                                onChange={(e) => setData({...data, userName: e.target.value})}
                            />
                            <TextField
                                id="password"
                                label="Password"
                                variant="outlined"
                                fullWidth
                                value={data.password}
                                type="password"
                                margin="normal"
                                onChange={(e) => setData({...data, password: e.target.value})}
                            />
                        </div>
                        <RadioGroup
                            aria-label="options"
                            name="controlled-radio-buttons-group"
                            value={data.connOption}
                            onChange = {handleChange}
                            >
                            <FormControlLabel value="SSL" control={<Radio />} label="SSL" />
                            <FormControlLabel value="TLS" control={<Radio />} label="TLS" />

                        </RadioGroup>
                        <div className="footer-button">
                            <Button type="submit" variant="contained" style={{marginRight:'10px'}}>Submit</Button>
                            <Button onClick={handleTestMail} variant="contained">Test Mail </Button>
                        </div>

                        
                    </form>
  
                </div>
            </div>
            <div>
                <Dialog open={popup} onClose={handleClose}>
                <DialogTitle>Test Email</DialogTitle>
                <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="email"
                    label="Recipient Email"
                    type="email"
                    fullWidth
                    value={recEmail}
                    onChange={(e) => setReceiverEmail(e.target.value)}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleSend}>
                    Send
                </Button>
                <Button onClick={handleClose}>
                    Close
                </Button>
                </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};