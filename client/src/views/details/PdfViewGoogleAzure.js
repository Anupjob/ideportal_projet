import React from 'react'
import {
  CCard,
  CCol,
  CProgress,
  CRow,
} from '@coreui/react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const pdfMainView = { 
    backgroundColor: 'transparent', 
    border: 0 
}
const pdfContentView = {
    display:'table',
    backgroundColor:'white',
    boxShadow: '0px 4px 32px 1px #00000029',
}
const radioBtnDiv = {
    backgroundColor:'white',
    padding:5
}
const radioBtnMainView = {
    padding:5,overflowY: 'scroll',
    maxHeight:400
}
const radioBtnSubView = {
    margin:5,padding:5,
    border: '2px solid #D2D9DA',
    backgroundColor:'#E7F7EA'
}
const horizontalLine = {
    color: '#D3D3D3',
    height: .2
}
class PdfViewGoogleAzure extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        googleVisionVisible:false,
        azureTableVisible:false,
        googleTableVisible:false  
      }
      this.onChangeValue = this.onChangeValue.bind(this);
    }
    
    onPageLoad(info) {
        const {
          height, width, originalHeight, originalWidth
        } = info;
        console.log(height, width, originalHeight, originalWidth);
    }
    onChangeValue(event) {
        // console.log("===Radio Button click::", event.target.value);
        if(event.target.value == "GoogleVision"){
            this.setState({ googleVisionVisible:true,azureTableVisible:false,googleTableVisible:false })
        }else if(event.target.value == "AzureTables"){
            this.setState({ azureTableVisible:true,googleVisionVisible:false,googleTableVisible:false })
        }else{
            this.setState({ googleTableVisible:true,googleVisionVisible:false,azureTableVisible:false })
        }
    }
  render() {
    return (
        <CCard style={pdfMainView}>
        <CRow>
        <CCol xs='1'></CCol>
          <CCol xs="5">
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
            <CCol xs='2'></CCol>
            <CCol xs="3">
            <div style={radioBtnDiv}>
            <div onChange={this.onChangeValue}>
            <input type="radio" value="GoogleVision" name="gender" /> Show Results from Google Vision<br/>
            {this.state.googleVisionVisible &&
            <div style={radioBtnMainView}>
            <div style={radioBtnSubView}>
            Google Vision Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad
            squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
            sapiente ea proident.   
            </div>
            <div style={radioBtnSubView}>
            Google Vision Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad
            squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
            sapiente ea proident.   
            </div>
            <div style={radioBtnSubView}>
            Google Vision Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad
            squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
            sapiente ea proident.   
            </div>
            <div style={radioBtnSubView}>
            Google Vision Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad
            squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
            sapiente ea proident.   
            </div>
            <div style={radioBtnSubView}>
            Google Vision Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad
            squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
            sapiente ea proident.   
            </div>
            </div>}
            <hr  style={horizontalLine}/>
            <input type="radio" value="AzureTables" name="gender" /> Show Results from Azure Tables<br/>
            {this.state.azureTableVisible &&
           <div style={radioBtnMainView}>
           <div style={radioBtnSubView}>
            Azure Tables Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad
            squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
            sapiente ea proident.   
            </div>
            <div style={radioBtnSubView}>
            Azure Tables Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad
            squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
            sapiente ea proident.   
            </div>
            </div>}
            <hr  style={horizontalLine}/>
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
            </div>
            </div>
          </CCol>
          </CRow>
          </CCard>
    );
  }
}
export default PdfViewGoogleAzure
