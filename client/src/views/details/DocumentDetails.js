import React, { useState, useEffect } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import { cilBurger } from '@coreui/icons';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const master_dropdown={
  width: "200px",
  background: "grey",
  outline:'none',
  borderRadius:'2px',
  border:"none",
  fontSize: "11px",
  padding: "8px 0",
  marginTop:"0px",
  marginLeft:"10px",
}
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
const issueBtn = {
  backgroundColor: 'red',
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
const report_block = {
  display: "table",
  marginBottom: "20px",
  position: "fixed",
  zIndex: "500000",
  right: "8px",
  top: "80px",
  "@media (max-width: 1200px)": {
    top: '135px'
  }
}
const report_title = {
  fontSize: "1em",
  color: "#fff",
  textAlign: "right",
  fontWeight: "700",
  margin: "0 20px 20px 0",
  cursor: "pointer",
  width:200, 
}
const report_box= {
  width: "25%",
  background: "url(./list_icon.png) no-repeat",
  backgroundSize: "35px",
  backgroundPosition: "50% 0",
  padding: "50px 15px 0 15px",
  color: "#fff",
  display: "block",
  textAlign: "center",
  fontSize: "0.7em",
  boxShadow: "1px 0px 0 #fff",
  float: "left"
}
const title_text = {
  color: 'white', 
  position: "fixed", 
  top: "87px", 
  left: "85px", 
  zIndex: "1030", 
  fontWeight: "bold",
"@media (max-width: 1200px)": {
  top: '135px'
}}
const zoomRotate_Icon ={
  border: "1px solid #fff", 
  borderRadius: "50px", 
  width: "40px", 
  height: "40px", 
  textAlign: "center", 
  lineHeight: "38px", 
  color: "#fff", 
  display: "table-cell", 
  cursor: "pointer"
}


const DocumentDetails = (props) => {

  console.log('props.history.location.state.data DocumentDetails :>> ', props);

    
  const history = useHistory();
  console.log('history DocumentDetails====', history);

  const [totalPages, setTotalPages] = useState(1);
  const [Isloader, setIsloader] = useState(false);
  const [openReportIssue, setOpenReportIssue] = React.useState(false);
  const [enterIssue, setEnterIssue] = useState(props.history.location.state ? props.history.location.state.errMsg ? props.history.location.state.errMsg:"":"");
  const [isCsvLoading, setIsCsvLoading] = useState(false);
  const [finalDataResult, setFinalDataResult] = useState([]);
  const [pdfImage, setPdfImage] = useState('');
  const [fileType, setFileType] = useState('pdf');
  const [pageNo, setPageNo] = useState(1);
  const [expandScreen, setExpandScreen] = useState(false);
  const [zoomScreen, setZoomScreen] = useState(0);
  const [rotateScreen, setRotateScreen] = useState(0);
  const [value, setValue] = useState(1);
  const [pageNoToShow, setPageNoToShow] = useState("1");
  const [docValidated, setDocValidated] = useState("No");
  const [Toggle, setToggle] = useState(false);
  const [gridObject, setGridObject] = useState();
  const [isPageChange, setIsPageChange] = useState('');
  const [fileName,setFileName]=useState(history.location.state?history.location.state.final_filenames!==undefined?history.location.state.final_filenames.length>0?history.location.state.final_filenames[0]:history.location.state.finalFileName!==undefined?history.location.state.finalFileName:"":history.location.state.finalFileName!==undefined?history.location.state.finalFileName:"":"")

  const compId = useSelector(state => state.companyId)

  console.log('enterIssue :>> ', enterIssue);
  useEffect(() => {
    
      localStorage.setItem('splitPos', 350)
    console.log('object local :>> ', localStorage.getItem("details"));
    console.log('object local :>> ', localStorage.getItem("details") === null);
    let details = JSON.parse(localStorage.getItem("details"))

    console.log("=== history.location.state:::M", props)
    if (history && history.location && history.location.state) {
      
      let docValidatedRec = history.location.state.docStatus? history.location.state.docStatus.toLowerCase() === "validated"?"Yes":"No":"No";
      // this.setState({docValidated:docValidatedRec})
      setDocValidated(docValidatedRec)
    }
    else if (details) {
      console.log("details :::::::: ", details)
      history.location.state = details
    }
    else{
      history.goBack()
    }
   
    
  
    getPdfAndCsv()
    
  }, [])

  useEffect(() => {
    getPdfAndCsv()
  }, [isPageChange])

 useEffect(()=>{
  geCsvData()
 },[fileName])
  const getPdfAndCsv = () => {
    getPdfImage();
    geCsvData();
  }

  const openDialog = () => {
    
    if(props.history.location.state && props.history.location.state.errMsg){
      setEnterIssue(props.history.location.state.errMsg)
    }
    setOpenReportIssue(true)
  };
  const handleClose = () => {
    // this.setState({ openReportIssue: false });
    setOpenReportIssue(false)
  };
  
  const getPdfImage = () => {
    // console.log('props.history.location.state.getPdfImage::',props);
    var pdfFileName = history && history.location && history.location.state  && history.location.state.pdfFilename?history.location.state.pdfFilename:"";
    var processorPath = history && history.location && history.location.state &&  history.location.state.processorContainerPath?history.location.state.processorContainerPath:"";
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
      console.log("==pdfValid==in if under", pdfValid, pageNo)
      setIsloader(true)

      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem('access_token'),
        // reqFrom: "ADMIN",
      };
     let  requestBody = { fileName: pdfFileName, containerPath: processorPath, fileType: fileType, pageNum: pageNo }
      console.log('requestBody :>> ', requestBody);
     axios({
        method: "POST",
        url: settings.serverUrl + "/getPdfFile",
        data: JSON.stringify(requestBody),
        headers,
      }).then((response) => {
        console.log("Respone from post getPdfImage==", response.data.result);

        setIsloader(false)
        if (response.data.err) {
          toast.error(response.data.err, toast_options);
        } else {
          let base64Data = response.data.result.base64Str
          setPdfImage(base64Data)
          setTotalPages(response.data.result.noOfPages)
        }
      }).catch(err => {
        toast.error(err.message, toast_options);
        setIsloader(false)
        console.log("Record Issue Error", err)
        if(err.message.includes("403")){
          localStorage.clear();
          history.push("/");
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
  // console.log(history.location.state.final_filenames,'loaction');
  const geCsvData = () => {
    // var fileName = history.location.state  && history.location.state.finalFileName ?history.location.state.finalFileName:'';
    var processPath = history.location.state  && history.location.state.processorContainerPath ?history.location.state.processorContainerPath:'';
    
    // this.setState({ isCsvLoading: true })
    setIsCsvLoading(true)
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
      let requestBody = { fileName: fileName, processorContainerPath: processPath }
      console.log('requestBody in getCsvData :>> ', requestBody);
      axios({
        method: "POST",
        url: settings.serverUrl + "/finalData",
        data: JSON.stringify(requestBody),
        headers,
      }).then((response) => {
        console.log("Respone from post geCsvData", response.data.result);
        if (response.data.err) {
          // toast.error(response.data.err, toast_options);
          setIsCsvLoading(false)

        } else {
          setFinalDataResult(response.data.result)
          setIsCsvLoading(false)
        }

      }).catch(err => {
        toast.error(err.message, toast_options);
        setIsCsvLoading(false)
        Isloader(false)


        console.log("Record Issue Error", err)
        console.log("Record Issue Error err.message::::", err.message)
        if(err && err.message && err.message.includes("403")){
          localStorage.clear();
          history.push("/");
        }
      });
    // } else {
    //   this.setState({ isCsvLoading: false });
    //   toast.warn("Request is invalid", toast_options);

    // }
  }
  const submit = () => {
    let companyId = localStorage.getItem('companyId')
    console.log("===companyId in DocumentDetails:::", companyId)
    let userId = localStorage.getItem('userId')
    console.log("===userId in DocumentDetails:::", userId)
    if (enterIssue == '' || enterIssue == null || enterIssue == undefined) {
      toast.warn("Please Enter Issue !", toast_options);
    }
    else {
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem('access_token'),
        // reqFrom: "ADMIN",
      };
      let requestBody = {company_id:compId, doc_id: history.location.state.doc_id, errMsg: enterIssue, user_id: userId }
      // console.log("requestBody::::", requestBody)
      axios({
        method: "POST",
        url: settings.serverUrl + "/reportIssue",
        data: JSON.stringify(requestBody),
        headers,
      }).then((response) => {
        console.log("Respone from post ", response);
        setOpenReportIssue(false)
        if (response.data.err) {
          toast.error(response.data.err, toast_options);
        } else {
          toast.success(response.data.result, toast_options);
        }
      }).catch(err => {
        toast.error(err.message, toast_options);
        console.log("Record Issue Error", err)
        if(err.message.includes("403")){
          localStorage.clear();
          history.push("/");
        }
      });

    }

  }

  const downloadPdf = () =>{
    var pdfFileName = history.location.state.pdfFilename;
    var processorPath = history.location.state.processorContainerPath;
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
      console.log("==pdfValid==in if under", pdfValid, pageNo)
      // this.setState({ isLoading: true })
      setIsloader(true)

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

        setIsloader(false)

        if (response.data.err) {
          toast.error(response.data.err, toast_options);
        } else {
          let base64Data = response.data.result;
          const linkSource = `data:application/pdf;base64,${base64Data}`;
          const downloadLink = document.createElement("a");
          downloadLink.href = linkSource;
          downloadLink.download = pdfFileName;
          downloadLink.click();

        }
      }).catch(err => {
        toast.error(err.message, toast_options);
        setIsloader(false)
        console.log("Record Issue Error", err)
        if(err.message.includes("403")){
          localStorage.clear();
          history.push("/");
        }
      });
    } else {
      console.log("==pdfValid==in else", pdfValid)

      setTimeout(() => {
        toast.warn("Request is invalid", toast_options);
        setTimeout(() => {

          history.goBack()
        }, 1000);

      }, 500);

    }

  }

  const validateData = () => {
    let valDoc = docValidated
    // this.setState({docValidated:valDoc === "Yes"?"No":"Yes"},()=>{this.validateDoc()})
    setDocValidated(valDoc === "Yes"?"No":"Yes")
    // validateDoc()
  }

  const validateDoc = () => {
    console.log('You are in validate document:::');
    setIsloader(true)
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem('access_token'),
      // reqFrom: "ADMIN",
    };
    let requestBody = { doc_id: history.location.state.doc_id,validated:docValidated === "Yes"}
    // console.log("requestBody for validate ::::", requestBody)
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
      setIsloader(false)

    }).catch(err => {
      toast.error(err.message, toast_options);
      // console.log("Record Issue Error", err)
      if(err.message.includes("403")){
        localStorage.clear();
        history.push("/");
      }
    });

  }

  const exportFileToCSV = (csv, fileName) => {
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

  const exportCSV = () => {
    let csvFileNameSplited = history.location.state.pdfFilename.split(".");
    let csvFileName = csvFileNameSplited[0];
    //export grid to CSV
    var rng = new wjGrid.CellRange(
        0,
        0,
       gridObject.rows.length - 1,
       gridObject.columns.length - 1
      ),
      csv = gridObject.getClipString(rng, true, true);
      exportFileToCSV(
      csv,
      csvFileName?csvFileName+".csv":"file_"+new Date().getTime()+".csv",
    );
  };

  const changePage = (e) =>{
    //let pageSet = this.state.pageNo;
    let valFromInput = Number(e.target.value)
    if(valFromInput >= 1 && valFromInput <= totalPages){

    setPageNo(valFromInput)
    setPageNoToShow(valFromInput)
    setTimeout(() => {

      setIsPageChange(valFromInput)
    }, 1000);

    // getPdfAndCsv()
    }else{
      setPageNoToShow("")
      toast.info("Request is invalid", toast_options);
    }
  }

 const pageDownClicked = () => {
    if(pageNo >= 2){
    let updatedNum = pageNo - 1;
    console.log("minus page", updatedNum)
    setPageNo(updatedNum)
    setPageNoToShow(updatedNum)
    setIsPageChange(updatedNum)
    // getPdfAndCsv()
    }
    else{
      toast.info("Request is invalid", toast_options);
    }
  }
  const pageUpClicked = () => {
 console.log('pageNo in pageup :>> ', pageNo);
    if(pageNo <= totalPages - 1){
    let updatedNum = pageNo + 1;
    console.log("plus page", updatedNum)
    setPageNo(updatedNum)
    setPageNoToShow(updatedNum)
   console.log('pageNo in after :>> ', pageNo);
   setIsPageChange(updatedNum)
    // getPdfAndCsv()
    
  }
  else{
    toast.info("Request is invalid", toast_options);
  }
}
const sliderClick = () => {
  // this.setState({Toggle:!this.state.Toggle})
  setToggle(!Toggle)
}
const rotatePdf = () => {
    if (rotateScreen >= 4) {
      // this.setState({ rotateScreen: 0 })
      setRotateScreen(0)
    }
    else {
      // this.setState({ rotateScreen: this.state.rotateScreen + 1 })
      setRotateScreen(rotateScreen + 1)
    }
  }
  const zoomIn = () => {
    if (zoomScreen >= 15) {
      // this.setState({ zoomScreen: 15 })
      setZoomScreen(15)
    }
    else {
      // this.setState({ zoomScreen: this.state.zoomScreen + 1 })
      setZoomScreen(zoomScreen + 1)
    }
  }
  const zoomOut = () => {
    if (zoomScreen <= 0) {
      // this.setState({ zoomScreen: 0 })
      setZoomScreen(0)
    }
    else {
      // this.setState({ zoomScreen: this.state.zoomScreen - 1 })
      setZoomScreen(zoomScreen - 1)
    }
  }

  const expandPdf = () => {
    // this.setState({ expandScreen: !this.state.expandScreen })
    setExpandScreen(!expandScreen)
  }

  const initializeGrid = (flex) => {
    setGridObject(flex);
    flex.columnHeaders.rows.defaultSize = 40;
  };
  console.log(typeof(fileName),'filetype')
  return (
    
<CCard style={cardView}>
        <div style={report_block}>
    <h4 style={report_title} onClick={() => sliderClick()}>DOCUMENT REPORT CARD <i class="fa fa-chevron-down" aria-hidden="true"></i></h4>
        {Toggle &&
        <div style={{ width: "400px", padding: "20px", position: "fixed", right: "20px", background: '#8349bf', boxShadow: "0px 4px 6px rgba(0,0,0,0.5)", border: "1px solid #fff", borderRadius: "5px" }}>
                          <div style={report_box}>
                            RECIEVED<br/>
                            {moment(history && history.location && history.location.state && history.location.state.dateRec).format("MM/DD/YYYY hh:mm A")}
                          </div>
                          <div style={report_box}>
                            PROCESSED<br/>
                            {moment(history && history.location && history.location.state && history.location.state.dateProcessed).format("MM/DD/YYYY")}
                          </div>
                          <div style={report_box}>
                            COMPLETED<br/>
                            12/12/21
                          </div>
                          <div style={report_box}>
                            REPORTED<br/>
                            12/12/21
                          </div>
                        </div>
      }
                        </div>
        <CRow style={title_text}>
          {history && history.location && history.location.state && history.location.state && history.location.state.pdfFilename ? history.location.state.pdfFilename : ""}
        </CRow>
        <CRow >
          <CCol>
            <div style={{ background: "rgb(0, 117, 183)", borderRadius: "5px 5px 0 0", position: "fixed", zIndex: "500", right:"30px", left:"30px",
            }}>


                  <div style={{ width: "130px", display: "table", float: "left", border: "1px solid #fff", borderRadius: "5px", textAlign: "center", lineHeight: "40px", margin: "10px", color: "#fff" }}>
                    <div style={{ cursor: "pointer", width: "30px", borderRight: "1px solid #fff", display: "table-cell" }} onClick={() => pageDownClicked()}><i class="fa fa-angle-left" aria-hidden="true" ></i>
                    </div>
                    <div style={{  display: "table-cell", verticalAlign:"middle" }}>
                      <CInput type='text' 
                      value={pageNoToShow} 
                      onChange={changePage}
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
                    <div style={{ cursor: "pointer", width: "30px", borderLeft: "1px solid #fff", display: "table-cell" }} onClick={() => pageUpClicked()}><i class="fa fa-angle-right" aria-hidden="true"></i>
                    </div>

                  </div>
                  <div style={{ whiteSpace: "nowrap", float: "left", color: "#fff", marginTop: "20px" }}>
                    <p>from {totalPages} Pages </p>
                  </div>

                  <div style={{ display: "table", borderSpacing: "10px", float:"right" }}>

                    <div style={{ border: "1px solid #fff", borderRadius: "50px", width: "40px", height: "40px", textAlign: "center", lineHeight: "38px", color: "#fff", display: "table-cell", cursor: "pointer" }}
                      onClick={() => expandPdf()}>
                      {expandScreen ?
                        <i class="fa fa-compress" aria-hidden="true"></i>
                        :
                        <i class="fa fa-expand" aria-hidden="true"></i>
                      }
                    </div>

                    <div style={zoomRotate_Icon} onClick={() => zoomIn()}><i class="fa fa-search-plus" aria-hidden="true"></i></div>
                    <div style={zoomRotate_Icon} onClick={() => zoomOut()}><i class="fa fa-search-minus" aria-hidden="true"></i></div>
                    <div style={zoomRotate_Icon} onClick={() => rotatePdf()}><i class="fa fa-repeat" aria-hidden="true"></i></div>
                    <div style={zoomRotate_Icon}>
                      {/* <a style={{color:'white'}} href={"data:application/pdf;base64," + this.state.pdfImage} download={this.props.history.location.state.data.pdfFilename ? this.props.history.location.state.data.pdfFilename : "file_"+new Date().getTime()+".pdf"}>
                      <i class="fa fa-download" aria-hidden="true"></i>
                      </a> */}
                      <a style={{color:'white'}}  onClick={() => downloadPdf()}>
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
                  width: expandScreen ? "100%" : "615px",
                  transform: (rotateScreen == 1 && "rotate(90deg)" || rotateScreen == 2 && "rotate(180deg)" || rotateScreen == 3 && "rotate(270deg)" || rotateScreen == 4 && "rotate(0deg)"),
                  margin: "0px auto",
                  position: "relative"
                }}
              >
                <div style={{
                  position: "absolute",
                  width: "100%",
                  margin: "0px auto",
                  top: (zoomScreen == 1 && "2.8em" || zoomScreen == 2 && "5.7em" || zoomScreen == 3 && "8.5em" || zoomScreen == 4 && "11.3em" || zoomScreen == 5 && "14em" || zoomScreen == 6 && "16.9em" || zoomScreen == 7 && "19.7em" || zoomScreen == 8 && "22.5em" || zoomScreen == 9 && "25.4em" || zoomScreen == 10 && "28.2em" || zoomScreen == 11 && "31em" || zoomScreen == 12 && "33.8em" || zoomScreen == 13 && "36.6em" || zoomScreen == 14 && "39.4em" || zoomScreen == 15 && "42.2em"),
                  transform: (zoomScreen == 1 && "scale(1.1)" || zoomScreen == 2 && "scale(1.2)" || zoomScreen == 3 && "scale(1.3)" || zoomScreen == 4 && "scale(1.4)" || zoomScreen == 5 && "scale(1.5)" || zoomScreen == 6 && "scale(1.6)" || zoomScreen == 7 && "scale(1.7)" || zoomScreen == 8 && "scale(1.8)" || zoomScreen == 9 && "scale(1.9)" || zoomScreen == 10 && "scale(2)" || zoomScreen == 11 && "scale(2.1)" || zoomScreen == 12 && "scale(2.2)" || zoomScreen == 13 && "scale(2.3)" || zoomScreen == 14 && "scale(2.4)" || zoomScreen == 15 && "scale(2.5)")
                }}>

                  <div style={
                   Isloader ? { ...pdfContentView, ...{ boxShadow: "none" } } : pdfContentView
                  }>

                    {/* <img src={"data:image/jpeg;base64," + this.state.pdfImage} style={{width:500,height:700}}/> */}
                    {pdfImage ?

                      <Document

                        file={"data:application/pdf;base64," + pdfImage}
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
                        <TableCell style={table_headerMain}><p style={dateTimeView}>Date/Time Received:{moment(props.history && props.history.location && props.history.location.state && props.history.location.state.dateRec).format("MM/DD/YYYY hh:mm A")}</p></TableCell>
                        <TableCell style={table_headerMain}><p style={dateTimeView}>Date/Time Processed:{moment( props.history && props.history.location && props.history.location.state && props.history.location.state.dateProcessed).format("MM/DD/YYYY hh:mm A")}</p></TableCell>
                        <TableCell style={table_headerMain}><p style={dateTimeView}># of Pages:{props.history && props.history.location && props.history.location.state && props.history.location.state.noOfPages}</p></TableCell>
                        <TableCell style={table_headerMain}>
                          <Button style={viewDetailBtn}
                            onClick={() => {
                              localStorage.setItem("details", JSON.stringify(history.location.state))    
                              history.push({
                                // pathname: '/detail/' + props.history.location.state?props.history.location.state.data.doc_id:'',
                                pathname: '/detail/' + history.location.state.doc_id,

                                state: {
                                  // fileName: props.history.location.state?props.history.location.state.data.pdfFilename:'',
                                  // containerPath: props.history.location.state?props.history.location.state.data.processorContainerPath:''
                                  fileName: history.location.state?history.location.state.pdfFilename:'',
                                  containerPath: history.location.state?history.location.state.processorContainerPath:''


                                }
                              })
                            }}>VIEW DETAILS</Button>
                        </TableCell>
                        {history.location.state && history.location.state.docStatus == "Error" ?
                        <TableCell style={table_headerMain}>
                          <Button style={issueBtn}
                            onClick={() => openDialog()}>REPORT ISSUE</Button>
                        </TableCell>:
                        <TableCell style={table_headerMain}>
                        <Button style={viewDetailBtn}
                          onClick={() => openDialog()}>REPORT ISSUE</Button>
                      </TableCell>}
                        <TableCell style={historyIssueBtn}>
                          <Button style={viewDetailBtn}
                            // onClick={() => history.push("/issueHistory")}
                            onClick={() => {
                              
                              history.push("/issueHistory")}}
                          >
                            ISSUE HISTORY
                          </Button>
                        </TableCell>
                        <TableCell style={historyIssueBtn}>
                          <Button style={viewDetailBtn}
                          //onClick={() => this.props.history.push("/issueHistory")}
                          onClick={() => exportCSV()}
                          >
                            Export Data &nbsp;  <i class="fa fa-download" aria-hidden="true"></i>
                          </Button>
                        </TableCell>
                        <TableCell style={historyIssueBtn}>
                          <Button style={viewDetailBtn} 
                          startIcon= {docValidated.toLowerCase() === "yes"?<CheckIcon/>:<ClearIcon/>}
                          // color={this.state.docValidated?"green":"red"}
                          onClick={() => validateData()}
                          >
                          VALIDATE
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        {openReportIssue && <Dialog open={openReportIssue}
                          onClose={handleClose}>
                          <DialogTitle>Issue Detail</DialogTitle>
                          <DialogContent style={{ minWidth: 500 }}>
                            <DialogContentText>
                              <TextField id="outlined-basic" value={enterIssue} label="Enter Issue" multiline={true} type="text" variant="outlined" style={{ width: "100%" }}
                                // onChange={this.handleClickReportIssue}
                                onChange={e => setEnterIssue(e.target.value)}
                              />
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <div style={{ flexDirection: 'row' }}>
                              <Button style={cancel_dialogBtn} onClick={handleClose}>Cancel</Button>
                              <Button style={submit_dialogBtn} onClick={submit}>Submit</Button>
                            </div>
                          </DialogActions>
                        </Dialog>}


                      </TableRow>

                    </TableHead>
                  </Table>
                </TableContainer>
                
                {Object.keys(finalDataResult).length > 0 ?
                <Grid className="container-fluid">
                  
                  {history.location.state.final_filenames!==undefined?(<>
                 { history.location.state.final_filenames.length>0&&
                   <select
            style={{marginTop:'10px',height:'40px'}}
            onChange={(e)=>setFileName(e.target.value)}
            >
            {history.location.state.final_filenames.map((curr, index) => {
              return (
                <>
                  <option >{curr}</option>
                </>
              );
            })}
           </select> 
} </>):''}
                <Grid item xs={12} style={{ marginTop: 25}}>
                <FlexGrid
                      headersVisibility="Column"
                      autoGenerateColumns={false}
                      itemsSource={finalDataResult}
                      initialized={initializeGrid}
                      // ref={this.theGrid}
                      style={{
                        height: "auto",
                        maxHeight: 400,
                        margin: 0,
                      }}
                    >
                      {finalDataResult.length>0 && Object.keys(finalDataResult[0]).map(key =>
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
               {(!isCsvLoading) ? "No record Found!!" : ""}
             </p></div>
              }
              </div>
            </SplitPane>
          </CCol>
          {(Isloader || isCsvLoading) &&
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
export default withStyles(doc_styles, { withTheme: true })(DocumentDetails);
