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
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment'
import { Button } from '@material-ui/core';
import { Translate } from '@material-ui/icons';
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

 
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
  const button_style={
    fontSize: "26px",
    color: "#999",
    background: "none",
    border: "1px solid #999",
    borderRadius: "50px",
    width: "30px",
    height: "30px",
    float: "right",
    lineHeight: 0, 
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
const IssueHistoryData=()=>
{
    const history = useHistory();
    const [Isloader, setIsloader] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const compId = useSelector(state => state.companyId)
const [rowAndColumn,setRowAndColumn]=useState(false)
const [rowColumnData,setRowColumnData]=useState([])

console.log(rowColumnData,'table')
    useEffect(() => {
      if(compId){
        getHistoryData()
      }
      else{
        setTimeout(() => {
          toast.warn("Please Select Company", { toast_options });
        }, 1000);
      }
    }, [])
    
    const getHistoryData = () => {
        setIsloader(true)
    // let companyId = localStorage.getItem('companyId')
    // console.log("===companyId in UserData:::",companyId)
    let userId = localStorage.getItem('userId')
    console.log("===userId in UserData:::",userId)
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem('access_token'),
      // reqFrom: "ADMIN",
    };
    let requestBody = {
        company_id: compId,
        user_id: userId       
      }
      console.log("requestBody of Issue History::::",requestBody)
    axios({
      method: "POST",
      url: settings.serverUrl + "/getReportHistory",
      data: JSON.stringify(requestBody),
      headers,
    }).then((response) => {
      console.log("Response from issue history===", response.data.result);
      if (response.data.err) {
        // alert(response.data.err);
        toast.error(response.data.err, toast_options);
      }else{
        if(response.data.result){
          setHistoryData(response.data.result)
        }
      }
      setIsloader(false)
    }).catch(err => {
      toast.error(err.message, toast_options);
      // console.log("Record Issue Error Processor Data", err)
      if(err.message.includes("403")){
      localStorage.clear();
      history.push("/");
      }
    });

    }
const getIsuessRowAndColumn=(ctx)=>{
  
  let newRows = {}
  let arr=[]
  Object.keys(ctx.item["Error Message"]["reportIsuueCells"]).map((item)=>{
    //  rowcolumnTable.push((values) => ({ ...values, [item]:rowColumnData.item["Error Message"]["reportIsuueCells"][item] }))
    // data.push({ [item]:(ctx.item["Error Message"]["reportIsuueCells"][item] )})
    // newRows[item] =ctx.item["Error Message"]["reportIsuueCells"][item]
    // reportIsuueCells.map(rng=>{
      if((item.substring(0,3))!=="row"){
      
      let rng=ctx.item["Error Message"]["reportIsuueCells"][item]
  
      for (let rowIdx = rng.topRow; rowIdx <= rng.bottomRow; rowIdx++) {
        let cols=[]
       if(Object.keys(newRows).filter(curr=>curr==="row"+rowIdx).length>0){
        cols= newRows["row"+rowIdx]
       }
      
        console.log("row"+rowIdx)
        for (let cIdx = rng.leftCol; cIdx <= rng.rightCol; cIdx++) {
          cols.push("col"+cIdx)
        console.log("col"+cIdx)
        }
        newRows["row"+rowIdx] = cols
        }
       
      }
        else {
          newRows[item] =ctx.item["Error Message"]["reportIsuueCells"][item]
        }
    })

   console.log(newRows,'newrows')
  
     let reportIsuueCellsCopy = {
      ...rowColumnData,
      ...newRows
    }
  setRowAndColumn(true)
  setRowColumnData([reportIsuueCellsCopy])
    }
    const rowcolumnclose=()=>{
    setRowAndColumn(false)
    setRowColumnData([])
    }
 console.log(historyData,'history issue')
  return (
    <>
    <CCard>
    <CRow style={title_text}>
         {JSON.parse(localStorage.getItem("Deatails")).history.location.state.finalFileName}
        </CRow>
    </CCard>
    <Grid className="container-fluid" style={{marginTop:40}}>
        <Grid item xs={12} style={{ marginTop: 25}}>
           {historyData && historyData.length>0 ?
           <FlexGrid
           headersVisibility="Column"
           isReadOnly={true}
           autoGenerateColumns={false}
           // initialized={this.initializeDailyGrid}
           itemsSource={historyData}
          //  textAlign="center"
          //  margin="0 auto"
           style={{
             height: "auto",
             maxHeight: 400,
            margin:'0 auto'
           }}
         >
           <FlexGridColumn
           binding="User Email"
           header="USER EMAIL"
           cssClass="cell-header"
           width="*"
           margin="auto"
           style={{backgroundColor:'grey'}}
           >
{/* 
<FlexGridCellTemplate cellType="Cell" template={ctx =>
        
        <React.Fragment>
            <div style={{position:'absolute',transform:'translateY(-50%)',  top: '50%'}}> {ctx.item["User Email"]}</div>
        </React.Fragment>} /> */}


           </FlexGridColumn>
           <FlexGridColumn
           binding="Error Message"
           header="ERROR MESSAGE"
           cssClass="cell-header"
           width="*"
           style={{backgroundColor:'grey'}}
           >
             <FlexGridCellTemplate cellType="Cell" template={ctx =>
        
                  <React.Fragment>
                       {console.log(ctx,'ctx')}
                       <div >   {ctx.item["Error Message"].issue}</div>
                  </React.Fragment>} />
           </FlexGridColumn>
         
           <FlexGridColumn
                binding="Insert Time"
                header="INSERT TIME"
                cssClass="cell-header"
                width="*"
                style={{ backgroundColor: 'grey' }}>
                {/* <FlexGridCellTemplate cellType="Cell" template={ctx =>
                  <React.Fragment>
                    {ctx.item["Insert Time"] ?
                     <div style={{position:'absolute',transform:'translateY(-50%)',  top: '50%'}}><span>{moment(ctx.item["Insert Time"]).format("MM/DD/YYYY hh:mm A")}</span></div>
                      :""
                    }
                  </React.Fragment>} /> */}
              </FlexGridColumn>
              <FlexGridColumn
          //  binding="Error Message"
          //  header="ISSUES ROWS AND COLUMN"
           cssClass="cell-header"
          //  width="*"
           maxHeight="20px"
     
           multiLine={true}
           style={{backgroundColor:'grey'}}
           >
             <FlexGridCellTemplate cellType="Cell"  template={ctx =>
        
  <React.Fragment>
 {Object.keys(ctx.item["Error Message"]["reportIsuueCells"]).length>0?
   <span style={{ cursor: "pointer" ,marginLeft:'50%'}}>
                        <img
                          src="../error-icon-org.png"
                          style={{ height: 16 }}
                          onClick={()=>getIsuessRowAndColumn(ctx)}
                        />                  
                      </span>:''}
    </React.Fragment>} 
            
                  />
           </FlexGridColumn>
           {rowAndColumn &&
            <Dialog open={rowAndColumn}
            onClose={rowcolumnclose}>
            <DialogTitle style={{fontWeight:'bold',fontSize:18}}>Rows And Columns
            <button
        style={button_style}
        onClick={rowcolumnclose}>&times;</button></DialogTitle>
           
            <DialogContent style={{ minWidth: 100 }}>
              <DialogContentText>
             

  <FlexGrid
                     headersVisibility="Column"
                      autoGenerateColumns={false}
                      isReadOnly={true}
                      itemsSource={rowColumnData}
                      // initialized={initializeGrid}
                      // ref={this.theGrid}
                   
                      style={{
                        height: "auto",
                        maxHeight: 400,
                        margin: 0,
                      }}

                      selectionMode="MultiRange"
                      showSelectedHeaders="All"
                      // selectionChanged={(s) => {s.selection._col=3}}
                      
                        
                    >
                      
                     {rowColumnData.length>0 && Object.keys(rowColumnData[0]).map(key =>
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
             

              </DialogContentText>
            </DialogContent>
           
          </Dialog>
          }
           <wjFilter.FlexGridFilter></wjFilter.FlexGridFilter>
         </FlexGrid>
         :
         <p style={{ width: "100%",color: "#c00", marginTop:150, textAlign: "center", fontSize: "1.6em" }}>{Isloader?"": "No Record Found!!"}</p>
           }
            
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
        
  </>);
}
 
export default IssueHistoryData;







