import React from 'react'
import {
  CCard,
  CCol,
  CProgress,
  CRow,
} from '@coreui/react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import CircularProgress from "@material-ui/core/CircularProgress";
import settings from 'src/config/settings';
import axios from "axios";
import { useHistory } from "react-router";


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const pdfMainView = {
  backgroundColor: 'transparent',
  border: 0
}
const pdfContentView = {
  display: 'table',
  backgroundColor: 'white',
  boxShadow: '0px 4px 32px 1px #00000029',
  minWidth:600
}
const radioBtnDiv = {
  backgroundColor: 'white',
  padding: 5
}
const radioBtnMainView = {
  padding: 5, overflowY: 'scroll',
  maxHeight: 400
}
const radioBtnSubView = {
  margin: 5, padding: 5,
  border: '2px solid #D2D9DA',
  backgroundColor: '#E7F7EA',marginTop:5
}
const horizontalLine = {
  color: '#D3D3D3',
  height: .2
}
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
const toast_options = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
    
  }
class PdfViewGoogleAzure extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      googleVisionVisible: false,
      azureTableVisible: false,
      googleTableVisible: false,
      finalDataResult: {},
      azureDataResults:[],
      visionType:"googlev",
      pageNo:1,
      fileType:"pdf",
      pdfImage:'',
      isCheckedPdf:false,
      isCheckedImage:false,
      isCheckedRotateImg:false
    }
    // this.onChangeValue = this.onChangeValue.bind(this);
  }
  componentDidMount = () => {

    // console.log("===PdfViewGoogleAzure doc_id :::GoogleAzure",this.props)
    this.getPdfImageRotate();
  }
  onPageLoad(info) {
    const {
      height, width, originalHeight, originalWidth
    } = info;
    console.log(height, width, originalHeight, originalWidth);
  }
  getPdfImageRotate = () =>{
    // console.log("===PdfViewGoogleAzure doc_id :::GoogleAzure",this.props)

    var pdfFileName = this.props.history.location.state.fileName;
    var processorPath = this.props.history.location.state.containerPath;
    var pdfValid = true;
    console.log("==pdfFileName==PdfViewGoogleAzure", pdfFileName)
    console.log("==processorPath==PdfViewGoogleAzure", processorPath)


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
      // console.log("==pdfValid==in if under", pdfValid)
      this.setState({ isLoading: true })

      const headers = {
        "Content-Type": "application/json",
        // Authorization: "Bearer " + logginUser.token,
        // reqFrom: "ADMIN",
      };
      axios({
        method: "POST",
        url: settings.serverUrl + "/getPdfFile",
        data: JSON.stringify({ fileName: pdfFileName, containerPath: processorPath, fileType: this.state.fileType ,pageNum: this.state.pageNo}),
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
  getPdfViewData = () => {
    console.log("===You are in if this.props:::",this.props)
    console.log("===You are in if this.props.match:::",this.props.match.params.id)

     var doc_id = this.props.match.params.id;
     this.setState({ isLoading: true })

    const headers = {
        "Content-Type": "application/json",
        // Authorization: "Bearer " + logginUser.token,
        // reqFrom: "ADMIN",
      };
      axios({
        method: "POST",
        url: settings.serverUrl + "/getGoogleVisionData",
        data: JSON.stringify({ docId: doc_id, resType: this.state.visionType,pageNum: this.state.pageNo }),
        headers,
      }).then((response) => {
          var respdata = response.data.result
          var pardedResp = JSON.parse(respdata)
        console.log("Respone from post pardedResp===",pardedResp );
        console.log("Respone from post fullTextAnnotation===",pardedResp.fullTextAnnotation );

        if (response.data.err) {
          // alert(response.data.err);
          toast.error(response.data.err, toast_options);
        } else {
            if(this.state.visionType == 'googlev'){
            this.setState({ googleVisionVisible: true, azureTableVisible: false, googleTableVisible: false ,finalDataResult: pardedResp.fullTextAnnotation,isLoading: false })
            }else if(this.state.visionType == 'azuret'){
            this.setState({azureTableVisible: true, googleVisionVisible: false, googleTableVisible: false ,azureDataResults:pardedResp.cells, isLoading: false })
            }else{
            this.setState({googleTableVisible: true, googleVisionVisible: false, azureTableVisible: false , isLoading: false })

            }
        }
      }).catch(err => {
        toast.error(err.message, toast_options);
        console.log("Issue", err)
      });

  }
  onChangeValue = (event) => {
    // console.log("===Radio Button click::", event.target.value);
    if (event.target.value == "GoogleVision") {
       this.setState({ visionType:'googlev'},()=>{this.getPdfViewData()})
    } else if (event.target.value == "AzureTables") {
      this.setState({ visionType:'azuret'},()=>{this.getPdfViewData()})
    } else {
      this.setState({ visionType:'googlet'},()=>{this.getPdfViewData()})
    }
  }

  onChangeRadioValue = (event) =>{
    // console.log("Radio button click===",event.target.value);
    if (event.target.value == "PDF") {
    this.setState({ fileType:'pdf'},()=>{this.getPdfImageRotate()})
    }else if(event.target.value == "Image"){
      this.setState({ fileType:'image'},()=>{this.getPdfImageRotate()})
    }else if(event.target.value == "RotatedImage"){
      this.setState({ fileType:'image_rotated'},()=>{this.getPdfImageRotate()})
    }
  }
   
onPageLoad(info) {
  const {
    height, width, originalHeight, originalWidth
  } = info;
  console.log(height, width, originalHeight, originalWidth);
}

render() {
    // console.log("===PdfViewGoogleAzure doc_id in render :::",this.props.history.location.state.data.doc_id)
  return (
    <CCard style={pdfMainView}>
       <CRow style={{color:'white'}}>
       {this.props.history.location.state.fileName ? this.props.history.location.state.fileName:""}
       </CRow>
       <CRow>
       <CCol xs='2'></CCol>
        
        <CCol xs="4.5" style={{backgroundColor:'white',height:50}}>
        <div  style={{width:600,display:'table'}} onChange={this.onChangeRadioValue}>
        <input type="radio" value="PDF" name="check" defaultChecked  style={{margin:10}}/> PDF
        <input type="radio" value="Image" name="check" style={{margin:10}}/> Image
        <input type="radio" value="RotatedImage" name="check" style={{margin:10}}/> Rotated Image
        </div>
        </CCol>
        {/* <CCol xs='2'></CCol> */}
        </CRow>
      <CRow style={{marginTop:5}}>
        <CCol xs='2'></CCol>
        <CCol xs="4.5">
          <div style={pdfContentView}>
            
            {this.state.fileType=='pdf' ?
            <div style={this.state.isLoading ? { ...pdfContentView, ...{ boxShadow: "none" } } : pdfContentView}>
                {this.state.pdfImage ?
                  <Document
                    file={"data:image/jpeg;base64," + this.state.pdfImage}
                  >
                    <Page pageNumber={1} onLoadSuccess={this.onPageLoad} />
                  </Document> :
                  <p>loading PDF</p>
                }
              </div>:
              <div style={this.state.isLoading ? { ...pdfContentView, ...{ boxShadow: "none" } } : pdfContentView}>
              {this.state.pdfImage ?
                <img style={{width:600}}
                src={"data:image/jpeg;base64," + this.state.pdfImage}>
                </img> :
                <p>loading PDF</p>
              }
            </div>
              }
          </div>
        </CCol>
        <CCol xs='0.5'></CCol>
        <CCol xs="3">           
          <div style={radioBtnDiv}>
            <div  onChange={this.onChangeValue} >
              <input type="radio" value="GoogleVision" name="gender"/> Show Results from Google Vision<br />
              {this.state.googleVisionVisible &&
                <div style={radioBtnMainView}>

                    {
                       this.state.finalDataResult && Object.keys(this.state.finalDataResult).length>0 && this.state.finalDataResult.pages.map((pageData) => 
                            <div >
                                {
                                    pageData.blocks.map((blockData, blockIdx) =>
                                        <div style={{padding:10}}>
                                            <div>
                                                <span style={{backgroundColor:'#824CC0',color:'white',flexWrap:'wrap',padding:5,marginTop:5,borderRadius:10}}>
                                                +Block {blockIdx + 1}
                                                </span>
                                            </div>
                                            {
                                                blockData.paragraphs.map((paraData) => 
                                                <div style={radioBtnSubView}>
                                                    {
                                                        paraData.words.map((wordData,wordIndex) => 
                                                        <span style={{marginRight:5}}>
                                                            
                                                            {
                                                                wordData.symbols.map((symbolData, symbolIndex) => symbolData.text).join('')
                                                            }
                                                        </span>
                                                        ) 
                                                    }
                                                </div>
                                                )
                                            } 
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                  
                </div>
                }
              <hr style={horizontalLine} />
              <input type="radio" value="AzureTables" name="gender" /> Show Results from Azure Tables<br />
              {this.state.azureTableVisible &&
                <div style={radioBtnMainView}>
                    {this.state.azureDataResults.map((cellData) =>
                      <div style={radioBtnSubView}>
                      {
                          <span>{cellData.text}</span>
                      }
                  </div>
                    )
                    }
                 
                </div>}
              <hr style={horizontalLine} />
              <input type="radio" value="GoogleTables" name="gender" /> Show Results from Google Tables
              {this.state.googleTableVisible &&
                <div style={radioBtnMainView}>
                  <div style={radioBtnSubView}>
                    Google Tables Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad
                    squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
                    sapiente ea proident.
                  </div>
                  <div style={radioBtnSubView}>
                    Google Tables Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad
                    squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
                    sapiente ea proident.
                  </div>
                </div>
              }
              {this.state.isLoading && (
            <div style={loader}>

              <CircularProgress style={{ margin: "26% auto", display: "block" }} />

            </div>
          )}
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
            </div>
          </div>
        </CCol>
        <CCol xs='2'></CCol>

      </CRow>
    </CCard>
  );
}
}
export default PdfViewGoogleAzure
