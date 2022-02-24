import React, { useState, useEffect } from 'react';
import {
    CRow,
    CCol,
    CCard,
    CInput,
    CInputGroup,
    CButton,
    CSelect,
    CCardHeader,
    CCardBody,
    CForm,
    
  } from '@coreui/react';
import CircularProgress from "@material-ui/core/CircularProgress";
import * as wjCore from '@grapecity/wijmo';
import { FlexGrid, FlexGridColumn, FlexGridCellTemplate } from '@grapecity/wijmo.react.grid';
import * as wjFilter from "@grapecity/wijmo.react.grid.filter";
import * as wjGrid from '@grapecity/wijmo.react.grid';
import '@grapecity/wijmo.styles/wijmo.css';
import * as wjcCore from "@grapecity/wijmo";
import settings from 'src/config/settings';
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import { ToastContainer, toast } from 'react-toastify';
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router";
import { useSelector, useDispatch } from 'react-redux';


const loader = {
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  background: "rgba(255,255,255,0.4)",
  zIndex: "9999",
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

const btn_style = {
  width: "15%", 
  background: "#4ea7d8", 
  border: "#4ea7d8",
  marginTop:30 
}
const cancel_dialogBtn = {
  backgroundColor: '#4EA7D8',
  fontSize: 14,
  color: 'white'
}
const submit_dialogBtn = {
  backgroundColor: '#4EA7D8',
  fontSize: 14, color: 'white',
  marginLeft: 10
}
const CompanyUserData = () => {
  const history = useHistory();
  const [Isloader, setIsloader] = useState(false);
  const [companyId, setCompanyId] = useState('');
  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const compId = useSelector(state => state.companyId)

  
  useEffect(() => {
    getUsersData()
  }, [])

  const getUsersData = () => {
    setIsloader(true)

    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem('access_token'),
      // reqFrom: "ADMIN",
    };
    axios({
      method: "POST",
      url: settings.serverUrl + "/getUsersData",
      data: JSON.stringify({
        companyId: compId,        
      }),
      headers,
    }).then((response) => {
      console.log("Response", response.data.result);
      if (response.data.err) {
        // alert(response.data.err);
        toast.error(response.data.err, toast_options);
      }else{
        if(response.data.result){
          setTableData(response.data.result)
        }
      }
      setIsloader(false)
    }).catch(err => {
      toast.error(err.message, toast_options);
      // console.log("Record Issue Error Processor Data", err)
      if(err.message.includes("403")){
      localStorage.clear();
      history.push("/");
      }
      setIsloader(false)
    });
  }
  const handleClickToOpen = () => {
    setOpen(true);
  };

  const handleToClose = () => {
    setOpen(false);
    setEmail("");
    setName("");
  };
  const submit = () => {
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (email == '' || email == null || email == undefined) {
      toast.warn("Please Enter Email !", {toast_options});
    }
    else if (!(regex.test(email))) {
      toast.warn("Invalid Email !", {toast_options});  
    }
    else if(name == '' || name == null || name == undefined){
      toast.warn("Please Enter Name!", {toast_options});
    }
    else{
      handleToClose()
      setIsloader(true)
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem('access_token'),
        // reqFrom: "ADMIN",
      };
      let requestBody = {company_id:compId,email:email, name: name}
      axios({
        method: "POST",
        url: settings.serverUrl + "/addUser",
        data: JSON.stringify(requestBody),
        headers,
      }).then((response) => {
        console.log("Respone from post User Data==", response.data.result);
        if (response.data.err) {
          toast.error(response.data.err, toast_options);
          setIsloader(false)
        } else {
          getUsersData()
        }
        setEmail("");
        setName("");
        setIsloader(false)
      }).catch(err => {
        setIsloader(false)
        toast.error(err.message, toast_options);
        console.log("Company Data Issue Error", err)
        if(err.message.includes("403")){
        localStorage.clear();
        history.push("/");
        }
      });
    }}
  return (

      <Grid className="container-fluid" style={{marginTop:40}}>
      <CButton type="submit" color="primary" size="lg" style={btn_style} onClick={() => handleClickToOpen()}>Add User</CButton>

          {tableData.length>0 ?
          <Grid item xs={12} style={{ marginTop: 25}}>
             <FlexGrid
                headersVisibility="Column"
                autoGenerateColumns={false}
                // initialized={this.initializeDailyGrid}
                itemsSource={tableData}
                style={{
                  height: "auto",
                  maxHeight: 400,
                  margin: 0,
                }}
              >
                {tableData.length>0 && Object.keys(tableData[0]).map(key =>
                <FlexGridColumn
                binding={key}
                header={key.toUpperCase()}
                cssClass="cell-header"
                width="*"
                visible={key != "user_id"}
                style={{backgroundColor:'grey'}}
                ></FlexGridColumn>
                )}  
                <wjFilter.FlexGridFilter></wjFilter.FlexGridFilter>
              </FlexGrid>
           </Grid>:
           <div style={{height:300}}> <p style={{ width: "100%", display: "block", color: "#c00", margin: "12px 0", textAlign: "center", fontSize: "1.6em" }}>
           {(!Isloader) ? "No record Found!!" : ""}
           </p></div>}

            {Isloader &&
            <div style={loader}>
              <CircularProgress style={{ margin: "28% auto", display: "block" }} />
            </div>}
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
            <Dialog open={open} onClose={handleToClose}>
            <DialogTitle>Add User</DialogTitle>
                          <DialogContent style={{ minWidth: 500 }}>
                            <DialogContentText>
                              <CRow>
                                <CCol md="6">
                                <TextField id="outlined-basic" label="Enter Email" type="text" variant="outlined" style={{ width: "100%",marginTop:20 }}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                              />
                                </CCol>
                                <CCol md="6">
                                <TextField id="outlined-basic" label="Enter Name" type="text" variant="outlined" style={{ width: "100%",marginTop:20 }}
                              value={name}
                              onChange={e => setName(e.target.value)}
                              />
                                </CCol>
                              </CRow>
                            
                              
                              
                               
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <div style={{ flexDirection: 'row',marginRight:30 }}>
                              <Button style={cancel_dialogBtn} onClick={handleToClose}>Cancel</Button>
                              <Button style={submit_dialogBtn} onClick={submit}>Submit</Button>
                            </div>
                          </DialogActions>
            </Dialog>
      </Grid>
			);
}
export default CompanyUserData;
