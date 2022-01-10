import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const table_header = {
  borderBottom: "1px solid #ccc",
  color: "#2352a2",
  fontSize: "1.2em"
}
const table_content = {
  borderBottom: "1px dashed #ccc",
  color: "rgb(142, 142, 142)"
}

const Dashboard = () => {
  return (
    <>
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

export default Dashboard
