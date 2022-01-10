import React, { useEffect, useState, createRef } from 'react'
import classNames from 'classnames'
import {
  CRow,
  CCol,
  CCard,
  CInput,
  CInputGroup,
  CButton,
  CCardHeader,
  CCardBody
} from '@coreui/react'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useHistory } from "react-router";

import { rgbToHex } from '@coreui/utils'
import { DocsLink } from 'src/reusable'

const text_box = {
  fontSize: "1.3em",
  fontWeight: "bold"
}
const upload_file = {
  width: "100%",
  height: "150px",
  textIndent: "-100px",
  marginBottom: "20px",
  backgroundColor: "#f2f2f2",
  backgroundImage: "url(../upload.png)",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "50%",
  backgroundSize: "130px",
  cursor: "pointer"
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


const Colors = () => {

  const history = useHistory();
  return (
    <>
      <CCard style={{ padding: "3em" }}>
        <CRow>
          <CCol md="9"><div style={{ fontSize: "1.3em", marginBottom: "30px" }}>Filter by any of these details</div>
            <CRow style={{ marginBottom: "20px" }}>
              <CCol xs="5" style={text_box}>DATA RANGE: </CCol>
              <CCol xs="7">
                <CInputGroup>
                  <CInput type="text" />
                  <div style={{ width: "40px", fontSize: "1.3em", textAlign: "center" }}>to</div>
                  <CInput type="text" />
                </CInputGroup>
              </CCol>
            </CRow>
            <CRow style={{ marginBottom: "20px" }}>
              <CCol xs="5" style={text_box}>STATUS: </CCol>
              <CCol xs="7">
                <CInputGroup>
                  <CInput type="text" />
                </CInputGroup>
              </CCol>
            </CRow>
            <CRow style={{ marginBottom: "20px" }}>
              <CCol xs="5" style={text_box}>TYPE OF DOCUMENTS: </CCol>
              <CCol xs="7">
                <CInputGroup>
                  <CInput type="text" />
                </CInputGroup>
              </CCol>
            </CRow>
          </CCol>
          <CCol md="3">
            <CInput type="file" style={upload_file} />
            <CButton type="submit" color="primary" style={{ width: "100%", background: "#4ea7d8", border: "#4ea7d8" }}>Search</CButton>
          </CCol>
        </CRow>
      </CCard >

      <TableContainer component={Paper} style={{ position: "relative", zIndex: "5" }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={table_header}>Status</TableCell>
              <TableCell style={table_header}>30 days</TableCell>
              <TableCell style={table_header}>60 days</TableCell>
              <TableCell style={table_header}>120 days</TableCell>
              <TableCell style={table_header}>YTD </TableCell>
              <TableCell style={table_header}>View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            <TableRow>

              <TableCell style={table_content}>INCOMING </TableCell>
              <TableCell style={table_content}>12,3434</TableCell>
              <TableCell style={table_content}>13,2344</TableCell>
              <TableCell style={table_content}>12,3434</TableCell>
              <TableCell style={table_content}>13,2344</TableCell>
              <TableCell style={table_content}><a href='#'><i class="fa fa-search" aria-hidden="true"></i>
              </a></TableCell>
            </TableRow>
            <TableRow>

              <TableCell style={table_content}>OUTGOING </TableCell>
              <TableCell style={table_content}>12,3434</TableCell>
              <TableCell style={table_content}>13,2344</TableCell>
              <TableCell style={table_content}>12,3434</TableCell>
              <TableCell style={table_content}>13,2344</TableCell>
              <TableCell style={table_content}><a href='#'><i class="fa fa-search" aria-hidden="true"></i>
              </a></TableCell>
            </TableRow>
            <TableRow>

              <TableCell style={table_content}>INCOMING </TableCell>
              <TableCell style={table_content}>12,3434</TableCell>
              <TableCell style={table_content}>13,2344</TableCell>
              <TableCell style={table_content}>12,3434</TableCell>
              <TableCell style={table_content}>13,2344</TableCell>
              <TableCell style={table_content}><a href='#'><i class="fa fa-search" aria-hidden="true"></i>
              </a></TableCell>
            </TableRow>
            <TableRow>

              <TableCell style={table_content}>OUTGOING </TableCell>
              <TableCell style={table_content}>12,3434</TableCell>
              <TableCell style={table_content}>13,2344</TableCell>
              <TableCell style={table_content}>12,3434</TableCell>
              <TableCell style={table_content}>13,2344</TableCell>
              <TableCell style={table_content}><a href='#'><i class="fa fa-search" aria-hidden="true"></i>
              </a></TableCell>
            </TableRow>
            <TableRow>

              <TableCell style={table_content}>INCOMING </TableCell>
              <TableCell style={table_content}>12,3434</TableCell>
              <TableCell style={table_content}>13,2344</TableCell>
              <TableCell style={table_content}>12,3434</TableCell>
              <TableCell style={table_content}>13,2344</TableCell>
              <TableCell style={table_content}><a href='#'><i class="fa fa-search" aria-hidden="true"></i>
              </a></TableCell>
            </TableRow>

          </TableBody>
        </Table>
      </TableContainer>

    </>
  )
}

export default Colors
