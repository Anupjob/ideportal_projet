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
import Avatar from "@material-ui/core/Avatar";
import zIndex from '@material-ui/core/styles/zIndex';
import { GroupPanel } from "@grapecity/wijmo.react.grid.grouppanel";

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
  background: 'none', 
          fontSize: "24px",
          color: "#fff",
          position: "absolute",
          top: "4px",
          right:"0"

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
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [gridObject, setGridObject] = useState();
  const compId = useSelector(state => state.companyId)


  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  
  const handleChange = (e) => {

    if (e.target.files) {
      const { files } = e.target;
      if (files && files.length > 0) {
        getBase64(files[0]).then((res) => {
          setImage(res);
        });
      }
    } 
  };

  useEffect(() => {
    getUsersData()
  }, [])

  const initializeGrid = (flex) => {
    // flex.rows.defaultSize = 40;
    setGridObject(flex);

    flex.columnHeaders.rows.defaultSize = 40;
  };
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
      let requestBody = {company_id:compId,email:email, name: name, image: image}
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
          toast.success(response.data.result, toast_options);
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

      <Grid>
            <Grid item xs={12} style={{ marginTop: 25 }}>
            <GroupPanel className="group-panel" grid={gridObject} placeholder="Drag columns here to create groups" style={{position:'relative',zIndex:1}}/>
              <FlexGrid
                headersVisibility="Column"
                autoGenerateColumns={false}
                initialized={initializeGrid}
                itemsSource={tableData}
                isReadOnly={true}
                style={{
                  height: "auto",
                  maxHeight: (window.innerHeight-400) + "px",
                  margin: 0,
                }}
              >
                {/* <FlexGridColumn>
                  <FlexGridCellTemplate
                    cellType="Cell"
                    template={(ctx) => (
                      <React.Fragment>
                        <input type="checkbox" />
                      </React.Fragment>
                    )}
                  />
                </FlexGridColumn> */}
                <FlexGridColumn
                  binding="email"
                  header="Email"
                  cssClass="cell-header"
                  width="*"
                  multiLine="true"
                  style={{ backgroundColor: "grey" }}
                >
                  <FlexGridCellTemplate
                    cellType="Cell"
                    template={(ctx) => (
                      <React.Fragment>
                        <div style={{ display: "flex" }}>
                          <div style={{ width: "40px" }}>
                            <Avatar
                              src={ctx.item.image ? ctx.item.image : ""}
                              style={{
                                width: 30,
                                height: 30,
                                // border: '2px solid #f8f8f8',
                              }}
                            />
                          </div>
                          <div style={{ width: "40%" }}>{ctx.item.email}</div>
                        </div>
                      </React.Fragment>
                    )}
                  />
                </FlexGridColumn>

                <FlexGridColumn
                  binding="name"
                  header="Name"
                  cssClass="cell-header"
                  width="*"
                  multiLine="true"
                  style={{ backgroundColor: "grey" }}
                />
                {/* <FlexGridColumn
                  binding="company"
                  header="Company"
                  cssClass="cell-header"
                  width="*"
                  multiLine="true"
                  style={{ backgroundColor: "grey" }}
                /> */}
                
                <wjFilter.FlexGridFilter></wjFilter.FlexGridFilter>
              </FlexGrid>
            </Grid>
            {Isloader && (
              <div style={loader}>
                <CircularProgress
                  style={{ margin: "28% auto", display: "block" }}
                />
              </div>
            )}
            <div>
              <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </div>
          </Grid>

          {/* {tableData.length>0 ?
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
           </p></div>} */}

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
                                <CCol>
                                {/* <TextField id="outlined-basic" label="" type="file" variant="outlined" style={{ width: "100%", marginTop:20 }}
                                value="" onChange="" /> */}
                                <div style={{border:"1px dashed #999", position:"relative"}}>
                                  <i class="fa fa-user-circle-o" aria-hidden="true" 
                                  style={{
                                    fontSize: "2em",
                                    left: "10px",
                                    position: "absolute",
                                    top: "16px",
                                    color: "#cecece",
                                    zIndex:"0"
                                    }}></i>
                                <input type="file" 
                                style={{
                                  textIndent: 250,
                                  marginLeft: -530,
                                  cursor:"pointer", 
                                  padding:"20px 0", 
                                  position:"relative", 
                                  zIndex:"2",
                                  width:'100%'
                                  }} 
                                  name="image"
                        onChange={handleChange}
                                  />
                                </div>
                                </CCol>
                              </CRow>
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
                              <Button style={cancel_dialogBtn} onClick={handleToClose}>&times;</Button>
                              <Button style={submit_dialogBtn} onClick={submit}>Submit</Button>
                            </div>
                          </DialogActions>
            </Dialog>
      </Grid>
			);
}
export default CompanyUserData;
