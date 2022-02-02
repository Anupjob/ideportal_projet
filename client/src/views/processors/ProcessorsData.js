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
const ProcessorsData = () => {
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
      axios({
        method: "POST",
        url: settings.serverUrl + "/addProcessor",
        data: JSON.stringify({company_id:companyId, name: name, group: group, folder: folder ,processor: processor,collection:collection}),
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
                header={key}
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
            <Dialog open={open} onClose={handleToClose}>
          <DialogTitle>Add Company</DialogTitle>
                          <DialogContent style={{ minWidth: 500 }}>
                            <DialogContentText>
                            
                              <TextField id="outlined-basic" label="Enter Group" type="text" variant="outlined" style={{ width: "100%",marginTop:10 }}
                                value={group}
                                onChange={e => setGroup(e.target.value)}
                              />
                              <TextField id="outlined-basic" label="Enter Name" type="text" variant="outlined" style={{ width: "100%",marginTop:10 }}
                              value={name}
                              onChange={e => setName(e.target.value)}
                              />
                               <TextField id="outlined-basic" label="Enter Folder" type="text" variant="outlined" style={{ width: "100%",marginTop:10 }}
                                value={folder}
                                onChange={e => setFolder(e.target.value)}                              
                                />
                               <TextField id="outlined-basic" label="Enter Processor" type="text" variant="outlined" style={{ width: "100%",marginTop:10 }}
                                value={processor}
                                onChange={e => setProcessor(e.target.value)}                               />
                              <TextField id="outlined-basic" label="Enter Collection" type="text" variant="outlined" style={{ width: "100%",marginTop:10 }}
                                value={collection}
                                onChange={e => setCollection(e.target.value)} 
                              />
                              
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
