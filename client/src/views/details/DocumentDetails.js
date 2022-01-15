import React from 'react'
import {
  CCard,
  CCol,
  CProgress,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import SplitPane, { Pane } from 'react-split-pane';
import './document.css';
// import './demo.txt';
import { Document, Page, pdfjs } from 'react-pdf';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router";
import moment from 'moment';
import settings from 'src/config/settings';
import axios from "axios";






pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const table_header = {
  borderBottom: "1px solid #ccc",
  color: "#000000",
  fontSize: 12,
  fontWeight: 'bold'
}
const table_headerMain = {
  borderBottom: "1px solid #ccc",
  color: "#2352a2",
  fontSize: 10
}
const table_content = {
  borderBottom: "1px dashed #ccc",
  color: "rgb(142, 142, 142)",
  fontSize: 10
}
const cancel_dialogBtn = {
  backgroundColor:'#4EA7D8',
  fontSize:14,
  color:'white'
}
const submit_dialogBtn = {
  backgroundColor:'#4EA7D8',
  fontSize:14,color:'white',
  marginLeft:10
}


class DocumentDetails extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      openReportIssue: false,
      enterIssue:'',
      IncomingArr:[]

      
    }
  }
  openDialog = () => {
    this.setState({ openReportIssue: true });
  };

  handleClose = () => {
    this.setState({ openReportIssue: false });
  };
  handleClickReportIssue = (e) => {
    this.setState({ enterIssue: e.target.value });
  }
  componentDidMount() {
    localStorage.setItem('splitPos', 350)
    console.log("=== history.location.state:::",this.props.history.location.state.data)
    // if(history.location && history.location.state){
    // console.log("=== history.location.state:::",history.location.state)

    // }
  }
  onPageLoad(info) {
    const {
      height, width, originalHeight, originalWidth
    } = info;
    console.log(height, width, originalHeight, originalWidth);
  }
  submit = () => {
    console.log("===Submit Click:::")
    if(this.state.enterIssue == '' || this.state.enterIssue == null || this.state.enterIssue == undefined){
      alert("Please Enter Issue !");
     }
     else{
      
      const headers = {
        "Content-Type": "application/json",
        // Authorization: "Bearer " + logginUser.token,
        // reqFrom: "ADMIN",
      };
      axios({
        method: "POST",
        url: settings.serverUrl + "/reportIssue",
        data: JSON.stringify({ doc_id: this.props.history.location.state.data.doc_id ,errMsg:this.state.enterIssue}),
        headers,
      }).then((response) => {
        console.log("Respone from post ", response);
        this.setState({ openReportIssue: false, })
        if (response.data.err) {
          alert(response.data.err);
        }else{
          alert(response.data.result);
        }

      })
     }
  }
  render() {

    // console.log("this.state", this.state);
    // const { Sdate } = this.props.Sdate
    // const { Edate } = this.props.Edate
    // let dateRec = this.props.history.location.state.data.dateRec;
    // console.log("===dateRec:::",dateRec)
    let dateRec = moment(this.props && this.props.history && this.props.history.location && this.props.history.location.state &&  this.props.history.location.state.data.dateRec).format("MM/DD/YYYY hh:mm A");
    let dateProcessed = moment(this.props && this.props.history && this.props.history.location && this.props.history.location.state &&  this.props.history.location.state.data.dateProcessed).format("MM/DD/YYYY hh:mm A");
    let noOfPages = this.props && this.props.history && this.props.history.location && this.props.history.location.state && this.props.history.location.state.data.noOfPages;


    return (
      <CCard style={{ backgroundColor: 'transparent', border: 0 }}>
        <CRow>
          <CCol>
            <SplitPane
              split="horizontal"
              minSize={70}
              defaultSize={parseInt(localStorage.getItem('splitPos'), 10)}
              onChange={(size) => {
                if (size < 1000) {
                  localStorage.setItem('splitPos', size)
                }
              }}
              style={{ position: "static", backgroundColor: 'transparent' }}
            >
              <div style={{ boxShadow: '0px 4px 32px 1px #00000029', height: 800, maxHeight: 800, marginTop: 10, marginLeft: 'auto', marginRight: 'auto' }}>
                <Document
                  // file = 'JVBERi0xLjMNCiXi48/TDQoNCjEgMCBvYmoNCjw8DQovVHlwZSAvQ2F0YWxvZw0KL091dGxpbmVzIDIgMCBSDQovUGFnZXMgMyAwIFINCj4+DQplbmRvYmoNCg0KMiAwIG9iag0KPDwNCi9UeXBlIC9PdXRsaW5lcw0KL0NvdW50IDANCj4+DQplbmRvYmoNCg0KMyAwIG9iag0KPDwNCi9UeXBlIC9QYWdlcw0KL0NvdW50IDINCi9LaWRzIFsgNCAwIFIgNiAwIFIgXSANCj4+DQplbmRvYmoNCg0KNCAwIG9iag0KPDwNCi9UeXBlIC9QYWdlDQovUGFyZW50IDMgMCBSDQovUmVzb3VyY2VzIDw8DQovRm9udCA8PA0KL0YxIDkgMCBSIA0KPj4NCi9Qcm9jU2V0IDggMCBSDQo+Pg0KL01lZGlhQm94IFswIDAgNjEyLjAwMDAgNzkyLjAwMDBdDQovQ29udGVudHMgNSAwIFINCj4+DQplbmRvYmoNCg0KNSAwIG9iag0KPDwgL0xlbmd0aCAxMDc0ID4+DQpzdHJlYW0NCjIgSg0KQlQNCjAgMCAwIHJnDQovRjEgMDAyNyBUZg0KNTcuMzc1MCA3MjIuMjgwMCBUZA0KKCBBIFNpbXBsZSBQREYgRmlsZSApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY4OC42MDgwIFRkDQooIFRoaXMgaXMgYSBzbWFsbCBkZW1vbnN0cmF0aW9uIC5wZGYgZmlsZSAtICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjY0LjcwNDAgVGQNCigganVzdCBmb3IgdXNlIGluIHRoZSBWaXJ0dWFsIE1lY2hhbmljcyB0dXRvcmlhbHMuIE1vcmUgdGV4dC4gQW5kIG1vcmUgKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NTIuNzUyMCBUZA0KKCB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDYyOC44NDgwIFRkDQooIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjE2Ljg5NjAgVGQNCiggdGV4dC4gQW5kIG1vcmUgdGV4dC4gQm9yaW5nLCB6enp6ei4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjA0Ljk0NDAgVGQNCiggbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDU5Mi45OTIwIFRkDQooIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNTY5LjA4ODAgVGQNCiggQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA1NTcuMTM2MCBUZA0KKCB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBFdmVuIG1vcmUuIENvbnRpbnVlZCBvbiBwYWdlIDIgLi4uKSBUag0KRVQNCmVuZHN0cmVhbQ0KZW5kb2JqDQoNCjYgMCBvYmoNCjw8DQovVHlwZSAvUGFnZQ0KL1BhcmVudCAzIDAgUg0KL1Jlc291cmNlcyA8PA0KL0ZvbnQgPDwNCi9GMSA5IDAgUiANCj4+DQovUHJvY1NldCA4IDAgUg0KPj4NCi9NZWRpYUJveCBbMCAwIDYxMi4wMDAwIDc5Mi4wMDAwXQ0KL0NvbnRlbnRzIDcgMCBSDQo+Pg0KZW5kb2JqDQoNCjcgMCBvYmoNCjw8IC9MZW5ndGggNjc2ID4+DQpzdHJlYW0NCjIgSg0KQlQNCjAgMCAwIHJnDQovRjEgMDAyNyBUZg0KNTcuMzc1MCA3MjIuMjgwMCBUZA0KKCBTaW1wbGUgUERGIEZpbGUgMiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY4OC42MDgwIFRkDQooIC4uLmNvbnRpbnVlZCBmcm9tIHBhZ2UgMS4gWWV0IG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NzYuNjU2MCBUZA0KKCBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY2NC43MDQwIFRkDQooIHRleHQuIE9oLCBob3cgYm9yaW5nIHR5cGluZyB0aGlzIHN0dWZmLiBCdXQgbm90IGFzIGJvcmluZyBhcyB3YXRjaGluZyApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY1Mi43NTIwIFRkDQooIHBhaW50IGRyeS4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NDAuODAwMCBUZA0KKCBCb3JpbmcuICBNb3JlLCBhIGxpdHRsZSBtb3JlIHRleHQuIFRoZSBlbmQsIGFuZCBqdXN0IGFzIHdlbGwuICkgVGoNCkVUDQplbmRzdHJlYW0NCmVuZG9iag0KDQo4IDAgb2JqDQpbL1BERiAvVGV4dF0NCmVuZG9iag0KDQo5IDAgb2JqDQo8PA0KL1R5cGUgL0ZvbnQNCi9TdWJ0eXBlIC9UeXBlMQ0KL05hbWUgL0YxDQovQmFzZUZvbnQgL0hlbHZldGljYQ0KL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcNCj4+DQplbmRvYmoNCg0KMTAgMCBvYmoNCjw8DQovQ3JlYXRvciAoUmF2ZSBcKGh0dHA6Ly93d3cubmV2cm9uYS5jb20vcmF2ZVwpKQ0KL1Byb2R1Y2VyIChOZXZyb25hIERlc2lnbnMpDQovQ3JlYXRpb25EYXRlIChEOjIwMDYwMzAxMDcyODI2KQ0KPj4NCmVuZG9iag0KDQp4cmVmDQowIDExDQowMDAwMDAwMDAwIDY1NTM1IGYNCjAwMDAwMDAwMTkgMDAwMDAgbg0KMDAwMDAwMDA5MyAwMDAwMCBuDQowMDAwMDAwMTQ3IDAwMDAwIG4NCjAwMDAwMDAyMjIgMDAwMDAgbg0KMDAwMDAwMDM5MCAwMDAwMCBuDQowMDAwMDAxNTIyIDAwMDAwIG4NCjAwMDAwMDE2OTAgMDAwMDAgbg0KMDAwMDAwMjQyMyAwMDAwMCBuDQowMDAwMDAyNDU2IDAwMDAwIG4NCjAwMDAwMDI1NzQgMDAwMDAgbg0KDQp0cmFpbGVyDQo8PA0KL1NpemUgMTENCi9Sb290IDEgMCBSDQovSW5mbyAxMCAwIFINCj4+DQoNCnN0YXJ0eHJlZg0KMjcxNA0KJSVFT0YNCg=='
                  file='https://dgsciense.s3.amazonaws.com/raw_invoices_hubspot/6085ca5e0c876f667d354cb0.pdf'
                  onLoadSuccess={page => console.log('page onLoadSuccess:>> ', page)}
                  onLoadError={(error) => console.log('pdf error :>> ', error)}
                >
                  <Page pageNumber={1} onLoadSuccess={this.onPageLoad} />
                </Document>
              </div>
              <div style={{ backgroundColor: '#fff', padding: 20 }}>
               
                <TableContainer component={Paper} style={{ position: "relative", zIndex: "5" }}>
                <Table aria-label="simple table">
                <TableHead>
                <TableRow>
                {/* <TableCell style={table_header}><i class="fa fa-bell" aria-hidden="true"></i></TableCell>
                <TableCell style={table_header}><i class="fa fa-sticky-note" aria-hidden="true"></i></TableCell> */}
                <TableCell style={table_headerMain}><p style={{fontSize:12,width:250}}>Date/Time Received:{dateRec}</p></TableCell>
                <TableCell style={table_headerMain}><p style={{fontSize:12,width:250}}>Date/Time Processed:{dateProcessed}</p></TableCell>
                <TableCell style={table_headerMain}><p style={{fontSize:12,width:250}}># of Pages:{noOfPages}</p></TableCell>
                <TableCell style={table_headerMain}>
                <Button style={{backgroundColor:'#4EA7D8',fontSize:14,color:'white',width:170}}
                onClick = {()=>{this.props.history.push('/detail/'+ this.props.history.location.state.data.doc_id)}}>VIEW DETAILS</Button>
                </TableCell>
                <TableCell style={table_headerMain}>
                <Button style={{backgroundColor:'#4EA7D8',fontSize:14,color:'white',width:170}}
                onClick = {()=>this.openDialog()}>REPORT ISSUE</Button>
                </TableCell>             
                </TableRow>
                <TableRow>
                <Dialog open={this.state.openReportIssue}
                onClose={this.handleClose}>
                <DialogTitle>Issue Detail</DialogTitle>
                <DialogContent style={{minWidth:500}}>
                <DialogContentText>
                <TextField id="outlined-basic" label="Enter Issue" multiline={true} type="text" variant="outlined" style={{ width: "100%" }}
                          onChange={this.handleClickReportIssue}
                        />
               </DialogContentText>
              </DialogContent>
              <DialogActions>
              <div style={{flexDirection:'row'}}>
              <Button style={cancel_dialogBtn} onClick={this.handleClose}>Cancel</Button>
              <Button style={submit_dialogBtn} onClick={this.submit}>Submit</Button>
              </div>
              </DialogActions>
              </Dialog>
              {/* <TableCell style={table_header}><i class="fa fa-bell" aria-hidden="true"></i></TableCell>
              <TableCell style={table_header}><i class="fa fa-sticky-note" aria-hidden="true"></i></TableCell> */}
              <TableCell style={table_header}>Operator ID</TableCell>
              <TableCell style={table_header}>Operator Name</TableCell>
              <TableCell style={table_header}>Operator Name</TableCell>
              <TableCell style={table_header}>Operator Name</TableCell>
              <TableCell style={table_header}>Check Number</TableCell>
              <TableCell style={table_header}>Check Date</TableCell>
              <TableCell style={table_header}>Check Amount</TableCell>
              <TableCell style={table_header}>Operator CC</TableCell>
              <TableCell style={table_header}>Partener CC</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

              {/* <TableCell style={table_content}><a href='#' style={{ color: "#c00" }}><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></a></TableCell>
              <TableCell style={table_content}><a href='#' style={{ color: "#ccc" }}><i class="fa fa-search-plus" aria-hidden="true"></i></a></TableCell> */}
              <TableCell style={table_content}><strong>INCOMING</strong> </TableCell>
              <TableCell style={table_content}>CHECKS ENVERUS</TableCell>
              <TableCell style={table_content}><strong>INCOMING</strong> </TableCell>
              <TableCell style={table_content}>CHECKS ENVERUS</TableCell>
              <TableCell style={table_content}>12/21/21 10:30 AM</TableCell>
              <TableCell style={table_content}>12/21/21 10:30 AM</TableCell>
              <TableCell style={table_content}>3</TableCell>
              <TableCell style={table_content}>PROCESSED</TableCell>
          </TableBody>
        </Table>
      </TableContainer>
              </div>
            </SplitPane>
          </CCol>
        </CRow>
      </CCard>
    );
  }
}
export default DocumentDetails
