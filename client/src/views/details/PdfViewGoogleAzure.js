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

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const pdfMainView = {
  backgroundColor: 'transparent',
  border: 0
}
const pdfContentView = {
  display: 'table',
  backgroundColor: 'white',
  boxShadow: '0px 4px 32px 1px #00000029',
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
      pageNo:1
    }
  }
  componentDidMount = () => {

    console.log("===PdfViewGoogleAzure doc_id :::",this.props)
  }
  onPageLoad(info) {
    const {
      height, width, originalHeight, originalWidth
    } = info;
    console.log(height, width, originalHeight, originalWidth);
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
            this.setState({ finalDataResult: pardedResp.fullTextAnnotation,isLoading: false })
            }else{
            this.setState({azureDataResults:pardedResp.cells, isLoading: false })
            }
        }
      }).catch(err => {
        toast.error(err.message, toast_options);
        console.log("Issue", err)
      });

  }
  onChangeValue = (event) =>  {
    // console.log("===Radio Button click::", event.target.value);
    if (event.target.value == "GoogleVision") {
      this.setState({ googleVisionVisible: true, azureTableVisible: false, googleTableVisible: false ,visionType:'googlev'},()=>{this.getPdfViewData()})
    } else if (event.target.value == "AzureTables") {
      this.setState({ azureTableVisible: true, googleVisionVisible: false, googleTableVisible: false ,visionType:'azuret'},()=>{this.getPdfViewData()})
    } else {
      this.setState({ googleTableVisible: true, googleVisionVisible: false, azureTableVisible: false ,visionType:'googlet'},()=>{
        this.getPdfViewData()
      })
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
      <CRow>
        <CCol xs='2'></CCol>
        <CCol xs="4.5">
          <div style={pdfContentView}>
            <Document
              file='https://dgsciense.s3.amazonaws.com/raw_invoices_hubspot/6085ca5e0c876f667d354cb0.pdf'
              onLoadSuccess={page => console.log('page onLoadSuccess:>> ', page)}
              onLoadError={(error) => console.log('pdf error :>> ', error)}
            >
              <Page pageNumber={1} onLoadSuccess={this.onPageLoad} />
            </Document>
          </div>
        </CCol>
        <CCol xs='0.5'></CCol>
        <CCol xs="3">           
          <div style={radioBtnDiv}>
            <div>
              <input type="radio" value="GoogleVision" name="gender"  onChange={() => this.onChangeValue()}/> Show Results from Google Vision<br />
              {this.state.googleVisionVisible &&
                <div style={radioBtnMainView}>

                    {
                        this.state.finalDataResult.pages.map((pageData) => 
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
