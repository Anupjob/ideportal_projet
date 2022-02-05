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
import Button from "@material-ui/core/Button";
//import { doc_styles } from "./documentDetailStyle";


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const pdfMainView = {
  backgroundColor: '#fff',
  border: 0,
  padding: "0 20px"
}

const pdfContentView = {
  display: 'table',
  backgroundColor: 'white',
  //boxShadow: '0px 4px 32px 1px #00000029',
  //minWidth: 600,
   width: "90%"
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
  backgroundColor: '#E7F7EA', marginTop: 5
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
  zIndex: "9999",
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
const viewDetailBtn = {
  backgroundColor: '#4EA7D8',
  fontSize: 10, 
  color: 'white',
  marginLeft:10,
  height:35
  // width: 130
}
class PdfViewGoogleAzure extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      googleVisionVisible: false,
      azureTableVisible: false,
      googleTableVisible: false,
      finalDataResult: {},
      azureDataResults: [],
      visionType: "googlev",
      pageNo: 1,
      fileType: "pdf",
      pdfImage: '',
      isCheckedPdf: false,
      isCheckedImage: false,
      isCheckedRotateImg: false,
      totalPages:0
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
  getPdfImageRotate = () => {
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
          // this.setState({ pdfImage: response.data.result, isLoading: false })
          let base64Data = response.data.result.base64Str
          this.setState({ pdfImage: base64Data, totalPages: response.data.result.noOfPages })
        }
        this.setState({isLoading: false})
      }).catch(err => {
        toast.error(err.message, toast_options);
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
  getPdfViewData = () => {
    console.log("===You are in if this.props:::", this.props)
    console.log("===You are in if this.props.match:::", this.props.match.params.id)

    var doc_id = this.props.match.params.id;
    this.setState({ isLoading: true })

    const headers = {

        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem('access_token'),
        // reqFrom: "ADMIN",
      };
      axios({
        method: "POST",
        url: settings.serverUrl + "/getGoogleVisionData",
        data: JSON.stringify({ docId: doc_id, resType: this.state.visionType,pageNum: this.state.pageNo }),
        headers,
      }).then((response) => {
        console.log("response getGoogleVisionData===",response)
          var respdata = response.data.result

      if (response.data.err) {
        // alert(response.data.err);
        toast.error(response.data.err, toast_options);
      } else {
       
        if(this.state.visionType == 'googlev'){
          var pardedResp = JSON.parse(respdata)
         var blockOne = pardedResp.fullTextAnnotation.pages[0].blocks[1];
         console.log('blockOne :>> ', blockOne);
          this.setState({ googleVisionVisible: true, azureTableVisible: false, googleTableVisible: false ,finalDataResult: pardedResp.fullTextAnnotation,isLoading: false })
          }else if(this.state.visionType == 'azuret'){

          this.setState({azureTableVisible: true, googleVisionVisible: false, googleTableVisible: false ,
            // azureDataResults:pardedResp.cells,
             isLoading: false })

          }else{
          this.setState({googleTableVisible: true, googleVisionVisible: false, azureTableVisible: false , isLoading: false })

          }
      }
      this.setState({isLoading: false})
    }).catch(err => {
      toast.error(err.message, toast_options);
      console.log("Issue", err)
      if(err.message.includes("403")){
      localStorage.clear();
      this.props.history.push("/");
      }
    });

  }
  onChangeValue = (event) => {
    // console.log("===Radio Button click::", event.target.value);
    if (event.target.value == "GoogleVision") {
      this.setState({ visionType: 'googlev' }, () => { this.getPdfViewData() })
    } else if (event.target.value == "AzureTables") {
      this.setState({ visionType: 'azuret' }, () => { this.getPdfViewData() })
    } else {
      this.setState({ visionType: 'googlet' }, () => { this.getPdfViewData() })
    }
  }

  onChangeRadioValue = (event) => {
    // console.log("Radio button click===",event.target.value);
    if (event.target.value == "PDF") {
      this.setState({ fileType: 'pdf' }, () => { this.getPdfImageRotate() })
    } else if (event.target.value == "Image") {
      this.setState({ fileType: 'image' }, () => { this.getPdfImageRotate() })
    } else if (event.target.value == "RotatedImage") {
      this.setState({ fileType: 'image_rotated' }, () => { this.getPdfImageRotate() })
    }
  }

  onPageLoad(info) {
    // pdf org size ::::::::::  width: 826px; height: 1066px;
    const {
      height, width, originalHeight, originalWidth
    } = info;
    console.log("Screen resolution:::",height, width, originalHeight, originalWidth);
  }

  render() {
    // console.log("===PdfViewGoogleAzure doc_id in render :::",this.props.history.location.state.data.doc_id)
    return (
      <CCard style={pdfMainView}>
        
        <CRow style={{ color: 'white', position: "fixed", top: "108px", left: "85px", zIndex: "1030", fontWeight: "bold" }}>
          {this.props.history.location.state.fileName ? this.props.history.location.state.fileName : ""}
        </CRow>
        <CRow style={{ borderBottom: "1px solid #999", marginBottom: "40px", paddingTop: "20px" }}>
          <CCol xs="6" style={{ backgroundColor: 'white', height: 50 }}>
            <div style={{ width: "100%", display: 'table' }} onChange={this.onChangeRadioValue}>
              <input type="radio" value="PDF" name="check" defaultChecked style={{ margin: 10 }} /> PDF
              <input type="radio" value="Image" name="check" style={{ margin: 10 }} /> Image
              <input type="radio" value="RotatedImage" name="check" style={{ margin: 10 }} /> Rotated Image
            </div>
          </CCol>
          <CCol xs='6'>
          <Button style={viewDetailBtn} onClick={console.log("==Reprocess Extraction Click::")}><i class="fa fa-repeat fa-lg" aria-hidden="true" style={{padding:'5px'}}></i>Reprocess Extraction</Button>
          <Button style={viewDetailBtn} onClick={console.log("==Reprocess Mapping Click::")}><i class="fa fa-repeat fa-lg" aria-hidden="true" style={{padding:'5px'}}></i>Reprocess Mapping</Button>          
          <Button style={viewDetailBtn} onClick={console.log("==Header Mapping Click::")}><i class="fa fa-code fa-lg" aria-hidden="true"></i>Header Mapping</Button>
          <Button style={viewDetailBtn} onClick={console.log("==Table Mapping Click::")}><i class="fa fa-code fa-lg" aria-hidden="true"></i>Table Mapping</Button>
          </CCol>
        </CRow>

        <CRow style={{ marginTop: 5 }}>
          <CCol xs="8">
            <div style={pdfContentView}>
            
              {this.state.fileType == 'pdf' ?
                <div style={this.state.isLoading ? { ...pdfContentView, ...{ boxShadow: "none" } } : pdfContentView}>
                  {this.state.pdfImage ?
                    <Document
                      file={"data:image/jpeg;base64," + this.state.pdfImage}
                    >
                      <Page pageNumber={1} onLoadSuccess={this.onPageLoad} />
                    </Document> :
                    <p>loading PDF</p>
                  }

                  {
                    this.state.finalDataResult && Object.keys(this.state.finalDataResult).length > 0 && this.state.finalDataResult.pages[0].blocks.map((blockData, blockIdx) =>
                    <div style={{
                      top:blockData.boundingBox.vertices[0].y, 
                      left:blockData.boundingBox.vertices[0].x, 
                      width:blockData.boundingBox.vertices[1].x - blockData.boundingBox.vertices[0].x, 
                      height:blockData.boundingBox.vertices[2].y - blockData.boundingBox.vertices[0].y, 
                      border: '2px solid #FF0000',
                      position: "absolute"}}>
                        {
                          blockData.paragraphs.map((paraData) =>
                            paraData.words.map((wordData, wordIndex) =>
                              console.log('wordData.symbols.map((symbolData, symbolIndex)====', wordData.symbols.map((symbolData, symbolIndex) => symbolData.text).join(''))
                            )
                          )
                        }
                        {console.log('blockData.boundingBox.vertices[0].y :>> ', blockData.boundingBox.vertices[0].y)}
                        {console.log('left:blockData.boundingBox.vertices[0].x :>> ', blockData.boundingBox.vertices[0].x)}
                        {console.log('blockData.boundingBox.vertices[1].x - blockData.boundingBox.vertices[0].x :>> ', blockData.boundingBox.vertices[1].x - blockData.boundingBox.vertices[0].x)}
                        {console.log('blockData.boundingBox.vertices[2].y - blockData.boundingBox.vertices[0].y :>> ', blockData.boundingBox.vertices[2].y - blockData.boundingBox.vertices[0].y)}
                    </div>
                    )}
                </div> :
                <div style={this.state.isLoading ? { ...pdfContentView, ...{ boxShadow: "none" } } : pdfContentView}>
                  {this.state.pdfImage ?
                    <img style={{ width: "100%" }}
                      src={"data:image/jpeg;base64," + this.state.pdfImage}>
                    </img> :
                    <p>loading PDF</p>
                  }
                </div>
              }
            </div>
          </CCol>
          <CCol xs="4">
            <div style={radioBtnDiv}>
              <div onChange={this.onChangeValue} >
                <input type="radio" value="GoogleVision" name="gender" /> Show Results from Google Vision<br />
                
                {this.state.googleVisionVisible &&
                  <div style={radioBtnMainView}>

                    {
                      this.state.finalDataResult && Object.keys(this.state.finalDataResult).length > 0 && this.state.finalDataResult.pages.map((pageData) =>
                        <div >
                          {
                            pageData.blocks.map((blockData, blockIdx) =>
                              <div style={{ padding: 10 }}>
                                <div>
                                  <span style={{ backgroundColor: '#824CC0', color: 'white', flexWrap: 'wrap', padding: 5, marginTop: 5, borderRadius: 10 }}>
                                    +Block {blockIdx + 1}
                                  </span>
                                </div>
                                {
                                  blockData.paragraphs.map((paraData) =>
                                    <div style={radioBtnSubView}>
                                      {
                                        paraData.words.map((wordData, wordIndex) =>
                                          <span style={{ marginRight: 5 }}>

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
                <input type="radio" value="SimpleGoogleVision" name="gender" /> Simple Google Vision<br />
                <input type="radio" value="AdvancedGoogleVision" name="gender" /> Advanced Google Vision<br />
                {/* <hr style={horizontalLine} /> */}
                <input type="radio" value="AzureTables" name="gender" /> Show Results from Azure Tables<br />
                
                {this.state.azureTableVisible &&
                  <div style={radioBtnMainView}>
                    {/* {this.state.azureDataResults.map((cellData) =>
                      <div style={radioBtnSubView}>
                        {
                          <span>{cellData.text}</span>
                        }
                      </div>
                    )
                    } */}

                  </div>}
                <input type="radio" value="AzureForm" name="gender" /> Azure Form<br />
                <input type="radio" value="AzureDocAnalyzer" name="gender" /> Azure Document Analyzer<br />
                {/* <hr style={horizontalLine} /> */}
                <input type="radio" value="GoogleTables" name="gender" /> Show Results from Google Tables<br/>
                <input type="radio" value="TesseractTables" name="gender" /> Tesseract Tables<br/>
                <input type="radio" value="AzureCV" name="gender" /> Azure CV<br/>
                <input type="radio" value="OpenCV" name="gender" /> Open CV<br/>
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

        </CRow>
      </CCard>
    );
  }
}
export default PdfViewGoogleAzure
