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
import { connect } from 'react-redux'
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
import CircularProgress from "@material-ui/core/CircularProgress";
import { width } from '@mui/system';
import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';

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
  // borderBottom: '2px solid #D2D9DA',
  color: "rgb(142, 142, 142)",
  fontSize: 12,
  width: 200
}
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
const cardView = {
  backgroundColor: 'transparent',
  border: 0
}
const pdfContentView = {
  boxShadow: '0px 4px 32px 1px #00000029',
  // height: 800,
  maxHeight: 800,
  marginTop: 10,
  marginLeft: 'auto',
  marginRight: 'auto',
}
const bottom_View = {
  backgroundColor: '#fff',
  padding: 20,
  maxHeight: 400,
  overflowY: 'scroll'
}
const dateTimeView = {
  fontSize: 12,
  //width: 250
}
const viewDetailBtn = {
  backgroundColor: '#4EA7D8',
  fontSize: 14, color: 'white',
  width: 130
}
const historyIssueBtn = {
  borderBottom: "1px solid #ccc",
  color: "#2352a2",
  fontSize: 10,
  marginRight: 40
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
class DocumentDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      openReportIssue: false,
      enterIssue: '',
      IncomingArr: [],
      isLoading: false,
      isCsvLoading: false,
      ShowError: false,
      finalDataResult: {},
      pdfImage: '',
      fileType: 'pdf',
      pageNo: 1,
      numPages: null,
      pageNumber: 1,
      width: 0


    }
  }
  componentDidMount = () => {

    localStorage.setItem('splitPos', 350)
    let details = JSON.parse(localStorage.getItem("details"))
    console.log("=== history.location.state:::", this.props)
    if (this.props.history.location && this.props.history.location.state && this.props.history.location.state.data) {
      this.getPdfImage();
      this.geCsvData();
    }
    else if (details) {
      this.props.history.location.state = details
      this.getPdfImage();
      this.geCsvData();
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
  // componentDidMount() {


  //   localStorage.setItem('splitPos', 350)
  //   console.log("=== history.location.state:::", this.props.history.location.state.data)
  // }


  onPageLoad = ({ numPages }) => {
    console.log("==info==", numPages)
    this.setState({ numPages: numPages, pageNumber: this.state.pageNumber })
    // const {
    //   height, width, originalHeight, originalWidth
    // } = info;
    // console.log(height, width, originalHeight, originalWidth);
  }
  getPdfImage = () => {
    var pdfFileName = this.props.history.location.state.data.pdfFilename;
    var processorPath = this.props.history.location.state.data.processorContainerPath;
    var pdfValid = true;
    console.log("==pdfFileName==", pdfFileName)
    console.log("==processorPath==", processorPath)


    if (pdfFileName) {

    } else {
      pdfValid = false
      // toast.warning("FileName is invalid", toast_options);
    }
    if (processorPath) {

    } else {
      pdfValid = false
      // toast.warning("FileName is invalid", toast_options);
    }

    if (pdfValid) {
      console.log("==pdfValid==in if under", pdfValid)
      this.setState({ isLoading: true })

      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem('access_token'),
        // reqFrom: "ADMIN",
      };
      axios({
        method: "POST",
        url: settings.serverUrl + "/getPdfFile",
        data: JSON.stringify({ fileName: pdfFileName, containerPath: processorPath, fileType: this.state.fileType, pageNum: this.state.pageNo }),
        headers,
      }).then((response) => {
        console.log("Respone from post getPdfImage==", response.data.result);
        if (response.data.err) {
          // alert(response.data.err);
          toast.error(response.data.err, toast_options);
        } else {
          this.setState({ pdfImage: response.data.result, isLoading: false })
        }
      }).catch(err => {
        toast.error(err.message, toast_options);
        this.setState({ isLoading: false })
        console.log("Record Issue Error", err)
      });
    } else {
      console.log("==pdfValid==in else", pdfValid)

      setTimeout(() => {
        toast.warn("Request is invalid", toast_options);
        setTimeout(() => {

          this.props.history.goBack()
        }, 1000);

      }, 500);

    }
  }
  geCsvData = () => {
    // console.log("===You are in geCsvData")
    var fileName = this.props.history.location.state.data.finalFileName;
    var processPath = this.props.history.location.state.data.processorContainerPath;
    this.setState({ isCsvLoading: true })
    var dataValid = true;
    if (fileName) {

    } else {
      dataValid = false
      // toast.warn("FileName is invalid", toast_options);
    }
    if (processPath) {

    } else {
      dataValid = false
      // toast.warn("FileName is invalid", toast_options);
    }
    if (dataValid) {
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem('access_token'),
        // reqFrom: "ADMIN",
      };
      axios({
        method: "POST",
        url: settings.serverUrl + "/finalData",
        data: JSON.stringify({ fileName: fileName, processorContainerPath: processPath }),
        headers,
      }).then((response) => {
        console.log("Respone from post geCsvData", response.data.result);
        if (response.data.err) {
          // alert(response.data.err);
          toast.error(response.data.err, toast_options);
        } else {
          this.setState({ finalDataResult: response.data.result, isCsvLoading: false })
        }
      }).catch(err => {
        toast.error(err.message, toast_options);
        this.setState({ isCsvLoading: false })

        console.log("Record Issue Error", err)
      });
    } else {
      this.setState({ isCsvLoading: false });
      toast.warn("Request is invalid", toast_options);

    }
  }
  submit = () => {
    let companyId = localStorage.getItem('companyId')
    console.log("===companyId in DocumentDetails:::", companyId)
    let userId = localStorage.getItem('userId')
    console.log("===userId in DocumentDetails:::", userId)
    if (this.state.enterIssue == '' || this.state.enterIssue == null || this.state.enterIssue == undefined) {
      toast.warn("Please Enter Issue !", toast_options);
    }
    else {
      const headers = {
        "Content-Type": "application/json",
        // Authorization: "Bearer " + logginUser.token,
        // reqFrom: "ADMIN",
      };
      let requestBody = { doc_id: this.props.history.location.state.data.doc_id, errMsg: this.state.enterIssue, user_id: userId }
      console.log("requestBody::::", requestBody)
      axios({
        method: "POST",
        url: settings.serverUrl + "/reportIssue",
        data: JSON.stringify(requestBody),
        headers,
      }).then((response) => {
        console.log("Respone from post ", response);
        this.setState({ openReportIssue: false, })
        if (response.data.err) {
          // alert(response.data.err); 
          toast.error(response.data.err, toast_options);
        } else {
          // alert(response.data.result);
          toast.success(response.data.result, toast_options);
        }
      }).catch(err => {
        toast.error(err.message, toast_options);
        console.log("Record Issue Error", err)
      });

    }

  }



  render() {
    let dateRec = moment(this.props && this.props.history && this.props.history.location && this.props.history.location.state && this.props.history.location.state.data.dateRec).format("MM/DD/YYYY hh:mm A");
    let dateProcessed = moment(this.props && this.props.history && this.props.history.location && this.props.history.location.state && this.props.history.location.state.data.dateProcessed).format("MM/DD/YYYY hh:mm A");
    let noOfPages = this.props && this.props.history && this.props.history.location && this.props.history.location.state && this.props.history.location.state.data.noOfPages;
    const screenWidth = window.innerWidth;
    // console.log("screenWidth====",screenWidth);
    return (
      <CCard style={cardView}>
        <CRow style={{ color: 'white', position: "fixed", top: "108px", left: "85px", zIndex: "1030", fontWeight: "bold" }}>
          {this.props.history.location.state.data.pdfFilename ? this.props.history.location.state.data.pdfFilename : ""}
        </CRow>
        <CRow>
          <CCol>
            <div style={{ width: "100%", maxWidth: "612px", background: "rgb(108,108,108)", margin: "0px auto -9px auto" }}>
              <CRow>
                <CCol xs="6">
                  <div style={{ width: "100px", display: "table", border: "1px solid #999", borderRadius: "5px", textAlign: "center", lineHeight: "40px", margin: "10px", color: "#fff" }}>
                    <div style={{ cursor: "pointer", width: "30px", borderRight: "1px solid #999", display: "table-cell" }}><i class="fa fa-angle-left" aria-hidden="true"></i>
                    </div>
                    <div style={{ width: "40px", display: "table-cell" }}>1</div>
                    <div style={{ cursor: "pointer", width: "30px", borderLeft: "1px solid #999", display: "table-cell" }}><i class="fa fa-angle-right" aria-hidden="true"></i>
                    </div>

                  </div>
                  <div style={{ whiteSpace: "nowrap" }}>
                    From 11 Pages
                  </div>
                </CCol>

                <CCol xs="6">
                  <div style={{ display: "table", borderSpacing: "10px" }}>
                    <div style={{ border: "1px solid #999", borderRadius: "50px", width: "40px", height: "40px", textAlign: "center", lineHeight: "38px", color: "#fff", display: "table-cell", cursor: "pointer" }}><i class="fa fa-expand" aria-hidden="true"></i></div>
                    <div style={{ border: "1px solid #999", borderRadius: "50px", width: "40px", height: "40px", textAlign: "center", lineHeight: "38px", color: "#fff", display: "table-cell", cursor: "pointer" }}><i class="fa fa-search-plus" aria-hidden="true"></i></div>
                    <div style={{ border: "1px solid #999", borderRadius: "50px", width: "40px", height: "40px", textAlign: "center", lineHeight: "38px", color: "#fff", display: "table-cell", cursor: "pointer" }}><i class="fa fa-search-minus" aria-hidden="true"></i></div>
                    <div style={{ border: "1px solid #999", borderRadius: "50px", width: "40px", height: "40px", textAlign: "center", lineHeight: "38px", color: "#fff", display: "table-cell", cursor: "pointer" }}><i class="fa fa-repeat" aria-hidden="true"></i></div>
                    <div style={{ border: "1px solid #999", borderRadius: "50px", width: "40px", height: "40px", textAlign: "center", lineHeight: "38px", color: "#fff", display: "table-cell", cursor: "pointer" }}><i class="fa fa-download" aria-hidden="true"></i></div>
                  </div>
                </CCol>
              </CRow>
            </div>
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

              <div style={this.state.isLoading ? { ...pdfContentView, ...{ boxShadow: "none" } } : pdfContentView}>
                <p>Page {this.state.pageNumber} of {this.state.numPages}  </p>
                {/* <img src={"data:image/jpeg;base64," + this.state.pdfImage} style={{width:500,height:700}}/> */}
                {this.state.pdfImage ?

                  <Document onLoadSuccess={this.onPageLoad}
                    file={"data:application/pdf;base64,JVBERi0xLjIgCjkgMCBvYmoKPDwKPj4Kc3RyZWFtCkJULyA5IFRmKFRlc3QpJyBFVAplbmRzdHJlYW0KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCA1IDAgUgovQ29udGVudHMgOSAwIFIKPj4KZW5kb2JqCjUgMCBvYmoKPDwKL0tpZHMgWzQgMCBSIF0KL0NvdW50IDEKL1R5cGUgL1BhZ2VzCi9NZWRpYUJveCBbIDAgMCA5OSA5IF0KPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1BhZ2VzIDUgMCBSCi9UeXBlIC9DYXRhbG9nCj4+CmVuZG9iagp0cmFpbGVyCjw8Ci9Sb290IDMgMCBSCj4+CiUlRU9G"
                      // + 
                      //this.state.pdfImage
                    }
                  // file='https://dgsciense.s3.amazonaws.com/raw_invoices_hubspot/6085ca5e0c876f667d354cb0.pdf'
                  // onLoadSuccess={page => console.log('page onLoadSuccess:>> ', page)}
                  // onLoadError={(error) => console.log('pdf error :>> ', error)}
                  >
                    <Page pageNumber={1} />
                  </Document>

                  :
                  <p>loading PDF</p>

                }

              </div>

              <div style={bottom_View}>
                {/* <i class="fa-window-minimize" aria-hidden="true" style={{width:100,height:15,backgroundColor:'#4EA7D8',position:'absolute',left:(screenWidth/2)-50,top:-8}} ></i> */}
                <div style={{ width: 100, height: 15, backgroundColor: '#4EA7D8', position: 'absolute', left: (screenWidth / 2) - 50, top: -8 }}></div>
                <TableContainer component={Paper} style={{ position: "relative", zIndex: "5", overflow: 'hidden' }}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell style={table_headerMain}><p style={dateTimeView}>Date/Time Received:{dateRec}</p></TableCell>
                        <TableCell style={table_headerMain}><p style={dateTimeView}>Date/Time Processed:{dateProcessed}</p></TableCell>
                        <TableCell style={table_headerMain}><p style={dateTimeView}># of Pages:{noOfPages}</p></TableCell>
                        <TableCell style={table_headerMain}>
                          <Button style={viewDetailBtn}
                            onClick={() => {
                              localStorage.setItem("details", JSON.stringify(this.props.history.location.state))
                              this.props.history.push({
                                pathname: '/detail/' + this.props.history.location.state.data.doc_id,
                                state: {
                                  fileName: this.props.history.location.state.data.pdfFilename,
                                  containerPath: this.props.history.location.state.data.processorContainerPath
                                }
                              })

                            }}>VIEW DETAILS</Button>
                        </TableCell>
                        <TableCell style={table_headerMain}>
                          <Button style={viewDetailBtn}
                            onClick={() => this.openDialog()}>REPORT ISSUE</Button>
                        </TableCell>
                        <TableCell style={historyIssueBtn}>
                          <Button style={viewDetailBtn}
                            onClick={() => this.props.history.push("/issueHistory")}
                          >
                            ISSUE HISTORY
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        {this.state.openReportIssue && <Dialog open={this.state.openReportIssue}
                          onClose={this.handleClose}>
                          <DialogTitle>Issue Detail</DialogTitle>
                          <DialogContent style={{ minWidth: 500 }}>
                            <DialogContentText>
                              <TextField id="outlined-basic" label="Enter Issue" multiline={true} type="text" variant="outlined" style={{ width: "100%" }}
                                onChange={this.handleClickReportIssue}
                              />
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <div style={{ flexDirection: 'row' }}>
                              <Button style={cancel_dialogBtn} onClick={this.handleClose}>Cancel</Button>
                              <Button style={submit_dialogBtn} onClick={this.submit}>Submit</Button>
                            </div>
                          </DialogActions>
                        </Dialog>}


                      </TableRow>

                    </TableHead>
                  </Table>
                </TableContainer>
                {Object.keys(this.state.finalDataResult).length > 0 ?
                  <TableContainer component={Paper} style={{ position: "relative", zIndex: "5" }}>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          {
                            Object.keys(this.state.finalDataResult).map(key =>
                              <TableCell style={table_header}>{key}</TableCell>
                            )
                          }
                        </TableRow>
                      </TableHead>


                      <TableBody>
                        <TableRow>
                          {
                            Object.keys(this.state.finalDataResult).map((key, idex) => {
                              return <TableCell>
                                {
                                  this.state.finalDataResult[key].map((vObj, vIdx) => {
                                    return <div style={table_content}><strong>{vObj}</strong> </div>
                                  })
                                }
                              </TableCell>
                            })
                          }
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer> :
                  <p style={{ width: "100%", display: "block", color: "#c00", margin: "12px 0", textAlign: "center", fontSize: "1.6em" }}>
                    {(!this.state.isCsvLoading) ? "No record Found!!" : ""}
                  </p>
                }

              </div>
            </SplitPane>
          </CCol>
          {this.state.isLoading || this.state.isCsvLoading &&
            <div style={loader}>

              <CircularProgress style={{ margin: "26% auto", display: "block" }} />

            </div>
          }
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
      </CCard >
    );
  }
}
// export default connect(
//   null,
//   mapDispatchToProps()
// )(DocumentDetails);

export default
  (DocumentDetails)