import React from 'react'

export const doc_styles = theme => ({
    title_text: {
        color: 'white', 
        position: "fixed", 
        top: "87px", 
        left: "85px", 
        zIndex: "1030", 
        fontWeight: "bold",
      "@media (max-width: 1200px)": {
        top: '135px'
      },
    },
    report_block: {
display: "table",
marginBottom: "20px",
position: "fixed",
zIndex: "500000",
right: "8px",
top: "80px",
"@media (max-width: 1200px)": {
  top: '135px'
},
    },
    report_box: {
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
    },
    report_title: {
      fontSize: "1em",
      color: "#fff",
      textAlign: "right",
      fontWeight: "700",
      margin: "0 20px 20px 0",
      cursor: "pointer",
      width:200,
      
    },
    

  });