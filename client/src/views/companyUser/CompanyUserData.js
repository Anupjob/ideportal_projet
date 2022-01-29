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

const btn_style = {
  width: "15%", 
  background: "#4ea7d8", 
  border: "#4ea7d8",
  marginTop:30 
}
const CompanyUserData = () => {
  const [Isloader, setIsloader] = useState(false);
  const [companyId, setCompanyId] = useState('');
  const [tableData, setTableData] = useState([]);
  
  useEffect(() => {

    getUsersData()
  }, [])

  const getUsersData = () => {
    setIsloader(true)
    let companyId = localStorage.getItem('companyId')
    console.log("===companyId in UserData:::",companyId)
    const headers = {
      "Content-Type": "application/json",
      // Authorization: "Bearer " + logginUser.token,
      // reqFrom: "ADMIN",
    };
    axios({
      method: "POST",
      url: settings.serverUrl + "/getUsersData",
      data: JSON.stringify({
        companyId: companyId,        
      }),
      headers,
    }).then((response) => {
      console.log("Response", response.data.result);
      if (response.data.err) {
        // alert(response.data.err);
        toast.error(response.data.err, toast_options);
      }else{
        if(response.data.result){
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

      <Grid className="container-fluid" style={{marginTop:40}}>
      <CButton type="submit" color="primary" size="lg" style={btn_style} >Add User</CButton>

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
                visible={key != "user_id"}
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
export default CompanyUserData;
