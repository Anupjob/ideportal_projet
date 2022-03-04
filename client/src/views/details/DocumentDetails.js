import React, {createRef} from 'react'
import {
  CCard,
  CCol,
  CInput,
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
import 'react-toastify/dist/ReactToastify.min.css';
import * as wjCore from '@grapecity/wijmo';
import { FlexGrid, FlexGridColumn, FlexGridCellTemplate } from '@grapecity/wijmo.react.grid';
import * as wjFilter from "@grapecity/wijmo.react.grid.filter";
// import * as wjGrid from '@grapecity/wijmo.react.grid';
import * as wjGrid from "@grapecity/wijmo.grid";
import '@grapecity/wijmo.styles/wijmo.css';
import * as wjcCore from "@grapecity/wijmo";
import Grid from "@material-ui/core/Grid";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
// import docStyle from "./docDetailStyle.css"
import { doc_styles } from "./documentDetailStyle";
import { withStyles } from "@material-ui/core/styles";

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
  marginRight: 'auto'
}
const bottom_View = {
  backgroundColor: '#fff',
  padding: 20,
  maxHeight: 600,
  // overflowY: 'scroll'
}
const dateTimeView = {
  fontSize: 12,
  //width: 250
}
const viewDetailBtn = {
  backgroundColor: '#4EA7D8',
  fontSize: 14,
  color: 'white',
  whiteSpace: "nowrap",
  margin: "10px"
}
const historyIssueBtn = {
  borderBottom: "1px solid #ccc",
  color: "#2352a2",
  fontSize: 10
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
const drag_arrow = {
  textAlign: "center",
  position: "absolute",
  zIndex: "0",
  width: "100%",
  display: "table",
  top: "-20px",
  fontSize: "1.8em",
  color: "#000"
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
      finalDataResult: [],
      pdfImage: '',
      fileType: 'pdf',
      pageNo: 1,
      expandScreen: false,
      zoomScreen: 0,
      rotateScreen: 0,
      docValidated:false,
      value: 1,
      pageNoToShow:"1",
      docValidated:"No",
      Toggle:false
    }

      // this.gridObject = null;
      this.theGrid = createRef();
    }

  componentDidMount = () => {

    localStorage.setItem('splitPos', 350)
    console.log('object local :>> ', localStorage.getItem("details"));
    console.log('object local :>> ', localStorage.getItem("details") === null);
    let details = JSON.parse(localStorage.getItem("details"))

    console.log("=== history.location.state:::", this.props)
    if (this.props.history.location && this.props.history.location.state && this.props.history.location.state.data) {
      
    //  let docValidatedRec = this.props.history.location.state.data.docValidated? this.props.history.location.state.data.docValidated:"No";
      let docValidatedRec = this.props.history.location.state.data.docStatus? this.props.history.location.state.data.docStatus.toLowerCase() === "validated"?"Yes":"No":"No";
      this.setState({docValidated:docValidatedRec})
    }
    else if (details) {
      this.props.history.location.state = details
    }

    this.getPdfAndCsv()

  }

  getPdfAndCsv = () => {
    this.getPdfImage();
    this.geCsvData();
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

    // if (pdfValid) {
      console.log("==pdfValid==in if under", pdfValid, this.state.pageNo)
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

        let stateToUpdate = { isLoading: false  }
        if (response.data.err) {
          // alert(response.data.err);
          toast.error(response.data.err, toast_options);
        } else {
          let base64Data = response.data.result.base64Str
          stateToUpdate["pdfImage"] = base64Data;
          stateToUpdate["totalPages"] = response.data.result.noOfPages;
        }
        this.setState(stateToUpdate)
      }).catch(err => {
        toast.error(err.message, toast_options);
        this.setState({ isLoading: false })
        console.log("Record Issue Error", err)
        if(err.message.includes("403")){
          localStorage.clear();
          this.props.history.push("/");
        }
      });
    // } else {
    //   console.log("==pdfValid==in else", pdfValid)

    //   setTimeout(() => {
    //     toast.warn("Request is invalid", toast_options);
    //     setTimeout(() => {

    //       this.props.history.goBack()
    //     }, 1000);

    //   }, 500);

    // }
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
    // if (dataValid) {
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
          this.setState({ isCsvLoading: false })

        } else {
          this.setState({ finalDataResult: response.data.result, isCsvLoading: false })
        }

      }).catch(err => {
        toast.error(err.message, toast_options);
        this.setState({ isCsvLoading: false, isLoading: false })

        console.log("Record Issue Error", err)
        console.log("Record Issue Error err.message::::", err.message)
        if(err && err.message && err.message.includes("403")){
          localStorage.clear();
          this.props.history.push("/");
        }
      });
    // } else {
    //   this.setState({ isCsvLoading: false });
    //   toast.warn("Request is invalid", toast_options);

    // }
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
        Authorization: "Bearer " + localStorage.getItem('access_token'),
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
        if(err.message.includes("403")){
          localStorage.clear();
          this.props.history.push("/");
        }
      });

    }

  }

  downloadPdf = () =>{
    var pdfFileName = this.props.history.location.state.data.pdfFilename;
    var processorPath = this.props.history.location.state.data.processorContainerPath;
    var pdfValid = true;
    // console.log("==pdfFileName==", pdfFileName)
    // console.log("==processorPath==", processorPath)


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
      console.log("==pdfValid==in if under", pdfValid, this.state.pageNo)
      this.setState({ isLoading: true })

      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem('access_token'),
        // reqFrom: "ADMIN",
      };
      axios({
        method: "POST",
        url: settings.serverUrl + "/downloadPdf",
        data: JSON.stringify({ fileName: pdfFileName, containerPath: processorPath }),
        headers,
      }).then((response) => {
        console.log("Respone from post downloadPdf==", response.data.result);

        let stateToUpdate = { isLoading: false  }
        if (response.data.err) {
          // alert(response.data.err);
          toast.error(response.data.err, toast_options);
        } else {
          let base64Data = response.data.result;
          const linkSource = `data:application/pdf;base64,${base64Data}`;
          const downloadLink = document.createElement("a");
          downloadLink.href = linkSource;
          downloadLink.download = pdfFileName;
          downloadLink.click();

        }
        this.setState(stateToUpdate)
      }).catch(err => {
        toast.error(err.message, toast_options);
        this.setState({ isLoading: false })
        console.log("Record Issue Error", err)
        if(err.message.includes("403")){
          localStorage.clear();
          this.props.history.push("/");
        }
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

  validateData = () => {
    let valDoc = this.state.docValidated
    this.setState({docValidated:valDoc === "Yes"?"No":"Yes"},()=>{this.validateDoc()})
  }

  validateDoc = () => {
    this.setState({ isLoading: true })
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem('access_token'),
      // reqFrom: "ADMIN",
    };
    let requestBody = { doc_id: this.props.history.location.state.data.doc_id,validated:this.state.docValidated === "Yes"}
    console.log("requestBody for validate ::::", requestBody)
    axios({
      method: "POST",
      url: settings.serverUrl + "/validateDoc",
      data: JSON.stringify(requestBody),
      headers,
    }).then((response) => {
      console.log("Response on validate Api:::::",response)
      if (response.data.err) {
        // alert(response.data.err);
        toast.error(response.data.err, toast_options);
      } else {

      }
      this.setState({ isLoading: false })

    }).catch(err => {
      toast.error(err.message, toast_options);
      // console.log("Record Issue Error", err)
      if(err.message.includes("403")){
        localStorage.clear();
        this.props.history.push("/");
      }
    });

  }

  exportFileToCSV = (csv, fileName) => {
    var fileType = "txt/csv;charset=utf-8";
    if (navigator.msSaveBlob) {
      // IE
      navigator.msSaveBlob(
        new Blob([csv], {
          type: fileType,
        }),
        fileName
      );
    } else {
      var e = document.createElement("a");
      e.setAttribute(
        "href",
        "data:" + fileType + "," + encodeURIComponent(csv)
      );
      e.setAttribute("download", fileName);
      e.style.display = "none";
      document.body.appendChild(e);
      e.click();
      document.body.removeChild(e);
    }
  };

  exportCSV = () => {

    this.setState({ isLoading: true })
    let csvFileNameSplited = this.props.history.location.state.data.pdfFilename.split(".");
    let csvFileName = csvFileNameSplited[0];
    //export grid to CSV
    var rng = new wjGrid.CellRange(
        0,
        0,
        this.gridObject.rows.length - 1,
        this.gridObject.columns.length - 1
      ),
      csv = this.gridObject.getClipString(rng, true, true);
      this.exportFileToCSV(
      csv,
      csvFileName?csvFileName+".csv":"file_"+new Date().getTime()+".csv",
      this.setState({ isLoading: true })
    );
  };

  changePage = (e) =>{
    //let pageSet = this.state.pageNo;

    let valFromInput = Number(e.target.value)
    if(valFromInput >= 1 && valFromInput <= this.state.totalPages){

      this.setState({pageNo: valFromInput, pageNoToShow :valFromInput}, () => this.getPdfAndCsv());
    }else{
      this.setState({pageNoToShow: ""});
      toast.info("Request is invalid", toast_options);
    }
  }

  pageDownClicked = () => {
    if(this.state.pageNo >= 2){
    let updatedNum = this.state.pageNo - 1;
    console.log("minus page", updatedNum)
    this.setState({ pageNo: updatedNum, pageNoToShow :updatedNum }, () => this.getPdfAndCsv())
    }
    else{
      toast.info("Request is invalid", toast_options);
    }
  }
  pageUpClicked = () => {
    if(this.state.pageNo <= this.state.totalPages - 1){
    let updatedNum = this.state.pageNo + 1;
    console.log("plus page", updatedNum)
    this.setState({ pageNo: updatedNum, pageNoToShow :updatedNum }, () => this.getPdfAndCsv())
  }
  else{
    toast.info("Request is invalid", toast_options);
  }
}
sliderClick = () => {
  this.setState({Toggle:!this.state.Toggle})
}
  rotatePdf = () => {
    if (this.state.rotateScreen >= 4) {
      this.setState({ rotateScreen: 0 })
    }
    else {
      this.setState({ rotateScreen: this.state.rotateScreen + 1 })
    }
  }
  zoomIn = () => {
    if (this.state.zoomScreen >= 15) {
      this.setState({ zoomScreen: 15 })
    }
    else {
      this.setState({ zoomScreen: this.state.zoomScreen + 1 })
    }
  }
  zoomOut = () => {
    if (this.state.zoomScreen <= 0) {
      this.setState({ zoomScreen: 0 })
    }
    else {
      this.setState({ zoomScreen: this.state.zoomScreen - 1 })
    }
  }

  expandPdf = () => {
    this.setState({ expandScreen: !this.state.expandScreen })
  }

  initializeGrid = (gridObj) =>{
    // flex.rows.defaultSize = 40;
    this.gridObject = gridObj;
  }
  render() {
    console.log('this.state.docValidated :>> ', this.state.docValidated);
    const { classes } = this.props;

    let dateRec = moment(this.props && this.props.history && this.props.history.location && this.props.history.location.state && this.props.history.location.state.data.dateRec).format("MM/DD/YYYY hh:mm A");
    let dateProcessed = moment(this.props && this.props.history && this.props.history.location && this.props.history.location.state && this.props.history.location.state.data.dateProcessed).format("MM/DD/YYYY hh:mm A");
    let dateRec2 = moment(this.props && this.props.history && this.props.history.location && this.props.history.location.state && this.props.history.location.state.data.dateRec).format("MM/DD/YYYY");
    let dateProcessed2 = moment(this.props && this.props.history && this.props.history.location && this.props.history.location.state && this.props.history.location.state.data.dateProcessed).format("MM/DD/YYYY");
    let noOfPages = this.props && this.props.history && this.props.history.location && this.props.history.location.state && this.props.history.location.state.data.noOfPages;
    console.log("expand", this.state)
    return (
      <CCard style={cardView}>
        <div className={classes.report_block}>
<h4 className={classes.report_title} onClick={() => this.sliderClick()}>DOCUMENT REPORT CARD <i class="fa fa-chevron-down" aria-hidden="true"></i>
</h4>
{this.state.Toggle &&
        <div style={{ width: "400px", padding: "20px", position: "fixed", right: "20px", background: '#8349bf', boxShadow: "0px 4px 6px rgba(0,0,0,0.5)", border: "1px solid #fff", borderRadius: "5px" }}>
                          <div className={classes.report_box}>
                            RECIEVED<br/>
                            {dateRec2}
                          </div>
                          <div className={classes.report_box}>
                            PROCESSED<br/>
                            {dateProcessed2}
                          </div>
                          <div className={classes.report_box}>
                            COMPLETED<br/>
                            12/12/21
                          </div>
                          <div className={classes.report_box} style={{ boxShadow: "none" }}>
                            REPORTED<br/>
                            12/12/21
                          </div>
                        </div>
  }
                        </div>
        <CRow className={classes.title_text }>
          {this.props.history.location &&this.props.history.location.state && this.props.history.location.state.data.pdfFilename ? this.props.history.location.state.data.pdfFilename : ""}
        </CRow>
        <CRow >
          <CCol>
            <div style={{ background: "rgb(0, 117, 183)", borderRadius: "5px 5px 0 0", position: "fixed", zIndex: "500", right:"30px", left:"30px",
            }}>


                  <div style={{ width: "130px", display: "table", float: "left", border: "1px solid #fff", borderRadius: "5px", textAlign: "center", lineHeight: "40px", margin: "10px", color: "#fff" }}>
                    <div style={{ cursor: "pointer", width: "30px", borderRight: "1px solid #fff", display: "table-cell" }} onClick={() => this.pageDownClicked()}><i class="fa fa-angle-left" aria-hidden="true" ></i>
                    </div>
                    <div style={{  display: "table-cell", verticalAlign:"middle" }}>
                      <CInput type='text' 
                      value={this.state.pageNoToShow} 
                      onChange={this.changePage}
                      style={{
                        background: "none",
                        color: "#fff",
                        borderRadius: "0",
                        margin: "3px auto",
                        width: "50px",
                        border: "1px solid #fff",
                        textAlign:"center"
                      }}
                      />
                      </div>
                    <div style={{ cursor: "pointer", width: "30px", borderLeft: "1px solid #fff", display: "table-cell" }} onClick={() => this.pageUpClicked()}><i class="fa fa-angle-right" aria-hidden="true"></i>
                    </div>

                  </div>
                  <div style={{ whiteSpace: "nowrap", float: "left", color: "#fff", marginTop: "20px" }}>
                    <p>from {this.state.totalPages} Pages </p>
                  </div>

                  <div style={{ display: "table", borderSpacing: "10px", float:"right" }}>

                    <div style={{ border: "1px solid #fff", borderRadius: "50px", width: "40px", height: "40px", textAlign: "center", lineHeight: "38px", color: "#fff", display: "table-cell", cursor: "pointer" }}
                      onClick={() => this.expandPdf()}>
                      {this.state.expandScreen ?
                        <i class="fa fa-compress" aria-hidden="true"></i>
                        :
                        <i class="fa fa-expand" aria-hidden="true"></i>
                      }
                    </div>

                    <div style={{ border: "1px solid #fff", borderRadius: "50px", width: "40px", height: "40px", textAlign: "center", lineHeight: "38px", color: "#fff", display: "table-cell", cursor: "pointer" }} onClick={() => this.zoomIn()}><i class="fa fa-search-plus" aria-hidden="true"></i></div>
                    <div style={{ border: "1px solid #fff", borderRadius: "50px", width: "40px", height: "40px", textAlign: "center", lineHeight: "38px", color: "#fff", display: "table-cell", cursor: "pointer" }} onClick={() => this.zoomOut()}><i class="fa fa-search-minus" aria-hidden="true"></i></div>
                    <div style={{ border: "1px solid #fff", borderRadius: "50px", width: "40px", height: "40px", textAlign: "center", lineHeight: "38px", color: "#fff", display: "table-cell", cursor: "pointer" }} onClick={() => this.rotatePdf()}><i class="fa fa-repeat" aria-hidden="true"></i></div>
                    <div style={{ border: "1px solid #fff", borderRadius: "50px", width: "40px", height: "40px", textAlign: "center", lineHeight: "38px", color: "#fff", display: "table-cell", cursor: "pointer" }}>
                      {/* <a style={{color:'white'}} href={"data:application/pdf;base64," + this.state.pdfImage} download={this.props.history.location.state.data.pdfFilename ? this.props.history.location.state.data.pdfFilename : "file_"+new Date().getTime()+".pdf"}>
                      <i class="fa fa-download" aria-hidden="true"></i>
                      </a> */}
                      <a style={{color:'white'}}  onClick={() => this.downloadPdf()}>
                      <i class="fa fa-download" aria-hidden="true"></i>
                      </a>
                    </div>
                  </div>

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
              style={{ position: "static", backgroundColor: 'transparent', marginTop:"60px" }}
            >
              <div
                style={{
                  overflowY:"auto",
                  overflowX:"hidden",
                  width: this.state.expandScreen ? "100%" : "615px",
                  transform: (this.state.rotateScreen == 1 && "rotate(90deg)" || this.state.rotateScreen == 2 && "rotate(180deg)" || this.state.rotateScreen == 3 && "rotate(270deg)" || this.state.rotateScreen == 4 && "rotate(0deg)"),
                  margin: "0px auto",
                  position: "relative"
                }}
              >
                <div style={{
                  position: "absolute",
                  width: "100%",
                  margin: "0px auto",
                  top: (this.state.zoomScreen == 1 && "2.8em" || this.state.zoomScreen == 2 && "5.7em" || this.state.zoomScreen == 3 && "8.5em" || this.state.zoomScreen == 4 && "11.3em" || this.state.zoomScreen == 5 && "14em" || this.state.zoomScreen == 6 && "16.9em" || this.state.zoomScreen == 7 && "19.7em" || this.state.zoomScreen == 8 && "22.5em" || this.state.zoomScreen == 9 && "25.4em" || this.state.zoomScreen == 10 && "28.2em" || this.state.zoomScreen == 11 && "31em" || this.state.zoomScreen == 12 && "33.8em" || this.state.zoomScreen == 13 && "36.6em" || this.state.zoomScreen == 14 && "39.4em" || this.state.zoomScreen == 15 && "42.2em"),
                  transform: (this.state.zoomScreen == 1 && "scale(1.1)" || this.state.zoomScreen == 2 && "scale(1.2)" || this.state.zoomScreen == 3 && "scale(1.3)" || this.state.zoomScreen == 4 && "scale(1.4)" || this.state.zoomScreen == 5 && "scale(1.5)" || this.state.zoomScreen == 6 && "scale(1.6)" || this.state.zoomScreen == 7 && "scale(1.7)" || this.state.zoomScreen == 8 && "scale(1.8)" || this.state.zoomScreen == 9 && "scale(1.9)" || this.state.zoomScreen == 10 && "scale(2)" || this.state.zoomScreen == 11 && "scale(2.1)" || this.state.zoomScreen == 12 && "scale(2.2)" || this.state.zoomScreen == 13 && "scale(2.3)" || this.state.zoomScreen == 14 && "scale(2.4)" || this.state.zoomScreen == 15 && "scale(2.5)")
                }}>

                  <div style={
                    this.state.isLoading ? { ...pdfContentView, ...{ boxShadow: "none" } } : pdfContentView
                  }>

                    {/* <img src={"data:image/jpeg;base64," + this.state.pdfImage} style={{width:500,height:700}}/> */}
                    {this.state.pdfImage ?

                      <Document

                        file={"data:application/pdf;base64," + this.state.pdfImage}
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
                </div>
              </div>

              <div style={bottom_View}>
                <div style={drag_arrow}><i class="fa fa-arrows-v" aria-hidden="true"></i></div>
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
                        <TableCell style={historyIssueBtn}>
                          <Button style={viewDetailBtn}
                          //onClick={() => this.props.history.push("/issueHistory")}
                          onClick={() => this.exportCSV()}
                          >
                            Export Data &nbsp;  <i class="fa fa-download" aria-hidden="true"></i>
                          </Button>
                        </TableCell>
                        <TableCell style={historyIssueBtn}>
                          <Button style={viewDetailBtn} 
                          startIcon= {this.state.docValidated.toLowerCase() === "yes"?<CheckIcon/>:<ClearIcon/>}
                          // color={this.state.docValidated?"green":"red"}
                          onClick={() => {this.validateData()}}
                          >
                          Validate
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
                
                {/* {Object.keys(this.state.finalDataResult).length > 0 ?
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
                } */}
                {Object.keys(this.state.finalDataResult).length > 0 ?
                <Grid className="container-fluid">
                <Grid item xs={12} style={{ marginTop: 25}}>
             
                    <FlexGrid
                      headersVisibility="Column"
                      autoGenerateColumns={false}
                      itemsSource={this.state.finalDataResult}
                      initialized={this.initializeGrid}
                      ref={this.theGrid}
                      style={{
                        height: "auto",
                        maxHeight: 400,
                        margin: 0,
                      }}
                    >
                      {this.state.finalDataResult.length>0 && Object.keys(this.state.finalDataResult[0]).map(key =>
                      <FlexGridColumn
                      binding={key}
                      header={key}
                      cssClass="cell-header"
                      width="*"
                      minWidth={100}
                      // visible={key != "user_id"}
                      style={{backgroundColor:'grey'}}
                      ></FlexGridColumn>
                      )}  

                      <wjFilter.FlexGridFilter></wjFilter.FlexGridFilter>
                    </FlexGrid>
                </Grid>
              </Grid>:
              <div style={{height:300}}> <p style={{ width: "100%", display: "block", color: "#c00", margin: "12px 0", textAlign: "center", fontSize: "1.6em" }}>
               {(!this.state.isCsvLoading) ? "No record Found!!" : ""}
             </p></div>
              }
              </div>
            </SplitPane>
          </CCol>
          {(this.state.isLoading || this.state.isCsvLoading) &&
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

// export default
//   (DocumentDetails)
export default withStyles(doc_styles, { withTheme: true })(DocumentDetails);