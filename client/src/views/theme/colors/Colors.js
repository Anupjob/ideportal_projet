import React, { useEffect, useState, createRef } from 'react'
import classNames from 'classnames'
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
import { useSelector, useDispatch } from 'react-redux';
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
  outline: "5px dashed #4ea7d8",
  textIndent: "-200px",
  padding: "50px 0",
  borderRadius: "30px",
  background: "none",
  border: "none",
  position: "relative",
  zIndex: "1"
}
const upload_text = {
  width: "100%",
  textAlign: "center",
  fontSize: "1.4em",
  marginTop: "-65px",
  marginBottom: "35px",
  color: "#b3b3b3"
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
        <CForm>
          <CRow>
            <CCol md="9">
              <CInput type='file' style={upload_file} placeholder='sdsdfs' />
              <div style={upload_text}>Drag or Upload files</div>
            </CCol>
            <CCol md="3">
              <CButton color="primary" size="lg" style={{ width: "100%", background: "#4ea7d8", border: "#4ea7d8", marginTop: "25px" }}> Upload File</CButton>
            </CCol>
          </CRow>
        </CForm>
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
