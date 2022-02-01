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
    CForm,
    
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
import { useHistory } from "react-router";
 
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
const IssueHistoryData=()=>
{
    const history = useHistory();
    const [Isloader, setIsloader] = useState(false);
    const [historyData, setHistoryData] = useState([]);

        useEffect(() => {

        getHistoryData()
      }, [])
    
    const getHistoryData = () => {
        setIsloader(true)
    let companyId = localStorage.getItem('companyId')
    console.log("===companyId in UserData:::",companyId)
    let userId = localStorage.getItem('userId')
    console.log("===userId in UserData:::",userId)
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem('access_token'),
      // reqFrom: "ADMIN",
    };
    let requestBody = {
        company_id: companyId,
        user_id: userId       
      }
      console.log("requestBody of Issue History::::",requestBody)
    axios({
      method: "POST",
      url: settings.serverUrl + "/getReportHistory",
      data: JSON.stringify(requestBody),
      headers,
    }).then((response) => {
      console.log("Response", response.data.result);
      if (response.data.err) {
        // alert(response.data.err);
        toast.error(response.data.err, toast_options);
      }else{
        if(response.data.result){
          setHistoryData(response.data.result)
          setIsloader(false)
        }
      }
    }).catch(err => {
      toast.error(err.message, toast_options);
      // console.log("Record Issue Error Processor Data", err)
      localStorage.clear();
      history.push("/");
    });

    }


  return (
    <Grid className="container-fluid" style={{marginTop:40}}>
        <Grid item xs={12} style={{ marginTop: 25}}>
            <FlexGrid
                headersVisibility="Column"
                autoGenerateColumns={false}
                // initialized={this.initializeDailyGrid}
                itemsSource={historyData}
                style={{
                  height: "auto",
                  maxHeight: 400,
                  margin: 0,
                }}
              >
                {historyData.length>0 && Object.keys(historyData[0]).map(key =>
                <FlexGridColumn
                binding={key}
                header={key}
                cssClass="cell-header"
                width="*"
                visible={key != "hist_id"}
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
  );
}
 
export default IssueHistoryData;