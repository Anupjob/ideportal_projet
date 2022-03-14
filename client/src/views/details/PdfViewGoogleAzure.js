import React from 'react'
import {
  CCard,
  CCol,
  CRow,
  CInput
  //CImg,
} from '@coreui/react'
import { CImg } from '@coreui/react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Document, Page, pdfjs } from 'react-pdf';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import CircularProgress from "@material-ui/core/CircularProgress";
import settings from 'src/config/settings';
import axios from "axios";
import { useHistory } from "react-router";
import Button from "@material-ui/core/Button";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { doc_styles } from "./documentDetailStyle";
import { withStyles } from "@material-ui/core/styles";
import * as wjCore from '@grapecity/wijmo';
import { FlexGrid, FlexGridColumn, FlexGridCellTemplate } from '@grapecity/wijmo.react.grid';
import * as wjFilter from "@grapecity/wijmo.react.grid.filter";
import * as wjGrid from '@grapecity/wijmo.react.grid';
import '@grapecity/wijmo.styles/wijmo.css';
import * as wjcCore from "@grapecity/wijmo";
import Grid from "@material-ui/core/Grid";


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

let pagePadding = 30;
let xPercentageChange = 0.36;
let yPercentageChange = 0.36;
let boxLeftMargin = 13;
let boxTopMargin = 1;
let boxExtraWidth = 5;
let boxExtraHeight = 2;

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
  //  width: "90%"
}
const carousel_arrow_right= {
  color: "rgb(255, 255, 255)",
  background: "none",
  position: "absolute",
  right: "20px",
  border: "none",
}
const carousel_arrow_left= {
  color: "rgb(255, 255, 255)",
  background: "none",
  position: "absolute",
  left: "20px",
  border: "none",
}
const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 3
  }
};

