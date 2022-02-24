import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import {
  // CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInputGroup,
  CRow,
} from '@coreui/react'
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button/Button"
import _ from "underscore";
import CircularProgress from "@material-ui/core/CircularProgress";
import settings from 'src/config/settings'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router";

const bgColor = {
  background: "rgb(131,73,191)",
  background: "linear-gradient(200deg, rgba(131,73,191,1) 16%, rgba(25,229,246,1) 84%)",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: "100%",
  overflowY: "auto"
}
const buttonStyle = {
  textTransform: 'none',
  backgroundColor: "#4ea7d8",
  lineHeight: "3"
}
const formTitle = {
  color: "#2d87b9",
  textAlign: "center",
  fontSize: "2.2em"
}
const pageTitle = {
  color: "#fff",
  textAlign: "left",
  fontSize: "2.2em",
  background: "url(./dg_logo.png) no-repeat",
  backgroundSize: "110px",
  padding: "15px 0 15px 140px"
}
const pageDesc = {
  color: "#fff",
  fontSize: "1.2em",
  margin: "35px 0"
}
const pageDescList = {
  color: "#fff",
  fontSize: "1.2em",
  margin: "35px 0",
  background: "url(./list_icon.png) no-repeat",
  backgroundSize: "30px",
  padding: "0px 0px 20px 50px",
  backgroundPosition: "0 5px"
}
const formDesc = {
  color: "#2d333a",
  fontSize: "21px",
  textAlign: "center",
  marginBottom: "40px"
}
const otpText = {
  color: "#2d333a",
  fontSize: "18px",
  textAlign: "center",
  marginBottom: "40px"
}
const loader = {
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  background: "rgba(255,255,255,0.4)",
  zIndex: "100",
  display: "table",
  width: "100%",
  height: "100%"
}
const toast_options = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
}
const Login =()=> {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [Isloader, setIsloader] = useState(false);
  const [sendOtp, setSendOtp] = useState(false);
  const dispatch = useDispatch()


  const handleClick = () => {
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (email == '' || email == null || email == undefined) {
      toast.warn("Please Enter Email !", {toast_options});
    } else if (!(regex.test(email))) {
      toast.warn("Invalid Email !", {toast_options});  
    }
    else {
      console.log("===You are in else")
      setIsloader(true)
      const headers = {
        "Content-Type": "application/json",
        // Authorization: "Bearer " + logginUser.token,
        // reqFrom: "ADMIN",
      };
      let requestBody = { email: email }
      axios({
        method: "POST",
        url: settings.serverUrl + "/user/login/",
        data: JSON.stringify(requestBody),
        headers,
      }).then((response) => {
        console.log("Respone from post in Login==", response);
        
        if (response.data.err) {
          setIsloader(false)
          toast.error(response.data.err, {toast_options}); 
        } else {
          localStorage.setItem('company', response.data.result.company)
          localStorage.setItem('companyId', response.data.result.companyId)
          localStorage.setItem('name', response.data.result.name)
          localStorage.setItem('userId', response.data.result.userId)
          localStorage.setItem('email', response.data.result.email)
          localStorage.setItem('master', response.data.result.master)
          dispatch({type:'set', companyId:response.data.result.companyId})
          setSendOtp(true)
        }
        setIsloader(false)
      }).catch(err => {
        toast.error(err.message, {toast_options});
        console.log("Error on Let's Go Click===",err)});
    }
  }

  const verifyOtpClick = () => {
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (email == '' || email == null || email == undefined) {
      toast.warn("Please Enter Email !", {toast_options});  
    }
    else if (!(regex.test(email))) {
      toast.warn("Invalid Email !", {toast_options});  
    }
    else if (password == '' || password == null || password == undefined) {
      toast.warn("Please Enter OTP !", {toast_options});  
    }
    else {
      setIsloader(true)
      const headers = {
        "Content-Type": "application/json",
        // Authorization: "Bearer " + logginUser.token,
        // reqFrom: "ADMIN",
      };
      let requestBody = { email: email, otp: password }
      axios({
        method: "POST",
        url: settings.serverUrl + "/user/login/",
        data: JSON.stringify(requestBody),
        headers,
      }).then((response) => {
        console.log("Respone from Verify otp===", response.data, response.data.err);
        setIsloader(false)
        if (response.data.err) {
          toast.error(response.data.err, {toast_options});         
        }else{
          let access_token  = response.data.result.access_token
        localStorage.setItem('access_token', access_token)
        history.push('/incoming_list');
        }
      
      }).catch(err => {
        toast.error(err.message, {toast_options});
        console.log("Error on Verification==",err)});
    }
  }

  return (
      <CContainer fluid style={bgColor}>
        <CContainer style={{ padding: "70px 0" }}>
          <CRow>
            <CCol md="7">
              <h1 style={pageTitle}>WELCOME TO <br />IMAGE DATA EXTRACT</h1>
              <p style={pageDesc}>From single printed documents to millions of digital documents processed Digital Glyde's Digital Image Data Extract can help you easily etract specific data seamlessly out of any printed document or digital file format.</p>

              <p style={pageDescList}><strong><em>Data Extraction</em></strong> allow users to scan/scrape multiple data sources simultaneously.</p>

              <p style={pageDescList}><strong><em>Data Aggregation and Preparation</em></strong> creates rules and workflows to cleanse the relevant data.</p>

              <p style={pageDescList}><strong><em>Modeling and Deployement of Models</em></strong> uses analytics to determaine modules and predictions.</p>

              <p style={pageDescList}><strong><em>Data Integration</em></strong> helps increase operational efficiency by bringing data together info a unified view.</p>
            </CCol>
            <CCol md="5">
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm>
                      <h1 style={formTitle}>Let's Get Started!</h1>
                      <p style={formDesc}>Sign in to your Image Data Extract Account</p>
                      <CInputGroup className="mb-4">
                        <TextField id="outlined-basic" disabled={sendOtp} label="Email" variant="outlined" style={{ width: "100%" }} 
                        value={email} 
                        onChange={e => setEmail(e.target.value)}/>
                      </CInputGroup>
                      {sendOtp ? 
                      <CInputGroup className="mb-4">
                        <TextField id="outlined-basic" label="Enter OTP" type="text" variant="outlined" style={{ width: "100%" }}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                        />
                      </CInputGroup> : null}
                      {sendOtp ?
                        <p style={otpText}>The OTP is sent to given Email Id</p>
                        : null}
                      {sendOtp ? 
                      <CInputGroup className="mb-4">
                        <Button variant={"contained"} color={"primary"} fullWidth style={buttonStyle}
                          onClick={verifyOtpClick}
                        >Verify OTP</Button>
                      </CInputGroup> : <CInputGroup className="mb-4">
                        <Button variant={"contained"} color={"primary"} fullWidth style={buttonStyle}
                          onClick={handleClick}
                        >Let's Go</Button>
                      </CInputGroup>}
                      <CRow>
                        <CCol className="mb-4">
                          <Link to="/register" style={{ color: "#2d333a" }}>
                            {"Don't have an account? Sign Up"}
                          </Link>
                        </CCol>
                      </CRow>
                      {Isloader  && (
                        <div style={loader}>
                          <CircularProgress style={{ margin: "22% auto", display: "block" }} />
                        </div>
                      )}
                      <div><ToastContainer
                              position="top-center"
                              autoClose={5000}
                              hideProgressBar
                              newestOnTop={false}
                              closeOnClick
                              rtl={false}
                              pauseOnFocusLoss
                              draggable
                              pauseOnHover
                            /></div>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>            
          </CRow>
        </CContainer>
      </CContainer>
    )
}

export default Login
