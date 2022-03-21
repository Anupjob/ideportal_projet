import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCol,
  CInput,
  CProgress,
  CRow,
  CCardBody,
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
import ViewOptions from './ViewOptions';
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
  // borderBottom: "1px solid #ccc",
  color: "#000000",
  fontSize: 12,
  fontWeight: 'bold'
}
const table_headerMain = {
  borderBottom: "none",
 color: "#2352a2",
 fontSize: 10,
 paddingTop:"0",
 paddingBottom:"0"
 // borderRight: "1px solid #ccc",
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
  fontSize: 14,
  color: 'white',
  background: 'none', 
          fontSize: "24px",
          color: "#fff",
          position: "absolute",
          top: "4px",
          right:"0"
}
const cancel_dialogValidateBtn = {
  backgroundColor: '#4EA7D8',
  fontSize: 14,
  color: 'white',
  marginRight:20,
  marginBottom:10
}
const submit_dialogBtn = {
  backgroundColor: '#4EA7D8',
  fontSize: 14, color: 'white',
  marginRight: "15px"
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
  borderTop:"#ccc solid 1px" 
  // overflowY: 'scroll'
}
const dateTimeView = {
  fontSize: 12,
  // color:"#999",
  margin:0,
  whiteSpace:"nowrap"

  //width: 250
}
const viewDetailBtn = {
  background: 'none',
  fontSize: "1em",
  color: '#999',
  whiteSpace: "nowrap",
  margin: "0 10px",
  cursor:'pointer'
}
const issueBtn = {
  backgroundColor: 'red',
  fontSize: 14,
  color: 'white',
  whiteSpace: "nowrap",
  margin: "10px"
}
const historyIssueBtn = {
  borderBottom: "none",
  color: "#2352a2",
  fontSize: 10,
  borderLeft: "1px solid #ccc",
  paddingTop:"0",
  paddingBottom:"0"
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
  zIndex: "1030;",
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
  borderRadius: "50px", 
  width: "30px", 
  // height: "40px", 
  textAlign: "center", 
  // lineHeight: "38px", 
  color: "#486fb4", 
  display: "table-cell", 
  cursor: "pointer",
  fontSize: "1.3em"
}


const DocumentDetails = (props) => {

  console.log('props.history.location.state.data DocumentDetails :>> ', props);

    
  const history1 = useHistory();
  console.log('history DocumentDetails====', history1);

  const [totalPages, setTotalPages] = useState(1);
  const [Isloader, setIsloader] = useState(false);
  const [openReportIssue, setOpenReportIssue] = React.useState(false);
  const [enterIssue, setEnterIssue] = useState(props.history.location.state ? props.history.location.state.errMsg ?props.history.location.state.errMsg.issue ? props.history.location.state.errMsg.issue:"":"":"");
  const [isCsvLoading, setIsCsvLoading] = useState(false);
  const [finalDataResult, setFinalDataResult] = useState([]);
  const [pdfImage, setPdfImage] = useState('');
  const [fileType, setFileType] = useState('pdf');
  const [pageNo, setPageNo] = useState(1);
  const [expandScreen, setExpandScreen] = useState(false);
  const [zoomScreen, setZoomScreen] = useState(0);
  // const [rotateScreen, setRotateScreen] = useState(0);
  const [value, setValue] = useState(1);
  const [pageNoToShow, setPageNoToShow] = useState("1");
  const [docValidated, setDocValidated] = useState("No");
  const [Toggle, setToggle] = useState(false);
  const [gridObject, setGridObject] = useState();
  const [isPageChange, setIsPageChange] = useState('');
  // const [fileName,setFileName]=useState(history.location.state?history.location.state.final_filenames!==undefined?history.location.state.final_filenames.length>0?history.location.state.final_filenames[0]:history.location.state.finalFileName!==undefined?history.location.state.finalFileName:"":history.location.state.finalFileName!==undefined?history.location.state.finalFileName:"":"")
  const [csvFileName,setCsvFileName]=useState('')
  const [openValidateData, setOpenValidateData] = React.useState(false);
  const [validData, setValidData] = useState({});
  const [reportIsuueCells, setReportIsuueCells] = useState({});
  const [newreportIsuueCells, setNewReportIsuueCells] = useState({})
  const [flagissue,setFlagIssue]=useState(false)
  const [ListVal, setList] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [canvasBackground, setCanvasBackground] = useState(null);
  const [displayAll, setDisplayAll] = useState(false);
  const [externalLinkTarget, setExternalLinkTarget] = useState(null);
  const [file, setFile] = useState(null);
  const [fileForProps, setFileForProps] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageHeight, setPageHeight] = useState(null);
  const [pageNumber, setPageNumber] = useState(null);
  const [pageScale, setPageScale] = useState(null);
  const [pageWidth, setPageWidth] = useState(null);
  const [passMethod, setPassMethod] = useState(null);
  const [render, setRender] = useState(true);
  const [renderAnnotationLayer, setRenderAnnotationLayer] = useState(true);
  const [renderForms, setRenderForms] = useState(true);
  const [renderMode, setRenderMode] = useState('canvas');
  const [renderTextLayer, setRenderTextLayer] = useState(true);
  const [openReportResolve, setOpenReportResolve] = React.useState(false);
