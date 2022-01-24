import React, { useState, useEffect } from 'react';
import {
    CRow,
    CCol,
    CCard,
    CInput,
    CInputGroup,
    CButton,
    CSelect,
    CCardHeader,
    CCardBody,
    CForm
  } from '@coreui/react';
  import CircularProgress from "@material-ui/core/CircularProgress";
import * as wjCore from '@grapecity/wijmo';
import { FlexGrid, FlexGridColumn, FlexGridCellTemplate } from '@grapecity/wijmo.react.grid';
import * as wjFilter from "@grapecity/wijmo.react.grid.filter";
import * as wjGrid from '@grapecity/wijmo.react.grid';
import '@grapecity/wijmo.styles/wijmo.css';
import * as wjcCore from "@grapecity/wijmo";
import settings from 'src/config/settings';
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import { ToastContainer, toast } from 'react-toastify';

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
  progress: undefined,
}

const CompniesData = () => {
  const [Isloader, setIsloader] = useState(false);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {

    getCompanyData()
  }, [])

  const getCompanyData = () => {
    setIsloader(true)
    const headers = {
      "Content-Type": "application/json",
      // Authorization: "Bearer " + logginUser.token,
      // reqFrom: "ADMIN",
    };
    axios({
      method: "GET",
      url: settings.serverUrl + "/getCompaniesData",
      headers,
    }).then((response) => {
      console.log("Response", response.data.result);
      if (response.data.err) {
        // alert(response.data.err);
        toast.error(response.data.err, toast_options);
      }else{
        if(response.data.result){
          // let proArr = [];
          // response.data.result.map(processPbj =>{
          //   let processPbjCopy = {...processPbj}
          //   delete processPbjCopy.processor_id;
          //   proArr.push(processPbjCopy)
          // })
          // setTableData(proArr)
          setTableData(response.data.result)
          setIsloader(false)
        }
      }
    }).catch(err => {
      toast.error(err.message, toast_options);
      // console.log("Record Issue Error Processor Data", err)
    });
  }

  return (
    <Grid className="container-fluid">
        <Grid item xs={12} style={{ marginTop: 25}}>
          <FlexGrid
              headersVisibility="Column"
              autoGenerateColumns={false}
              // initialized={this.initializeDailyGrid}
              itemsSource={tableData}
              style={{
                height: "auto",
                maxHeight: 400,
                margin: 0,
              }}
            >
              {tableData.length>0 && Object.keys(tableData[0]).map(key =>
              <FlexGridColumn
              binding={key}
              header={key}
              cssClass="cell-header"
              width="*"
              visible={key != "comp_id"}
              style={{backgroundColor:'grey'}}
              ></FlexGridColumn>
              )}  
              <wjFilter.FlexGridFilter></wjFilter.FlexGridFilter>
            </FlexGrid>
          </Grid>

          {Isloader &&
          <div style={loader}>
            <CircularProgress style={{ margin: "28% auto", display: "block" }} />
          </div>}
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
          
    </Grid>
    );}
export default CompniesData;
