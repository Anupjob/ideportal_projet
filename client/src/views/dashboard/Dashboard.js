
import React, { useState } from 'react';
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
} from '@coreui/react'
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
  fontSize: "1.3em",
  fontWeight: "bold"
}
const upload_file = {
  outline: "5px dashed #4ea7d8",
  textIndent: "-200px",
  padding: "50px 0",
  borderRadius: "30px",
  background: "none",
  border: "none",
}
const Dashboard = () => {

  const [Isloader, setIsloader] = useState(false);
  const [Sdate, setSdate] = useState('');
  const [Edate, setEdate] = useState('');
  const [Status, setStatus] = useState('');
  const [Document, setDocument] = useState('');
  const [IncomingArr, setIncomingArr] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [ArrNull, setArrNull] = React.useState(false);


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
  const searchBtn = () => {
    setIsloader(true)
    setArrNull(false)
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
      setIsloader(false)
      console.log("Response", response.data.result);
      if (response.data.result == 0) {
        setArrNull(true)
        setIsloader(false)
      }
      // this.setState({ isLoading: false })
      setIncomingArr(response.data.result)


      // if (response.data.err) {
      //   alert(response.data.err);
      // }
      // if (response.data.result == "success") {
      //   this.props.history.push('/document_list');
      // }

    })
  }

  return (
    <>

      <CCard style={{ padding: "3em" }}>
        <CForm
        // onSubmit={searchBtn}
        >
          <CRow>
            <CCol><div style={{ fontSize: "1.3em", marginBottom: "30px" }}>Filter by any of these details</div>
              <CRow style={{ marginBottom: "20px" }}>
                <CCol xs="4" style={text_box}>DATA RANGE: </CCol>
                <CCol xs="8">
                  <CInputGroup>
                    <CInput
                      type="date"
                      name='StartDate'
                      onChange={Sdate1}
                    />
                    <div style={{ width: "40px", fontSize: "1.3em", textAlign: "center" }}>to</div>
                    <CInput
                      type="date"
                      name='EndDate'
                      onChange={Edate1}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow style={{ marginBottom: "20px" }}>
                <CCol xs="4" style={text_box}>STATUS: </CCol>
                <CCol xs="8">
                  <CInputGroup>
                    <CSelect aria-label="Default select example"
                      name='Status'
                      onChange={Status1}
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
              <CRow style={{ marginBottom: "20px" }}>
                <CCol xs="4" style={text_box}>TYPE OF DOCUMENTS: </CCol>
                <CCol xs="8">
                  <CInputGroup>
                    <CInput
                      type="text"
                      name='Documents'
                      onChange={Document1}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>

              <CRow>
                <CCol md="9"></CCol>
                <CCol md="3">
                  <CButton
                    onClick={searchBtn}
                    color="primary"
                    size="lg"
                    style={{ width: "100%", background: "#4ea7d8", border: "#4ea7d8" }}
                  >Search
                  </CButton>
                </CCol>
              </CRow>

            </CCol>

          </CRow>
        </CForm>
      </CCard >





      <TableContainer component={Paper} style={{ position: "relative", zIndex: "5" }}>
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
                    <DialogTitle>Error</DialogTitle>
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
                      history.push("/details");
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
              {/* <TableRow>
              <TableCell style={table_content}><a href='#' style={{ color: "#c00" }}><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></a></TableCell>
              <TableCell style={table_content}><a href='#' style={{ color: "#ccc" }}><i class="fa fa-search-plus" aria-hidden="true"></i></a></TableCell>
              <TableCell style={table_content}><strong>INCOMING</strong> </TableCell>
              <TableCell style={table_content}>CHECKS ENVERUS</TableCell>
              <TableCell style={table_content}>12/21/21 10:30 AM</TableCell>
              <TableCell style={table_content}>12/21/21 10:30 AM</TableCell>
              <TableCell style={table_content}>3</TableCell>
              <TableCell style={table_content}>PROCESSED</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={table_content}><a href='#' style={{ color: "#ccc" }}><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></a></TableCell>
              <TableCell style={table_content}><a href='#' style={{ color: "#ccc" }}><i class="fa fa-search-plus" aria-hidden="true" ></i></a></TableCell>
              <TableCell style={table_content}><strong>INCOMING</strong> </TableCell>
              <TableCell style={table_content}>CHECKS ENVERUS</TableCell>
              <TableCell style={table_content}>12/21/21 10:30 AM</TableCell>
              <TableCell style={table_content}>12/21/21 10:30 AM</TableCell>
              <TableCell style={table_content}>3</TableCell>
              <TableCell style={table_content}>PROCESSED</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={table_content}><a href='#' style={{ color: "#ccc" }}><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></a></TableCell>
              <TableCell style={table_content}><a href='#' style={{ color: "#ccc" }}><i class="fa fa-search-plus" aria-hidden="true"></i></a></TableCell>
              <TableCell style={table_content}><strong>INCOMING</strong> </TableCell>
              <TableCell style={table_content}>CHECKS ENVERUS</TableCell>
              <TableCell style={table_content}>12/21/21 10:30 AM</TableCell>
              <TableCell style={table_content}>12/21/21 10:30 AM</TableCell>
              <TableCell style={table_content}>3</TableCell>
              <TableCell style={table_content}>PROCESSED</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={table_content}><a href='#' style={{ color: "#c00" }}><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></a></TableCell>
              <TableCell style={table_content}><a href='#' style={{ color: "#ccc" }}><i class="fa fa-search-plus" aria-hidden="true"></i></a></TableCell>
              <TableCell style={table_content}><strong>INCOMING</strong> </TableCell>
              <TableCell style={table_content}>CHECKS ENVERUS</TableCell>
              <TableCell style={table_content}>12/21/21 10:30 AM</TableCell>
              <TableCell style={table_content}>12/21/21 10:30 AM</TableCell>
              <TableCell style={table_content}>3</TableCell>
              <TableCell style={table_content}>PROCESSED</TableCell>
            </TableRow> */}

            </TableBody>
          }
        </Table>
      </TableContainer>
    </>
  )
}

export default Dashboard;
