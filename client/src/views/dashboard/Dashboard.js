
import React, { useState } from 'react';
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
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useHistory } from "react-router";


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
  // const [Sdate, setSdate] = useState();
  // const [Edate, setEdate] = useState();
  // const [Status, setStatus] = useState();
  // const [Document, setDocument] = useState();

  const history = useHistory();
  // const Sdate = (event) => {
  //   console.log(event.target.value);
  // }

  // const Edate = (event) => {
  //   console.log(event.target.value);
  // }


  // const Status = (event) => {
  //   console.log(event.target.value);
  // }

  // const Document = (event) => {
  //   console.log(event.target.value);
  // }


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
                    // onChange={Sdate}
                    />
                    <div style={{ width: "40px", fontSize: "1.3em", textAlign: "center" }}>to</div>
                    <CInput
                      type="date"
                      name='EndDate'
                    // onChange={Edate}
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
                    // onChange={Status}
                    >
                      <option>SELECT STATUS</option>
                      <option value="PROCESSED">PROCESSED</option>
                      <option value="PENDING">PENDING</option>
                      <option value="ERROR">ERROR</option>
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
                    // onChange={Document}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>

              <CRow>
                <CCol md="9"></CCol>
                <CCol md="3">
                  <CButton
                    // onClick={searchBtn} 
                    color="primary"
                    size="lg"
                    style={{ width: "100%", background: "#4ea7d8", border: "#4ea7d8" }}
                  >Search
                  </CButton></CCol>
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
          <TableBody>

            <TableRow>
              <TableCell style={table_content}><a href='#' style={{ color: "#ccc" }}><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></a></TableCell>
              <TableCell style={table_content}><i class="fa fa-search-plus" aria-hidden="true"
                onClick={() => {
                  history.push("/details");
                }}></i></TableCell>
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
            </TableRow>

          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default Dashboard;
