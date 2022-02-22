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
    CForm  } from '@coreui/react';
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
import { CFormSelect } from "@coreui/react";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';




//const [age, setAge] = React.useState('');

const handleChange = (event) => {
  //setAge(event.target.value);
};

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
const addMore = {
  color: "rgb(78, 167, 216)",
  fontSize: "2em",
  // position: "absolute",
  // right: 0,
  // top: 0
}
const removebtn = {
  color: "rgb(255, 0, 0)",
fontSize: "2em",
position: "relative",
top: "25px"
}

const useStyles  = makeStyles((theme) => ({
  formControl: {
    //margin: theme.spacing(1),
    width:"100%",
    marginTop:"20px"
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  title:{
    background:"#fff",
    //padding: "18.5px 14px"
  }
}));

const ProcessorsData = () => {
  const classes = useStyles();
  const history = useHistory();
  const [Isloader, setIsloader] = useState(false);
  const [companyId, setCompanyId] = useState('');
  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [group, setGroup] = useState('');
  const [name, setName] = useState('');
  const [folder, setFolder] = useState('');
  const [processor, setProcessor] = useState('');
  const [collection, setCollection] = useState('');
  const [googleVisionVal, setGoogleVisionVal] = useState('');
  const [azureFormVal, setAzureFormVal] = useState('');
  const [textractVal, setTextract] = useState('');
  const [keywordsField, setkeywordsField] = useState([""]);
  

  const CompanyList = ["Digital Glyde","Maverick","Questa Energy Corporation","Demo Resources"]
  const GoogleVisionList = ["Yes","No","All","First","Last"];
  const AzureFormList =["Yes","No","All","First","Last"];
  const TextractList =["Yes","No","All","First","Last"];
  
  
  useEffect(() => {

    getProcessorData()
  }, [])

  const getProcessorData = () => {
    setIsloader(true)
    let companyId = localStorage.getItem('companyId')
    console.log("===companyId:::",companyId)
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem('access_token'),
      // reqFrom: "ADMIN",
    };
    axios({
      method: "POST",
      url: settings.serverUrl + "/getProcessorData",
      data: JSON.stringify({
        companyId: companyId,        
      }),
      headers,
    }).then((response) => {
      console.log("Response", response.data.result);
      if (response.data.err) {
        // alert(response.data.err);
        toast.error(response.data.err, toast_options);
      }else{
        if(response.data.result){
          // let proArr = [];
          // response.data.result.map(processPbj =>{
          //   let processPbjCopy = {...processPbj}
          //   delete processPbjCopy.processor_id;
          //   proArr.push(processPbjCopy)
          // })
          // setTableData(proArr)
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
    });
  }
  const handleClickToOpen = () => {
    // let companyId = localStorage.getItem('companyId')
    // console.log("===companyId:::",companyId)
    // console.log("===errMsg===", errMsg)
    // setErrorMsg(errMsg);
    setOpen(true);
  };

  const handleToClose = () => {
    setOpen(false);
    setGroup("");
    setName("");
    setFolder("");
    setProcessor("");
    setCollection("");
    setGoogleVisionVal("");
    setAzureFormVal("");
    setTextract("");
    setkeywordsField([""])
  };

  const submit = () => {
    if (group == '' || group == null || group == undefined) {
      toast.warn("Please Enter Group !", {toast_options});
    }else if(name == '' || name == null || name == undefined){
      toast.warn("Please Enter Name!", {toast_options});
    }else if(folder == '' || folder == null || folder == undefined){
      toast.warn("Please Enter Folder!", {toast_options});
    }else if(processor == '' || processor == null || processor == undefined){
      toast.warn("Please Enter Processor!", {toast_options});
    }else if(collection == '' || collection == null || collection == undefined){
      toast.warn("Please Enter Collection!", {toast_options});
    }
    else{
      setIsloader(true)
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem('access_token'),
        // reqFrom: "ADMIN",
      };

      let companyId = localStorage.getItem('companyId')
      console.log("===companyId:::",companyId)
      let userType = localStorage.getItem('master')
      console.log('userType is:::::>>', userType);
    
      let requestBody = {company_id:companyId, 
                          name: name, 
                          group: group, 
                          folder: folder ,
                          processor: processor,
                          collection:collection,
                          googlevision:googleVisionVal,
                          azure:azureFormVal,
                          textract:textractVal,
                          keywords:keywordsField
                        }
                console.log('requestBody to add processor :>> ', requestBody);        
      axios({
        method: "POST",
        url: settings.serverUrl + "/addProcessor",
        data: JSON.stringify(requestBody),
        headers,
      }).then((response) => {
        console.log("Respone from post Processor Data==", response.data.result);
        if (response.data.err) {
          // alert(response.data.err);
          toast.error(response.data.err, toast_options);
        } else {
          // this.setState({ pdfImage: response.data.result, isLoading: false })
          setTableData([])
          getProcessorData()
          handleToClose()
        }
        setIsloader(false)
      }).catch(err => {
        toast.error(err.message, toast_options);
        console.log("Company Data Issue Error", err);
        if(err.message.includes("403")){
        localStorage.clear();
        history.push("/");
        }
      });
    }}
    
    const handleGoogleVisionChange = (e) => {
      setGoogleVisionVal(e.target.value)
    }
    const handleAzureFormChange = (e) => {
      setAzureFormVal(e.target.value)
    }
    const handleTextractChange = (e) => {
      setTextract(e.target.value)
    }

   const setIdentifykeywords =(text,idx) =>{

    console.log("Add More index==",idx)

    let keywordsFieldCpy = [...keywordsField]
    keywordsFieldCpy[idx] = text;
      setkeywordsField(keywordsFieldCpy)
    }
  return (
    
      <Grid className="container-fluid" style={{marginTop:55}}>
        <CButton type="submit" color="primary" size="lg" style={btn_style} onClick={() => handleClickToOpen()}>Add Processor</CButton>
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
                visible={key != "processor_id"}
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
            <Dialog open={open} onClose={handleToClose} style={{ Width: "100%" }}>
          <DialogTitle>Add Processor</DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              <CRow>
                                <CCol md="4">
                                <TextField id="outlined-basic" label="Enter Group" type="text" variant="outlined" style={{ width: "100%",marginTop:20 }}
                                value={group}
                                onChange={e => setGroup(e.target.value)}
                              />
                                </CCol>
                                <CCol md="4">
                                <TextField id="outlined-basic" label="Enter Name" type="text" variant="outlined" style={{ width: "100%",marginTop:20 }}
                              value={name}
                              onChange={e => setName(e.target.value)}
                              />
                                </CCol>

                                <CCol md="4">
                                <TextField id="outlined-basic" label="Enter Folder" type="text" variant="outlined" style={{ width: "100%",marginTop:20 }}
                                value={folder}
                                onChange={e => setFolder(e.target.value)}                              
                                />
                                </CCol>
                              </CRow>

                              <CRow>
                                
                                <CCol md="4">
                                <TextField id="outlined-basic" label="Enter Processor" type="text" variant="outlined" style={{ width: "100%",marginTop:20 }}
                                value={processor}
                                onChange={e => setProcessor(e.target.value)}  />
                                </CCol>

                                <CCol md="4">
                                <TextField id="outlined-basic" label="Enter Collection" type="text" variant="outlined" style={{ width: "100%",marginTop:20 }}
                                value={collection}
                                onChange={e => setCollection(e.target.value)} 
                              />
                                </CCol>
                                <CCol md="4">
                                <FormControl variant="outlined" className={classes.formControl}>
<InputLabel id="company" className={classes.title}>Select Company</InputLabel>
        <Select
          labelId="company"
          id="company"
          value={CompanyDropdown}
          name="company"
          onChange={handleCompanyChange}
        >
          {CompanyList.map((curr, index) => (
                              
                                  <MenuItem value={curr}>{curr}</MenuItem>
                               
                              ) )}

        </Select>
        </FormControl>
                                </CCol>
                              </CRow>

                              <CRow>
                                <CCol md="4">
                                <FormControl variant="outlined" className={classes.formControl}>
<InputLabel id="processor" className={classes.title}>Select For Google Vision</InputLabel>
        <Select
          labelId="processor"
          id="processor"
          value={googleVisionVal}
                            name="processor"
                            onChange={handleGoogleVisionChange}
        >
          {GoogleVisionList.map((curr, index) => (
                                  <MenuItem value={curr}>{curr}</MenuItem>
                               
                              ))}

        </Select>
        </FormControl>
                                </CCol>
                                <CCol md="4">
                                <FormControl variant="outlined" className={classes.formControl}>
<InputLabel id="azureForm" className={classes.title}>Select For Azure Form</InputLabel>
        <Select
          labelId="azureForm"
          id="azureForm"
          value={azureFormVal}
                            name="azureForm"
                            onChange={handleAzureFormChange}
        >
          {AzureFormList.map((curr, index) => (
       
                                  <MenuItem value={curr}>{curr}</MenuItem>
                        
                   
          ))}

        </Select>
        </FormControl>
                                </CCol>
                                <CCol md="4"><FormControl variant="outlined" className={classes.formControl}>
<InputLabel id="textract" className={classes.title}>Select For textract</InputLabel>
        <Select
          labelId="textract"
          id="textract"
          value={textractVal}
          name="textract"
          onChange={handleTextractChange}
        >

          {TextractList.map((curr, index) => (

                                  <MenuItem value={curr}>{curr}</MenuItem>
 
          ))}

        </Select>
        </FormControl>
        </CCol>
                              </CRow>

                           
                          
                          {/* <select
                            style={{
                              width: "100%",
                              background: "none",
                              border: "1px solid #999",
                              fontSize: "11px",
                              padding: "10px 0",
                              marginTop:"10px"
                            }}
                            value={CompanyDropdown}
                            name="company"
                            onChange={handleCompanyChange}
                          >
                            <option value="">Select Company</option>
                            {CompanyList.map((curr, index) => {
                              return (
                                <>
                                  <option>{curr}</option>
                                </>
                              );
                            })}
                          </select> */}
                          {/* <select
                            style={{
                              width: "100%",
                              background: "none",
                              border: "1px solid #999",
                              fontSize: "11px",
                              padding: "10px 0",
                              marginTop:"10px"
                            }}
                            value={googleVisionVal}
                            name="processor"
                            onChange={handleGoogleVisionChange}
                          >
                            <option value="">Select For Google Vision</option>
                            {GoogleVisionList.map((curr, index) => {
                              return (
                                <>
                                  <option>{curr}</option>
                                </>
                              );
                            })}
                          </select> */}
                          {/* <select
                            style={{
                              width: "100%",
                              background: "none",
                              border: "1px solid #999",
                              fontSize: "11px",
                              padding: "10px 0",
                              marginTop:"10px"
                            }}
                            value={azureFormVal}
                            name="azureForm"
                            onChange={handleAzureFormChange}
                          >
                            <option value="">Select For Azure Form</option>
                            {AzureFormList.map((curr, index) => {
                              return (
                                <>
                                  <option>{curr}</option>
                                </>
                              );
                            })}
                          </select> */}
                          {/* <select
                            style={{
                              width: "100%",
                              background: "none",
                              border: "1px solid #999",
                              fontSize: "11px",
                              padding: "10px 0",
                              marginTop:"10px"
                            }}
                            value={textractVal}
                            name="textract"
                            onChange={handleTextractChange}
                          >
                            <option value="">Select For textract</option>
                            {TextractList.map((curr, index) => {
                              return (
                                <>
                                  <option>{curr}</option>
                                </>
                              );
                            })}
                          </select> */}
                          <hr/>
                          { keywordsField.map((kf,idx)=>
                          <div style={{position:"relative"}}>
                            <div style={{ flexDirection: 'row', display:"table", width:"100%"}}>
                              <div style={{display:"table-cell", width:"100%"}}>
                            <TextField 
                              id="outlined-basic" 
                              label="Enter Identify keywords"
                              type="text" variant="outlined" 
                              style={{ marginTop:10, width:"100%" }}
                              value={kf}
                              onChange={e => setIdentifykeywords(e.target.value, idx)} 
                              
                            />
                            </div>
                            {idx>0 &&
                            <div style={{display:"table-cell"}}>
                               <Button style={removebtn} onClick={()=>{
                                console.log('idx of delete :>> ', idx);
                                let keywordsFieldCpy = [...keywordsField]
                                let deleteVal = keywordsFieldCpy.splice(idx,1)
                                console.log('deleteVal==== :>> ', deleteVal);
                                setkeywordsField(keywordsFieldCpy)
                              }}>
                              <i class="fa fa-times-circle-o" aria-hidden="true"></i>

                              </Button>
                              </div>
                            }

                            </div>
                            
                            </div>
                          )}
<div style={{ flexDirection: 'row', marginRight:30}}>
                            <Button style={addMore} onClick={()=>{
                            let keywordsFieldCpy = [...keywordsField]
                            keywordsFieldCpy.push("")
                            setkeywordsField(keywordsFieldCpy)
                            }
                              }><i class="fa fa-plus-circle" aria-hidden="true"></i>

                              </Button>
                            </div>
                          
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
export default ProcessorsData;
