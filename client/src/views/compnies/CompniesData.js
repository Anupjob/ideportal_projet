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
    CForm
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
import 'react-toastify/dist/ReactToastify.css';
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

const CompniesData = () => {
  const history = useHistory();
  const [Isloader, setIsloader] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = useState('');
  const [streetOne, setStreetOne] = useState('');
  const [streetTwo, setStreetTwo] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [contact, setContact] = useState('');
  const dispatch = useDispatch()


  useEffect(() => {
    getCompanyData()
  }, [])

  const getCompanyData = () => {
    setIsloader(true)
    // setTableData([])

    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem('access_token'),
      // reqFrom: "ADMIN",
    };
    axios({
      method: "GET",
      url: settings.serverUrl + "/getCompaniesData",
      headers,
    }).then((response) => {
      console.log("Response", response.data.result);
      if (response.data.err) {
        toast.error(response.data.err, toast_options);
      }else{
        if(response.data.result){
          dispatch({ type: 'set', companyList: response.data.result })
          setTableData(response.data.result)
        }
        setIsloader(false)
      }
    }).catch(err => {
      toast.error(err.message, toast_options);
      // console.log("Record Issue Error Processor Data", err)
      if(err.message.includes("403")){
      localStorage.clear();
      history.push("/");
      }
    });
  }
  const handleClickToOpen = () => { 
    setOpen(true);
  };
  const handleToClose = () => {
    setOpen(false);
    setName("");
    setStreetOne("");
    setStreetTwo("");
    setCity("");
    setState("");
    setZip("");
    setContact("")
  };
  
 const submit = () => {
  if (name == '' || name == null || name == undefined) {
    toast.warn("Please Enter Name !", {toast_options});
  }else if(streetOne == '' || streetOne == null || streetOne == undefined){
    toast.warn("Please Enter Street One!", {toast_options});
  }else if(city == '' || city == null || city == undefined){
    toast.warn("Please Enter City!", {toast_options});
  }else if(state == '' || state == null || state == undefined){
    toast.warn("Please Enter State!", {toast_options});
  }else if(zip == '' || zip == null || zip == undefined){
    toast.warn("Please Enter Zip Code!", {toast_options});
  }else if(contact == '' || contact == null || contact == undefined){
    toast.warn("Please Enter Contact!", {toast_options});
  }else{
    handleToClose()
    setIsloader(true)
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem('access_token'),
      // reqFrom: "ADMIN",
    };
    let requestBody = { companyName: name, street1: streetOne, street2: streetTwo ,city: city,state:state,zip:zip,contact:contact}
    axios({
      method: "POST",
      url: settings.serverUrl + "/addCompany",
      data: JSON.stringify(requestBody),
      headers,
    }).then((response) => {
      console.log("Respone from post Company Data==", response.data.result);
      if (response.data.err) {
        toast.error(response.data.err, toast_options);
        setIsloader(false)
      } else {
        getCompanyData()
      }
      setName("");
      setStreetOne("");
      setStreetTwo("");
      setCity("");
      setState("");
      setZip("");
      setContact("")
      setIsloader(false)
    }).catch(err => {
      setIsloader(false)
      toast.error(err.message, toast_options);
      // console.log("Company Data Issue Error", err)
      if(err.message.includes("403")){
      localStorage.clear();
      history.push("/");
      }
    });
  }
  }
  return (
    <Grid className="container-fluid" style={{marginTop:40}}>
        <CButton type="submit" color="primary" size="lg" style={btn_style} onClick={() => handleClickToOpen()}>Add Company</CButton>
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
              }}>
              {tableData.length>0 && Object.keys(tableData[0]).map(key =>
              <FlexGridColumn
              binding={key}
              header={key.toUpperCase()}
              cssClass="cell-header"
              width="*"
              visible={key != "comp_id"}
              style={{backgroundColor:'grey'}}
              ></FlexGridColumn>
              )}  
              <wjFilter.FlexGridFilter></wjFilter.FlexGridFilter>
            </FlexGrid>
          </Grid>
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
          <DialogTitle>Add Company</DialogTitle>
                          <DialogContent style={{ minWidth: 500 }}>

                            <DialogContentText>
                            <CRow>
                              <CCol md="6">
                              <TextField id="outlined-basic" label="Enter Name" type="text" variant="outlined" style={{ width: "100%",marginTop:20 }}
                                value={name}
                                onChange={e => setName(e.target.value)}
                              />
                              </CCol>
                              <CCol md="6">
                              <TextField id="outlined-basic" label="Enter Street 1" type="text" variant="outlined" style={{ width: "100%",marginTop:20 }}
                              value={streetOne}
                              onChange={e => setStreetOne(e.target.value)}
                              />
                              </CCol>
                            </CRow>
                            <CRow>
                              <CCol md="6">
                              <TextField id="outlined-basic" label="Enter Street 2" type="text" variant="outlined" style={{ width: "100%",marginTop:20 }}
                                value={streetTwo}
                                onChange={e => setStreetTwo(e.target.value)}                              
                                />
                              </CCol>
                              <CCol md="6">
                              <TextField id="outlined-basic" label="Enter City" type="text" variant="outlined" style={{ width: "100%",marginTop:20 }}
                                value={city}
                                onChange={e => setCity(e.target.value)} />
                              </CCol>
                            </CRow>
                            <CRow>
                              <CCol md="6">
                              <TextField id="outlined-basic" label="Enter State" type="text" variant="outlined" style={{ width: "100%",marginTop:20 }}
                                value={state}
                                onChange={e => setState(e.target.value)} 
                              />
                              </CCol>
                              <CCol md="6">
                              <TextField id="outlined-basic" label="Enter Zip" type="text" variant="outlined" style={{ width: "100%",marginTop:20 }}
                                value={zip}
                                onChange={e => setZip(e.target.value)}
                              />
                              </CCol>
                            </CRow>
                            <CRow>
                              <CCol md="6">
                              <TextField id="outlined-basic" label="Enter Contact" type="tel" variant="outlined" style={{ width: "100%" ,marginTop:20}}
                                value={contact}
                                onChange={e => setContact(e.target.value)}
                              />
                              </CCol>
                              <CCol md="6"></CCol>
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
    
    );}
export default CompniesData;
