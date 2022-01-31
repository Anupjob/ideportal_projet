
import React, { useState, useEffect } from 'react';
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles';
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
import { useSelector, useDispatch } from 'react-redux';
import Table from '@material-ui/core/Table';
import CircularProgress from "@material-ui/core/CircularProgress";
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useHistory } from "react-router";
import axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import settings from 'src/config/settings';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as wjCore from '@grapecity/wijmo';
import { FlexGrid, FlexGridColumn, FlexGridCellTemplate } from '@grapecity/wijmo.react.grid';
import * as wjFilter from "@grapecity/wijmo.react.grid.filter";
import * as wjGrid from '@grapecity/wijmo.react.grid';
import '@grapecity/wijmo.styles/wijmo.css';
import * as wjcCore from "@grapecity/wijmo";
import Grid from "@material-ui/core/Grid";

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

const table_header = {
  borderBottom: "1px solid #ccc",
  color: "#2352a2",
  fontSize: "1.2em"
}
const table_content = {
  borderBottom: "1px dashed #ccc",
  color: "rgb(142, 142, 142)"
}
const text_box = {
  fontSize: "1.1em",
  fontWeight: "bold"
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
const upload_file = {
  textIndent: "-200px",
  padding: "62px 0",
  borderRadius: "5px",
 // background: "none",
  border: "none",
  position: "relative",
  zIndex: "1",
  marginBottom: "5px",
  background:"url(../upload.png) no-repeat #f2f2f2",
  backgroundSize: "110px",
  backgroundPosition: "50%",
  marginBottom:"10px",marginTop:"42px"
}

const Dashboard = () => {


  const dispatch = useDispatch()

  const [Isloader, setIsloader] = useState(false);
  const [Sdate, setSdate] = useState('');
  const [Edate, setEdate] = useState('');
  const [Status, setStatus] = useState('');
  const [Document, setDocument] = useState('');
  const [IncomingArr, setIncomingArr] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [ArrNull, setArrNull] = React.useState(false);
  const [selectedFile, setSelectedFile] = useState();
  // const url = useSelector(state => state.url)

  //const toggleSidebar = () => {
  // const val = [true, 'responsive'].includes(url) ? false : 'incoming'
  // dispatch({ type: 'set', url: val })
  //}
  useEffect(() => {
    let doc = JSON.parse(localStorage.getItem("dashboardData"))
    console.log("useeffect doc", doc)
    if (doc && doc.Sdate) {
      setDocument(doc.Document)
      setSdate(doc.Sdate)
      setEdate(doc.Edate)
      setStatus(doc.Status)
      // setTimeout(() => {
      console.log("Search Btn Status: ", Sdate, Edate, Status, Document)
      console.log("Search Btn Status: ", doc.Sdate, doc.Edate, doc.Status, doc.Document)

      searchBtn(doc.Sdate, doc.Edate, doc.Status, doc.Document)

      localStorage.clear()
      //  }, 2000);


    }
  }, [])


  const handleClickToOpen = (errMsg) => {
    console.log("===errMsg===", errMsg)
    setErrorMsg(errMsg);
    setOpen(true);
  };

  const handleToClose = () => {
    setOpen(false);
  };


  const history = useHistory();
  const Sdate1 = (event) => {
    console.log(event.target.value);
    setSdate(event.target.value)
  }

  const Edate1 = (event) => {
    console.log(event.target.value);
    setEdate(event.target.value)
  }


  const Status1 = (event) => {
    console.log(event.target.value);
    setStatus(event.target.value)
  }

  const Document1 = (event) => {
    console.log(event.target.value);
    setDocument(event.target.value)
  }
  const searchBtn = (Sdate, Edate, Status, Document) => {
    setIsloader(true)
    setArrNull(false)
    setIncomingArr([])

    console.log("Sdate:::", Sdate)
    console.log("Edate:::", Edate)
    console.log("status:::", Status)
    console.log("Document:::", Document)
    const headers = {
      "Content-Type": "application/json",
      // Authorization: "Bearer " + logginUser.token,
      // reqFrom: "ADMIN",
    };
    axios({
      method: "POST",
      url: settings.serverUrl + "/incomingData",
      data: JSON.stringify({
        dateRec: Sdate, dateProcessed: Edate,
        docStatus: Status,
        docType: Document
      }),
      headers,
    }).then((response) => {
      console.log("Response", response.data.result);
      if (response.data.result == 0) {
        setArrNull(true)
      }
      // this.setState({ isLoading: false })
      setIncomingArr(response.data.result)
      // setIsloader(false)
      setTimeout(() => {
        setIsloader(false)
      }, 1000);

      // if (response.data.err) {
      //   alert(response.data.err);
      // }
      // if (response.data.result == "success") {
      //   this.props.history.push('/document_list');
      // }

    }).catch(err => {
      toast.error(err.message, { toast_options });
      console.log("Record Issue Error", err)
    });
    setTimeout(() => {
      setIsloader(false)

    }, 1000);

  }
  const uploadBtn = (event) =>{
    event.preventDefault();
    let companyId = localStorage.getItem('companyId')
    console.log("companyId in dashboard==",companyId)

    let userId = localStorage.getItem('userId')
    console.log("userId in dashboard==",userId)

    let companyName = localStorage.getItem('company')
    console.log("companyName in dashboard==",companyName)

    let userEmail = localStorage.getItem('email')
    console.log("UserEmail in dashboard==",userEmail)

    console.log("selectedFile::::",selectedFile)
    if(selectedFile == '' || selectedFile == null || selectedFile == undefined){
      toast.warn("Please Select File !", toast_options);
    }else if(!selectedFile.type.includes("pdf")){
      toast.warn("Please Select Pdf File !", toast_options);
    }
    else{
      // companyId='1234';
      // userId='555';
    const formData = new FormData();
    formData.append("doc_file", selectedFile);
    formData.append("companyId", companyId);
    formData.append("userId", userId);
    formData.append("companyName", companyName);
    formData.append("email", userEmail);
    formData.append("email", selectedFile.size);
    const headers = {
      "Content-Type": "multipart/form-data",
      // Authorization: "Bearer " + logginUser.token,
      // reqFrom: "ADMIN",
    };
    axios({
      method: "POST",
      url: settings.serverUrl + "/uploadFile",
      data:formData,
      headers,
    }).then((response) => {
      console.log("Respone from post from upload file==", response);
      if (response.data.err) {
        setTimeout(() => {
        toast.error(response.data.err, toast_options);
      }, 500);
      } else {
        toast.success(response.data.result, toast_options);
    }})

    }
  }

  return (
    <>

      <CCard style={{ padding: "1em 3em" }}>
        <CForm
        // onSubmit={searchBtn}
        // method={"post"}
        // action={serverUrl+"/UploadFile"}
        // encType={"multipart/form-data"}
        >
          <CRow>
            <CCol md="9">
              <CRow>
              <CCol><div style={{ fontSize: "1.3em", marginBottom: "15px" }}>Filter by any of these details</div>
              <CRow style={{ marginBottom: "10px"}}>
                <CCol xs="4" style={text_box}>RECEIVE DATE: </CCol>
                <CCol xs="8">
                  <CInputGroup>
                    <CInput
                      type="date"
                      name='StartDate'
                      onChange={Sdate1}
                      value={Sdate}
                    />
                    <div style={{ width: "40px", fontSize: "1.3em", textAlign: "center" }}>to</div>
                    <CInput
                      type="date"
                      name='EndDate'
                      onChange={Edate1}
                      value={Edate}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow style={{ marginBottom: "10px" }}>
                <CCol xs="4" style={text_box}>STATUS: </CCol>
                <CCol xs="8">
                  <CInputGroup>
                    <CSelect aria-label="Default select example"
                      name='Status'
                      onChange={Status1}
                      value={Status}
                    >
                      <option value="">Select Status</option>
                      <option value="all">ALL</option>
                      <option value="Processed">PROCESSED</option>
                      <option value="Pending">PENDING</option>
                      <option value="Error">ERROR</option>
                    </CSelect>
                    {/* <CInput type="text" /> */}
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow style={{ marginBottom: "10px" }}>
                <CCol xs="4" style={text_box}>SEARCH: </CCol>
                <CCol xs="8">
                  <CInputGroup>
                    <CInput
                      type="text"
                      name='Documents'
                      onChange={Document1}
                      value={Document}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow style={{ marginBottom: "10px"}}>
              <CCol xs="4"></CCol>
              <CCol xs="8">
              <CButton
                    onClick={() => searchBtn(Sdate, Edate, Status, Document)}
                    color="primary"
                    size="lg"
                    style={{ width:"100%",background: "#4ea7d8",float:'right', border: "#4ea7d8",position: "relative", }}
                  >Search
                  </CButton>
              </CCol>
              </CRow>

            </CCol>
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
          </CRow>
          </CCol>
            <CCol md="3">
            <CInput type='file' style={upload_file} placeholder='sdsdfs' onChange={(event)=>setSelectedFile(event.target.files[0])} />
                  <CButton
                    onClick={(event) => uploadBtn(event)}
                    color="primary"
                    size="lg"
                    style={{ width: "100%", background: "#4ea7d8", border: "#4ea7d8" }}
                  >Upload
                  </CButton>
            </CCol>
          </CRow>
          
          
        </CForm>
      </CCard >
      <Dialog open={open} onClose={handleToClose}>
        <DialogTitle>Issue</DialogTitle>
        <DialogContent style={{ minWidth: 500 }}>
          <DialogContentText>
            {errorMsg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button style={{ backgroundColor: '#4EA7D8', fontSize: 14, color: 'white' }} onClick={handleToClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Grid className="container-fluid">
        <Grid item xs={12} style={{ marginTop: 25 }}>
          {IncomingArr.length > 0 && !ArrNull ?
            <FlexGrid
              headersVisibility="Column"
              autoGenerateColumns={false}
              itemsSource={IncomingArr}
              style={{
                height: "auto",
                maxHeight: 400,
                margin: 0,
              }}>
              <FlexGridColumn>
                <FlexGridCellTemplate cellType="Cell" template={ctx =>
                  <React.Fragment>
                    {ctx.item.docStatus.toLowerCase() == 'error' &&
                      <span><i class="fa fa-exclamation-triangle" aria-hidden="true"
                        onClick={() => handleClickToOpen(ctx.item.errMsg)}
                      ></i></span>
                    }
                  </React.Fragment>} />
              </FlexGridColumn>

              <FlexGridColumn>
                <FlexGridCellTemplate cellType="Cell" template={ctx => <React.Fragment>
                  <span style={{ cursor: "pointer" }}><i class="fa fa-search-plus" aria-hidden="true"
                    onClick={() => {
                      localStorage.setItem("dashboardData", JSON.stringify({ Document: Document, Status: Status, Edate: Edate, Sdate: Sdate }))
                      //  console.log("IncomingArr data==>>", ctx.item)
                      history.push({
                        pathname: '/details',
                        state: { data: ctx.item }
                      })
                    }}
                  ></i></span>
                </React.Fragment>} />
              </FlexGridColumn>

              <FlexGridColumn
                binding="processorGroup"
                header="PROCESSOR GROUP"
                cssClass="cell-header"
                width="*"
                multiLine="true"
                style={{ backgroundColor: 'grey' }}
              />
              <FlexGridColumn
                binding="processorName"
                header="PROSESSOR NAME"
                cssClass="cell-header"
                width="*"
                multiLine="true"
                style={{ backgroundColor: 'grey' }}
              />

              <FlexGridColumn
                // binding="dateRec"
                header="DATE/TIME RECEIVED"
                cssClass="cell-header"
                width="*"
                style={{ backgroundColor: 'grey' }}

              >
                <FlexGridCellTemplate cellType="Cell" template={ctx =>
                  <React.Fragment>
                    {ctx.item.dateRec &&
                      <span>{moment(ctx.item.dateRec).format("MM/DD/YYYY hh:mm A")}</span>
                    }
                  </React.Fragment>} />
              </FlexGridColumn>

              <FlexGridColumn
                // binding="dateProcessed"
                header="DATE/TIME PROCESSED"
                cssClass="cell-header"
                width="*"
                style={{ backgroundColor: 'grey' }}>
                <FlexGridCellTemplate cellType="Cell" template={ctx =>
                  <React.Fragment>
                    {ctx.item.dateProcessed &&
                      <span>{moment(ctx.item.dateProcessed).format("MM/DD/YYYY hh:mm A")}</span>
                    }
                  </React.Fragment>} />
              </FlexGridColumn>
              <FlexGridColumn
                binding="pdfFilename"
                header="FILE NAME"
                cssClass="cell-header"
                width="*"
                style={{ backgroundColor: 'grey' }} />
                <FlexGridColumn
                binding="finalFileName"
                header="CSV FILE"
                cssClass="cell-header"
                width="*"
                style={{ backgroundColor: 'grey' }} />
              <FlexGridColumn
                binding="noOfPages"
                header="# OF PAGES"
                cssClass="cell-header"
                width="*"
                style={{ backgroundColor: 'grey' }} />

              <FlexGridColumn
                binding="docStatus"
                header="STATUS"
                cssClass="cell-header"
                width="*"
                style={{ backgroundColor: 'grey' }} />
              <FlexGridColumn
                binding="fromEmail"
                header="FROM"
                cssClass="cell-header"
                width="*"
                multiLine="true"
                style={{ backgroundColor: 'grey' }}
              />
              <FlexGridColumn
                // binding="toEmail"
                header="UPLOADED BY"
                cssClass="cell-header"
                width="*"
                multiLine="true"
                style={{ backgroundColor: 'grey' }}
              />
              <wjFilter.FlexGridFilter></wjFilter.FlexGridFilter>
            </FlexGrid>
            :
            <p style={{ width: "100%", display: "block", color: "#c00", margin: "12px 0", textAlign: "center", fontSize: "1.6em" }}>No record Found!!</p>
          }
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

      </Grid>

      {/* <TableContainer component={Paper} style={{ position: "relative", zIndex: "5" }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={table_header}><i class="fa fa-bell" aria-hidden="true"></i></TableCell>
              <TableCell style={table_header}><i class="fa fa-sticky-note" aria-hidden="true"></i></TableCell>
              <TableCell style={table_header}>PROCESSING STAGE </TableCell>
              <TableCell style={table_header}>TYPE OF DOCUMENTS</TableCell>
              <TableCell style={table_header}>DATA/TIME RECEIVED </TableCell>
              <TableCell style={table_header}>DATE/TIME PROCESSED</TableCell>
              <TableCell style={table_header}># OF PAGES</TableCell>
              <TableCell style={table_header}>DOCUMENTS STATUS</TableCell>

            </TableRow>
          </TableHead>
          {Isloader ?
            <div style={loader}>

              <CircularProgress style={{ margin: "22% auto", display: "block" }} />

            </div>

            :
            <TableBody>
              {IncomingArr.length > 0 && !ArrNull ? IncomingArr.map((data) => (
                <TableRow>

                  <TableCell style={table_content}>
                    {data.docStatus.toLowerCase() == 'error' &&
                      <a style={{ color: "#00f" }} onClick={() => handleClickToOpen(data.errMsg)}>
                        {console.log("==data error msg::", data)}
                        <i class="fa fa-exclamation-triangle" aria-hidden="true" >
                        </i>
                      </a>
                    }
                  </TableCell>
                  <Dialog open={open} onClose={handleToClose}>
                    <DialogTitle>Issue</DialogTitle>
                    <DialogContent style={{ minWidth: 500 }}>
                      <DialogContentText>
                        {errorMsg}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button style={{ backgroundColor: '#4EA7D8', fontSize: 14, color: 'white' }} onClick={handleToClose}>Close</Button>
                    </DialogActions>
                  </Dialog>
                  <TableCell style={table_content}><i class="fa fa-search-plus" aria-hidden="true"
                    onClick={() => {
                      localStorage.setItem("dashboardData", JSON.stringify({ Document: Document, Status: Status, Edate: Edate, Sdate: Sdate }))
                      // history.push("/details");
                      console.log("IncomingArr send==>>", IncomingArr)
                      history.push({
                        pathname: '/details',
                        // state: {IncomingArr : IncomingArr}
                        state: { data: data }

                      })
                    }}></i></TableCell>
                  <TableCell style={table_content}><strong>INCOMING</strong> </TableCell>
                  <TableCell style={table_content}>{data.processorGroup}<br />{data.processorName}</TableCell>
                  <TableCell style={table_content}>{moment(data.dateRec).format("MM/DD/YYYY hh:mm A")}</TableCell>
                  <TableCell style={table_content}>{moment(data.dateProcessed).format("MM/DD/YYYY hh:mm A")}</TableCell>
                  <TableCell style={table_content}>{data.noOfPages}</TableCell>
                  <TableCell style={table_content}>{data.docStatus}</TableCell>
                </TableRow>
              ))
                :

                <TableRow>
                  <TableCell colSpan={8}><p style={{ width: "100%", display: "block", color: "#c00", margin: "12px 0", textAlign: "center", fontSize: "1.6em" }}>No record Found!!</p></TableCell>

                </TableRow>
              }
            </TableBody>
          }
        </Table>
      </TableContainer> */}
    </>
  )
}

export default Dashboard;