const pdfContentBox = {
  display: "table",
backgroundColor: "white",
// width: "100%",
boxShadow: "0px 0px 8px #0000001c",
padding: pagePadding+"px",
border: "1px solid #dbdbdb",
// marginBottom:"20px"
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
      pageNum: 1,
      fileType: "pdf",
      pdfImage: '',
      isCheckedPdf: false,
      isCheckedImage: false,
      isCheckedRotateImg: false,
      totalPages:0,
      Toggle: false,
      sliderData: [],
      selectedRadioOption: ""
    }
    // this.onChangeValue = this.onChangeValue.bind(this);
  }
  componentDidMount = () => {

    console.log("===PdfViewGoogleAzure doc_id :::GoogleAzure",this.props)
    this.getPdfImageRotate();
  }
  getPdfImageRotate = () => {
    console.log("===PdfViewGoogleAzure doc_id in getPdfImageRotate:::",this.props)

    var pdfFileName = this.props.history.location.state && this.props.history.location.state.fileName;
    var processorPath = this.props.history.location.state && this.props.history.location.state.containerPath;
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
        data: JSON.stringify({ fileName: pdfFileName, containerPath: processorPath, fileType: this.state.fileType, pageNum: this.state.pageNum }),
        headers,
      }).then((response) => {
        console.log("Respone from post getPdfImage in PdfViewGoogleAzure==", response.data.result);
        if (response.data.err) {
          // alert(response.data.err);
          toast.error(response.data.err, toast_options);
        } else {
          let sliderDataArr = []
          // this.setState({ pdfImage: response.data.result, isLoading: false })
          for (let index = 0; index < response.data.result.noOfPages; index++) {
            sliderDataArr.push("./canvas.png")
          }
          
          let base64Data = response.data.result.base64Str
          this.setState({ pdfImage: base64Data, totalPages: response.data.result.noOfPages, sliderData: sliderDataArr })
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
        data: JSON.stringify({ docId: doc_id, resType: this.state.visionType, pageNum: this.state.pageNum }),
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
          console.log('pardedResp :>> ', pardedResp);
         var blockOne = pardedResp.fullTextAnnotation.pages[0].blocks[1];
         console.log('blockOne :>> ', blockOne);
          this.setState({ googleVisionVisible: true, azureTableVisible: false, googleTableVisible: false ,finalDataResult: pardedResp.fullTextAnnotation,isLoading: false })
          }else if(this.state.visionType == 'azuret'){

          this.setState({azureTableVisible: true, googleVisionVisible: false, googleTableVisible: false ,
            finalDataResult:[],
            azureDataResults:response.data.result,
             isLoading: false })

          }else{
          this.setState({googleTableVisible: true, googleVisionVisible: false, azureTableVisible: false , isLoading: false, finalDataResult:[], azureDataResults:[] })

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
    let visType = event.target.value;

    if (event.target.value == "GoogleVision") {
      visType = 'googlev'
    } else if (event.target.value == "AzureTables") {
      visType = 'azuret'
    } else {
      visType = 'googlet'
    }

    this.setState({ visionType: visType, selectedRadioOption: event.target.value }, () => { 
      if(visType == 'googlev' || visType == 'azuret'){
        this.getPdfViewData() 
      }
    })
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
  
  sliderClick = () => {
    this.setState({Toggle:!this.state.Toggle})
  }

  render() {
    const { classes } = this.props;
    
    console.log("===props in render :::",this.props)
    return (
      <CCard style={pdfMainView}>

<div className={classes.report_block}>
                  <h4 className={classes.report_title} onClick={() => this.sliderClick()}>PDF VIEWER <i class="fa fa-chevron-down" aria-hidden="true"></i>
                  </h4>
                  {this.state.Toggle &&
                    <div style={{ width: "400px", padding: "20px 50px", position: "fixed", right: "20px", background: '#8349bf', boxShadow: "0px 4px 6px rgba(0,0,0,0.5)", border: "1px solid #fff", borderRadius: "5px", paddingBottom: "60px" }}>

                      <Carousel responsive={responsive} focusOnSelect={true} ref={el => (this.Carousel = el)}
                        customButtonGroup={<div className="carousel-button-group" style={{position: "absolute",  zIndex: "1", bottom: "12px", right: "40px"}}>
 
                  <div style={{ color: "#fff", textAlign: "right", marginTop: "15px" }}>Pages 
                                      <CInput type='text' 
                                      value={this.state.pageNum} 
                                      onChange={(e) => {
                                        let pageToChange = Number(e.target.value)
                                        if(pageToChange>=1 && pageToChange <= this.state.sliderData.length){
                                          this.Carousel.goToSlide(pageToChange-1);
                                          // this.setState({pageNum: e.target.value})
                                        }
                                      }}
                                      style={{
                                        background: "none",
                                        color: "#fff",
                                        borderRadius: "0",
                                        margin: "0 7px",
                                        width: "50px",
                                        border: "1px solid #fff",
                                        textAlign:"center",
                                        display:'inline-block'
                                      }}
                                      /> of {this.state.sliderData.length}</div>
                        {/* <CButton onClick={() => goToSlide(currentSlide + 4)} > Go to any slide </CButton> */}
                      </div>}
                     
                        afterChange={(previousSlide, { currentSlide, onMove }) => {
                          console.log("afterChange currentSlide",currentSlide)
                          let newPageNum = currentSlide+1;
                          if(newPageNum>=1 && newPageNum <= this.state.sliderData.length){
                            this.setState({pageNum: newPageNum}, ()=>{
                              this.getPdfImageRotate()
                              // this.getPdfViewData()
                              this.setState({azureTableVisible: false, googleVisionVisible: false, googleTableVisible: false ,
                                finalDataResult:[],
                                azureDataResults:[],selectedRadioOption:"" })

                            })
                          }
                        }}
                        style={{ display: "table" }}
                      >
                        {this.state.sliderData.length > 0 && this.state.sliderData.map((obj, idx) => (

                          <div style={{ background: idx == this.state.pageNum ? "rgb(5, 162, 210)" : 'none', margin: "5px" }} >
                            <CImg src={obj} style={{ width: "100%", opacity: idx+1 == this.state.pageNum ? "0.6" : '1' }} /></div>
                        ))}

                      </Carousel>
                     
                    </div>
                  }

                </div>
        
        <CRow className={classes.title_text }>
          {this.props.history.location && this.props.history.location.state && this.props.history.location.state.fileName ? this.props.history.location.state.fileName : ""}
        </CRow>
        <CRow style={{ borderBottom: "1px solid #999", marginBottom: "20px", paddingTop: "20px" }}>
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
            <div style={pdfContentBox}>

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
                      top:(blockData.boundingBox.vertices[0].y * yPercentageChange)+boxTopMargin+pagePadding, 
                      left:(blockData.boundingBox.vertices[0].x * xPercentageChange)+boxLeftMargin+pagePadding , 
                      width:(blockData.boundingBox.vertices[1].x * xPercentageChange - blockData.boundingBox.vertices[0].x * xPercentageChange)+boxExtraWidth, 
                      height:(blockData.boundingBox.vertices[2].y * yPercentageChange - blockData.boundingBox.vertices[0].y * yPercentageChange)+boxExtraHeight, 
                      border: '0.2px solid #FF0000',
                      position: "absolute"}}>
                        { blockIdx == 0 &&
                          blockData.paragraphs.map((paraData) =>
                            paraData.words.map((wordData, wordIndex) =>
                              console.log('wordData.symbols.map((symbolData, symbolIndex)====', wordData.symbols.map((symbolData, symbolIndex) => symbolData.text).join(''))
                            )
                          )
                        }
                        {blockIdx == 0 && console.log('blockData :>> ', blockData)}
                        {blockIdx == 0 && console.log('blockData.boundingBox.vertices[0].y :>> ', blockData.boundingBox.vertices[0].y)}
                        {blockIdx == 0 && console.log('left:blockData.boundingBox.vertices[0].x :>> ', blockData.boundingBox.vertices[0].x)}
                        {blockIdx == 0 && console.log('blockData.boundingBox.vertices[1].x - blockData.boundingBox.vertices[0].x :>> ', blockData.boundingBox.vertices[1].x - blockData.boundingBox.vertices[0].x)}
                        {blockIdx == 0 && console.log('blockData.boundingBox.vertices[2].y - blockData.boundingBox.vertices[0].y :>> ', blockData.boundingBox.vertices[2].y - blockData.boundingBox.vertices[0].y)}
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
            
            {/* <div style={{position:"fixed", width:"200px", right:"-200px"}}> */}
            {/* <div style={}><i class="fa fa-chevron-left" aria-hidden="true"></i></div> */}
            <div style={radioBtnDiv}>
              <div onChange={this.onChangeValue} >
              <FormControl component="fieldset">
      {/* <FormLabel component="legend">labelPlacement</FormLabel> */}
      <RadioGroup row aria-label="position" name="position" defaultValue="top" value={this.state.selectedRadioOption}>

      <FormControlLabel
          value="GoogleVision"
          control={<Radio color="primary" />}
          label="Show Results from Google Vision"
          labelPlacement="Show Results from Google Vision"
          name="gender"
        />

                {/* <input type="radio" value="GoogleVision" name="gender" /> Show Results from Google Vision<br /> */}
                
                {this.state.googleVisionVisible &&
                  <div style={radioBtnMainView}>

                    {
                      this.state.finalDataResult && Object.keys(this.state.finalDataResult).length > 0 && this.state.finalDataResult.pages.map((pageData) =>
                        <div >
                          {
                            pageData.blocks.map((blockData, blockIdx) =>
                              <div style={{ padding: 0 }}>
                                <div>
                                  <span style={{ backgroundColor: '#824CC0', color: 'white', flexWrap: 'wrap', padding: 0, marginTop: 5, borderRadius: 10 }}>
                                    +Block {blockIdx + 1} (score : {blockData.confidence})
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

<FormControlLabel
          value="SimpleGoogleVision"
          control={<Radio color="primary" />}
          label="Simple Google Vision"
          labelPlacement="Simple Google Vision"
          name="gender"
        />

<FormControlLabel
          value="AdvancedGoogleVision"
          control={<Radio color="primary" />}
          label="Advanced Google Vision"
          labelPlacement="Advanced Google Vision"
          name="gender"
        />
                
                {/* <input type="radio" value="SimpleGoogleVision" name="gender" /> Simple Google Vision<br /> */}
                {/* <input type="radio" value="AdvancedGoogleVision" name="gender" /> Advanced Google Vision<br /> */}
                {/* <hr style={horizontalLine} /> */}

<FormControlLabel
          value="AzureTables"
          control={<Radio color="primary" />}
          label="Show Results from Azure Tables"
          labelPlacement="Show Results from Azure Tables"
          name="gender"
        />
                {/* <input type="radio" value="AzureTables" name="gender" /> Show Results from Azure Tables<br /> */}
                
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
                    <Grid>
                      <FlexGrid
                      headersVisibility="Column"
                      autoGenerateColumns={false}
                      itemsSource={this.state.azureDataResults}
                      style={{
                        height: "auto",
                        maxHeight: 400,
                        margin: 0,
                        maxWidth:400
                      }}>
                      {this.state.azureDataResults.length>0 && Object.keys(this.state.azureDataResults[0]).map(key =>
                        <FlexGridColumn
                      binding={key}
                      header={key}
                      cssClass="cell-header"
                      // width="*"
                      // minWidth={20}
                      // visible={key != "user_id"}
                      style={{backgroundColor:'grey'}}
                      ></FlexGridColumn>
                     )}
                      <wjFilter.FlexGridFilter></wjFilter.FlexGridFilter>
                      </FlexGrid>
                      </Grid>
                  </div>}

                  <FormControlLabel
          value="AzureForm"
          control={<Radio color="primary" />}
          label="Azure Form"
          labelPlacement="Azure Form"
          name="gender"
        />
                {/* <input type="radio" value="AzureForm" name="gender" /> Azure Form<br /> */}
                <FormControlLabel
          value="AzureDocAnalyzer"
          control={<Radio color="primary" />}
          label="Azure Document Analyzer"
          labelPlacement="Azure Document Analyzer"
          name="gender"
        />
                {/* <input type="radio" value="AzureDocAnalyzer" name="gender" /> Azure Document Analyzer<br /> */}

                <FormControlLabel
          value="GoogleTables"
          control={<Radio color="primary" />}
          label="Show Results from Google Tables"
          labelPlacement="Show Results from Google Tables"
          name="gender"
        />
                {/* <hr style={horizontalLine} /> */}
                {/* <input type="radio" value="GoogleTables" name="gender" /> Show Results from Google Tables<br/> */}
                <FormControlLabel
          value="TesseractTables"
          control={<Radio color="primary" />}
          label="Tesseract Tables"
          labelPlacement="Tesseract Tables"
          name="gender"
        />
                {/* <input type="radio" value="TesseractTables" name="gender" /> Tesseract Tables<br/> */}

                <FormControlLabel
          value="AzureCV"
          control={<Radio color="primary" />}
          label="Azure CV"
          labelPlacement="Azure CV"
          name="gender"
        />
                {/* <input type="radio" value="AzureCV" name="gender" /> Azure CV<br/> */}
                <FormControlLabel
          value="OpenCV"
          control={<Radio color="primary" />}
          label="Open CV"
          labelPlacement="Open CV"
          name="gender"
        />  
                {/* <input type="radio" value="OpenCV" name="gender" /> Open CV<br/> */}
                {/* {this.state.googleTableVisible &&
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
                } */}
                </RadioGroup>
    </FormControl>
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
            {/* </div> */}
          </CCol>

        </CRow>
      </CCard>
    );
  }
}
export default withStyles(doc_styles, { withTheme: true }) (PdfViewGoogleAzure)