console.log(finalDataResult,'newCells')
  const compId = useSelector(state => state.companyId)
  let details = JSON.parse(localStorage.getItem("Deatails"))

  const history=details.history
  console.log(details,history,'history')
  console.log('enterIssue :>> ', enterIssue);
  useEffect(() => {
    
      localStorage.setItem('splitPos', 350)
    console.log('object local :>> ', history && history);
    console.log('object local :>> ', localStorage.getItem("details") === null);
    let details = JSON.parse(localStorage.getItem("details"))

    console.log("=== history.location.state:::M", props)
    console.log("reportcells", reportIsuueCells)
    if (history && history.location && history.location.state) {
      
      let docValidatedRec = history.location.state.docStatus? history.location.state.docStatus.toLowerCase() === "validated"?"Yes":"No":"No";
      setDocValidated(docValidatedRec)

      let reportIsuueCellsRec = history.location.state.errMsg && history.location.state.errMsg.reportIsuueCells? history.location.state.errMsg.reportIsuueCells: {};
      setReportIsuueCells(reportIsuueCellsRec);

    }
    
    else if (details) {
      console.log("details :::::::: ", details)
      history.location.state = details
    }
    // else{
    //   history.goBack()
    // } 
    console.log('final_filenames in useEffect :>>', history.location.state?history.location.state.final_filenames!==undefined?history.location.state.final_filenames.length>0?history.location.state.final_filenames[0]:history.location.state.finalFileName!==undefined?history.location.state.finalFileName:"":history.location.state.finalFileName!==undefined?history.location.state.finalFileName:"":"");
    // getPdfAndCsv()
 
    
  }, [])

  useEffect(() => {
    getPdfAndCsv()
  }, [isPageChange])

 useEffect(()=>{
  geCsvData()
 },[csvFileName])

 useEffect(()=>{
//    var flex =new FlexGrid()
//   flex.itemFormatter = function(panel, r, c, cell) {
//     console.log(panel, 5, 5, cell,'celllssss')

//     // if(reportIsuueCells && !_.isEmpty(reportIsuueCells))
//     let arr = Object.keys(reportIsuueCells)
//   for(var i=0;i<arr.length;i++){
//     let row = arr[i]
//     let rowIdx = row.substring(3)
     
//     let colArr = reportIsuueCells[arr[i]]

//     colArr.map((cObj)=>{
//       let col = cObj
//       let cIdx = col.substring(3)
// // remove text      
// if(c===cIdx&&r===rowIdx){
//         cell.innerHTML='<div class="diff-up">' + cell.innerHTML + '</div>'
//        }
//     })
    
//   }
//  }



// gridObject.itemFormatter = function(panel, r, c, cell) {
//   console.log(Object.keys( reportIsuueCells),'celllssss')

//   if(reportIsuueCells &&  Object.keys( reportIsuueCells).length !== 0){
//   let arr = Object.keys(reportIsuueCells)
// for(var i=0;i<arr.length;i++){
//   let row = arr[i]
//   let rowIdx = row.substring(3)
   
//   let colArr = reportIsuueCells[arr[i]]

//   colArr.map((cObj)=>{
//     let col = cObj
//     let cIdx = col.substring(3)
//     console.log(rowIdx,cIdx,'row column')
// // remove text      
// if(c==cIdx&&r==rowIdx){
// return(<>
//       {cell.innerHTML='<div class="diff-up">' + cell.innerHTML + '</div>'}
//       </> )
//      }
//   })
  
// }
// }
// }

},[reportIsuueCells]);

  const getPdfAndCsv = () => {
    getPdfImage();
    geCsvData();
  }

  const openDialog = () => {
    
    if(props.history.location.state && props.history.location.state.errMsg.issue){
      setEnterIssue(props.history.location.state.errMsg.issue)
    }
    setOpenReportIssue(true)
  };
  const resolveDialog=()=>{
    // setOpenReportResolve(true)
    submitResolve()
  }
  const resolvehandleClose = () => {
    // this.setState({ openReportIssue: false });
    setOpenReportResolve(false)
  };
  const handleClose = () => {
    // this.setState({ openReportIssue: false });
    setOpenReportIssue(false)
  };
  const handleValidateClose = () => {
    setOpenValidateData(false)
  }
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

    let fileName = ""
    if(csvFileName && csvFileName.length>0){
      fileName = csvFileName
      console.log('fileName geCsvData in if', fileName);
    }else if(history.location.state && 
      history.location.state.final_filenames && 
      history.location.state.final_filenames.length>0){
        fileName = history.location.state.final_filenames[0]
      console.log('fileName geCsvData in else if', fileName);

    }else if(history.location.state && 
      history.location.state.finalFileName){
        fileName = history.location.state.finalFileName
      console.log('fileName geCsvData in else if===', fileName);

    }

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

      let issueCells = reportIsuueCells;
      if(Object.keys(reportIsuueCells).length>0&&Object.keys(newreportIsuueCells).length>0){
        issueCells = newreportIsuueCells;
      }
      console.log(issueCells,'cells isuuses')
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem('access_token'),
        // reqFrom: "ADMIN",
      };
      let requestBody = {company_id:compId, doc_id: history.location.state.doc_id, errMsg: {issue: enterIssue, reportIsuueCells:issueCells}, user_id: userId }
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
          setFlagIssue(true)
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
  const submitResolve=()=>{
  
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem('access_token'),
      // reqFrom: "ADMIN",
    };
    // let requestBody = {resolve: resolveInput}
    // console.log("requestBody::::", requestBody)
    axios({
      method: "POST",
      url: settings.serverUrl + "/resolveIssue",
      // data: JSON.stringify(requestBody),
      headers,
    }).then((response) => {
      console.log("Respone from post ", response);
      // setOpenReportResolve(false)
      if (response.data.err) {
        toast.error(response.data.err, toast_options);
      } else {
        toast.success(response.data.result, toast_options);
        // setFlagIssue(true)
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
        // setTimeout(() => {

        //   history.goBack()
        // }, 1000);

      }, 500);

    }

  }

  const validateData = () => {
    // let valDoc = docValidated
    // this.setState({docValidated:valDoc === "Yes"?"No":"Yes"},()=>{this.validateDoc()})
    // setDocValidated(valDoc === "Yes"?"No":"Yes")
    if(compId == "619d2b75087f9c908ccf1835"){
      validateDoc()
    }
  }

  const validateDoc = () => {
    var processPath = history.location.state  && history.location.state.processorContainerPath ?history.location.state.processorContainerPath:'';
    setIsloader(true)
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem('access_token'),
      // reqFrom: "ADMIN",
    };
    let fileName = ""
    if(csvFileName && csvFileName.length>0){
      fileName = csvFileName
    }else if(history.location.state && 
      history.location.state.final_filenames && 
      history.location.state.final_filenames.length>0){
        fileName = history.location.state.final_filenames[0]
    }else if(history.location.state && 
      history.location.state.finalFileName){
        fileName = history.location.state.finalFileName
    }

    // let requestBody = { doc_id: history.location.state.doc_id,validated:docValidated === "Yes"}
    let requestBody = { fileName: fileName, processorContainerPath: processPath }
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
        setIsloader(false)
        toast.error(response.data.err, toast_options);
      } else {
        let validateData = response.data.result;
        setValidData(validateData)
        setOpenValidateData(true)
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
  const pageNumberClicked = (data) => {
    console.log('pageNo in pageNumberClicked :>> ', data);
       if(data <= totalPages){
       let updatedNum = data;
       console.log("plus page", updatedNum)
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
//  if(pageNo > 10){
//    setList(10)
//  }
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

   function getPageProps() {
    return {
      canvasBackground,
      className: 'custom-classname-page',
      height: pageHeight,
      onClick: (event, page) => console.log('Clicked a page', { event, page }),
      // onRenderSuccess: onPageRenderSuccess,
      renderAnnotationLayer,
      renderForms,
      renderMode,
      renderTextLayer,
      scale: pageScale,
      width: pageWidth,
      customTextRenderer: (textItem) =>
        textItem.str.split('ipsum').reduce(
          (strArray, currentValue, currentIndex) =>
            currentIndex === 0
              ? [...strArray, currentValue]
              : [
                  ...strArray,
                  // eslint-disable-next-line react/no-array-index-key
                  <mark key={currentIndex}>ipsum</mark>,
                  currentValue,
                ],
          [],
        ),
    };
  }
  const pageProps = getPageProps();
  const documentProps = {
    externalLinkTarget,
    file: fileForProps,
    // options,
    rotate,
  };
  
    const zoomIn = () => {
      
      if (pageWidth < 612) {
        // this.setState({ zoomScreen: 15 })
        setPageWidth(612)
        setPageHeight(800)
      }
      else {
        // this.setState({ zoomScreen: this.state.zoomScreen + 1 })
        setPageWidth(pageWidth + 30)
        setPageHeight(pageHeight + 30)
      }
    }
    const zoomOut = () => {
      if (pageWidth < 612) {
        // this.setState({ zoomScreen: 0 })
        setPageWidth(612)
        setPageHeight(800)
      }
      else {
        // this.setState({ zoomScreen: this.state.zoomScreen - 1 })
        setPageWidth(pageWidth - 30)
        setPageHeight(pageHeight - 30)
      }
    }
  
    const rotatePdfH = () => {
      setRotate(90)
    }
    const rotatePdfV = () => {
      setRotate(0)
    }
  
    const resetPdf = () => {
      setPageWidth(612)
      setRotate(0)
      setExpandScreen(false)
    }
  
    const expandPdf = () => {
      // this.setState({ expandScreen: !this.state.expandScreen })
      setExpandScreen(!expandScreen)
      // console.log("Page Width expend", pageWidth)
      if (pageWidth <= 612) {
        // this.setState({ zoomScreen: 0 })
        setPageWidth(1600)
        setPageHeight(2000)
      }
      else{
        setPageWidth(612)
        setPageHeight(800)
      }
    }
  

  const initializeGrid = (flex) => {
    setGridObject(flex);
    console.log(flex)
    flex.columnHeaders.rows.defaultSize = 40;
    
  // flex.itemFormatter = function(panel, r, c, cell) {
  //   console.log(panel, 5, 5, cell,'celllssss')
  // for(var i=0;i<arr.length;i++){
  //   if(c===arr[i]&&r===arr[i]){
  //     cell.innerHTML='<div class="diff-up">' + cell.innerHTML + '</div>'
  //    }
  // }
 
   
  // }
  

flex.itemFormatter = function(panel, r, c, cell) {
  console.log(Object.keys( reportIsuueCells),reportIsuueCells,'celllssss')

  if(reportIsuueCells &&  Object.keys( reportIsuueCells).length !== 0){
  let arr = Object.keys(reportIsuueCells)
for(var i=0;i<arr.length;i++){
  let row = arr[i]
  let rowIdx = row.substring(3)
   
  let colArr = reportIsuueCells[arr[i]]

  colArr.map((cObj)=>{
    let col = cObj
    let cIdx = col.substring(3)
    
// remove text      
if(c==cIdx&&r==rowIdx){

return(<>
      {cell.innerHTML='<div class="diff">' + cell.innerHTML + '</div>'}
      </> )
     }
  })
  
}
}
}

  };
console.log(gridObject,'gridobject')
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
       
<CRow>

<div style={{  width:"100%", display:"table", position:"fixed", zIndex:5, top:140}}>
  <CRow>
  <div style={{background: "#fff", padding: "0 30px", width:"100%", display:"table", borderBottom:"1px solid rgb(157, 157, 157)"}}>
   <div style={{ display: "table", float: "left", borderRadius: "5px", textAlign: "center", margin: "10px", color: "#486fb4", borderSpacing: "15px 0",  }}>
        <div style={{ cursor: "pointer", width: "30px", display: "table-cell" }} onClick={() => pageDownClicked()}>PREV
        </div>
        {[...Array(totalPages+1)].map((elementInArray, index) => (

         ((pageNo <= (totalPages - 10)) && (index >= pageNo && index <= (pageNo + 10)) && index != 0) ?
        <div style={{display: "table-cell", verticalAlign:"middle" ,cursor:'pointer', color:index==pageNo? "#000": "#486fb4"}} onClick={() => pageNumberClicked(index)}>
          {/* <CInput type='text' 
          value={pageNoToShow} 
          onChange={changePage}
          style={{
            background: "none",
            borderRadius: "0",
            margin: "3px auto",
            width: "50px",
            textAlign:"center"
          }}
          /> */}
          {index}  
          </div>
        :
        (pageNo >= (totalPages - 10) && index >= (totalPages-10) && index <= totalPages && index != 0) &&
        <div style={{display: "table-cell", verticalAlign:"middle" ,cursor:'pointer', color:index==pageNo? "#000": "#486fb4"}} onClick={() => pageNumberClicked(index)}>
        {index}
        </div>
        ))}
        <div style={{ cursor: "pointer", width: "30px", display: "table-cell" }} onClick={() => pageUpClicked()}>NEXT
        </div>

      </div>
      <div style={{ whiteSpace: "nowrap", float: "left", color: "#486fb4", margin: "10px", cursor:"pointer"}} onClick={() => pageNumberClicked(totalPages)}>
        {/* <p>from {totalPages} Pages </p> */}
        <p style={{margin:"0"}}>LAST</p>
      </div>

      <div style={{ display: "table", borderSpacing: "10px", float:"right", color:"#486fb4" }}>

      <div style={{ width: "30px", textAlign: "center", color: "#486fb4", display: "table-cell", cursor: "pointer", fontSize: "1.3em", border:"1px solid #486fb4"}} onClick={() => rotatePdfH(90)}><i class="fa fa-arrows-h" aria-hidden="true"></i></div>
      <div style={ {width: "30px", textAlign: "center", color: "#486fb4", display: "table-cell", cursor: "pointer", fontSize: "1.3em", border:"1px solid #486fb4"}} onClick={() => rotatePdfV(0)}><i class="fa fa-arrows-v" aria-hidden="true"></i></div>

        <div style={{ borderRadius: "50px", width: "30px", textAlign: "center",  display: "table-cell", cursor: "pointer", fontSize: "1.3em" }}
          onClick={() => expandPdf()}>
          {expandScreen ?
            <i class="fa fa-compress" aria-hidden="true"></i>
            :
            <i class="fa fa-expand" aria-hidden="true"></i>
          }
        </div>

        <div style={zoomRotate_Icon} onClick={() => zoomIn()}><i class="fa fa-search-plus" aria-hidden="true"></i></div>
        <div style={zoomRotate_Icon} onClick={() => zoomOut()}><i class="fa fa-search-minus" aria-hidden="true"></i></div>
        <div style={zoomRotate_Icon} onClick={() => resetPdf()}><i class="fa fa-repeat" aria-hidden="true"></i></div>
        <div style={zoomRotate_Icon}>
          {/* <a style={{color:'white'}} href={"data:application/pdf;base64," + this.state.pdfImage} download={this.props.history.location.state.data.pdfFilename ? this.props.history.location.state.data.pdfFilename : "file_"+new Date().getTime()+".pdf"}>
          <i class="fa fa-download" aria-hidden="true"></i>
          </a> */}
          <a style={{color:'#486fb4'}}  onClick={() => downloadPdf()}>
          <i class="fa fa-download" aria-hidden="true"></i>
          </a>
        </div>
      </div>
      </div>
      </CRow>
</div>

</CRow>

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
                  <div style={  
                   Isloader ? { ...pdfContentView, ...{ boxShadow: "none" } } : pdfContentView 
                  }>
                    <main className="Test__container__content">
<div style={{overflowY: "auto", overflowX: "hidden", height:"500px"}}>
                    {/* <img src={"data:image/jpeg;base64," + this.state.pdfImage} style={{width:500,height:700}}/> */}
                    {pdfImage ?

                      <Document
                      {...documentProps}
                        file={"data:application/pdf;base64," + pdfImage}
                      // file='https://dgsciense.s3.amazonaws.com/raw_invoices_hubspot/6085ca5e0c876f667d354cb0.pdf'
                      // onLoadSuccess={page => console.log('page onLoadSuccess:>> ', page)}
                      // onLoadError={(error) => console.log('pdf error :>> ', error)}
                      >
                        <Page pageNumber={1} {...pageProps} />
                      </Document>

                      :
                      <p>loading PDF</p>

                    }
</div>
</main>
                  </div>
              <div style={bottom_View}>
               
                <TableContainer component={Paper} style={{ position: "relative", zIndex: "5", overflow: 'hidden', padding:20 }}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                      <TableCell style={table_headerMain}><p style={dateTimeView}><span style={{fontWeight:"600"}}>Date/Time Received:</span> {moment(props.history && props.history.location && props.history.location.state && props.history.location.state.dateRec).format("MM/DD/YYYY hh:mm A")}</p></TableCell>
                        <TableCell style={table_headerMain}><p style={dateTimeView}><span style={{fontWeight:"600"}}>Date/Time Processed:</span> {moment( props.history && props.history.location && props.history.location.state && props.history.location.state.dateProcessed).format("MM/DD/YYYY hh:mm A")}</p></TableCell>
                        <TableCell style={table_headerMain}><p style={dateTimeView}><span style={{fontWeight:"600"}}># of Pages:</span> {props.history && props.history.location && props.history.location.state && props.history.location.state.noOfPages}</p></TableCell>
                        <TableCell style={table_headerMain}>
                          <Button style={viewDetailBtn}
                            onClick={() => {
                              localStorage.setItem("details", JSON.stringify(history.location.state))    
                              history1.push({
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
                          <Button style={viewDetailBtn}
                            onClick={() => resolveDialog()}>Resolve ISSUE</Button>
                        </TableCell>:
                        <TableCell style={historyIssueBtn}>
                        <Button style={viewDetailBtn}
                          onClick={() => openDialog()}>REPORT ISSUE</Button>
                      </TableCell>}
                        <TableCell style={historyIssueBtn}>
                          <Button style={viewDetailBtn}
                            // onClick={() => history.push("/issueHistory")}
                            onClick={() => {
                              
                              history1.push("/issueHistory")}}
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
                        {/* {console.log("localStorage.getItem('master') && JSON.parse(localStorage.getItem('master')))==",localStorage.getItem('master') && JSON.parse(localStorage.getItem('master')))} */}
                        <TableCell style={historyIssueBtn}>
                          <Button style={viewDetailBtn} 
                          // startIcon= {docValidated.toLowerCase() === "yes"?<CheckIcon/>:<ClearIcon/>}
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
                            <Button style={cancel_dialogBtn} onClick={handleClose}>&times;</Button>
                              <Button style={submit_dialogBtn} onClick={submit} >Submit</Button>
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
            onChange={(e)=>setCsvFileName(e.target.value)}
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
                      isReadOnly={true}
                      itemsSource={finalDataResult}
                      initialized={initializeGrid}
                      // ref={this.theGrid}
                   
                      style={{
                        height: "auto",
                        maxHeight: 400,
                        margin: 0,
                      }}

                      selectionMode="MultiRange"
                      showSelectedHeaders="All"
                      // selectionChanged={(s) => {s.selection._col=3}}
                      selectionChanged={(s) => {
                        console.log(s,'flex')
                        let ranges = s.selectedRanges;
                        console.log('selectionChanged ranges', ranges);
                     
                        let newRows = {}
                        for (let i = 0; i < ranges.length; i++) {

                          let rng = ranges[i];
                          
                         
                          for (let r = rng.topRow; r <= rng.bottomRow; r++) {
                            let colarr = []
                            console.log("row"+r,'row')
                            // console.log(r,'row')
                            for (let c = rng.leftCol; c <= rng.rightCol; c++) {
                             
                              // console.log("row"+r,'row')
                              console.log("col"+c, ' cranges')
                              colarr.push("col" + c)
                             }
                            newRows["row" + r] = colarr
                           
                          }
                        }

                        console.log('reportIsuueCells', reportIsuueCells);
                        console.log('newRows', newRows);

                        if(Object.keys(reportIsuueCells).length>0){

                          let reportIsuueCellsCopy = {
                            ...newreportIsuueCells,
                            ...newRows
                          }
                          console.log('reportIsuueCellsCopy', reportIsuueCellsCopy);
  
                          setNewReportIsuueCells(reportIsuueCellsCopy)
                        }else{

                          let reportIsuueCellsCopy = {
                            ...reportIsuueCells,
                            ...newRows
                          }

                          console.log('reportIsuueCellsCopy', reportIsuueCellsCopy);
  
                          setReportIsuueCells(reportIsuueCellsCopy)
                         
                        }

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
                      >
                       

                      </FlexGridColumn>
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
            {/* {openReportResolve && <Dialog open={openReportResolve}
                          onClose={resolvehandleClose}>
                          <DialogTitle>Issue Resolve</DialogTitle>
                          <DialogContent style={{ minWidth: 500 }}>
                            <DialogContentText>
                              <TextField id="outlined-basic" value={resolveInput} label="Enter Resolve" multiline={true} type="text" variant="outlined" style={{ width: "100%" }}
                                // onChange={this.handleClickReportIssue}
                                onChange={e => setResolveInput(e.target.value)}
                              />
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <div style={{ flexDirection: 'row' }}>
                            <Button style={cancel_dialogBtn} onClick={resolvehandleClose}>&times;</Button>
                              <Button style={submit_dialogBtn} onClick={submitResolve} >Submit</Button>
                            </div>
                          </DialogActions>
                        </Dialog>} */}
           {openValidateData &&
            <Dialog open={openValidateData}
            onClose={handleValidateClose}>
            <DialogTitle style={{fontWeight:'bold',fontSize:18}}>Validate Data</DialogTitle>
            <DialogContent style={{ minWidth: 500 }}>
              <DialogContentText>
                <CCard>
                <CCardBody>
                <CRow>
                <CCol sm="4" style={{fontWeight:'bold',fontSize:15}}>Validated:</CCol>
                <CCol sm="1"></CCol>
                <CCol sm="7">{!validData["Validated"] ? <i class="fa fa-times" aria-hidden="true"></i>:<i class="fa fa-check" aria-hidden="true"></i>}</CCol>
                </CRow>
                <CRow>
                <CCol sm="4" style={{fontWeight:'bold',fontSize:15}}>Check Amount :</CCol>
                <CCol sm="1"></CCol>
                <CCol sm="7">{validData["Check Amount"]}</CCol>
                </CRow>
                <CRow>
                <CCol sm="4" style={{fontWeight:'bold',fontSize:15}}>Tax Deduct Totals:</CCol>
                <CCol sm="1"></CCol>
                <CCol sm="7">{validData["Tax Deduct Totals"]}</CCol>
                </CRow>
                <CRow>
                <CCol sm="4" style={{fontWeight:'bold',fontSize:15}}>Net Deduct Total :</CCol>
                <CCol sm="1"></CCol>
                <CCol sm="7">{validData["Net Deduct Total"]}</CCol>
                </CRow>
                <CRow>
                <CCol sm="4" style={{fontWeight:'bold',fontSize:15}}>Net Tax Total:</CCol>
                <CCol sm="1"></CCol>
                <CCol sm="7">{validData["Net Tax Total"]}</CCol>
                </CRow>
                <CRow>
                <CCol sm="4" style={{fontWeight:'bold',fontSize:15}}>Owner Deducts:</CCol>
                <CCol sm="1"></CCol>
                <CCol sm="7">{validData["Owner Deducts"]}</CCol>
                </CRow>
                <CRow>
                <CCol sm="4" style={{fontWeight:'bold',fontSize:15}}>Owner Taxes:</CCol>
                <CCol sm="1"></CCol>
                <CCol sm="7">{validData["Owner Taxes"]}</CCol>
                </CRow>
                <CRow>
                <CCol sm="4" style={{fontWeight:'bold',fontSize:15}}>Owner Value:</CCol>
                <CCol sm="1"></CCol>
                <CCol sm="7">{validData["Owner Value"]}</CCol>
                </CRow>
                </CCardBody>
                </CCard>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <div style={{ flexDirection: 'row' }}>
                <Button style={cancel_dialogValidateBtn} onClick={handleValidateClose}>Cancel</Button>
              </div>
            </DialogActions>
          </Dialog>
          }
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
        
      </CCard >
   
  );
  
}
export default withStyles(doc_styles, { withTheme: true })(DocumentDetails);
