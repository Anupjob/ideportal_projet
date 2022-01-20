import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
  CForm,
  CInputGroup,
  CHeader,
  CToggler,
  CHeaderBrand,
  CInput,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CSubheader,
  CBreadcrumbRouter,
  CLink,
  CCol,
  CButton,
  CRow
} from '@coreui/react'
import { CImg } from '@coreui/react'
import { Link, useHistory } from 'react-router-dom'
// import SimpleImageSlider from "react-simple-image-slider";
import DocumentDetails from '../views/details/DocumentDetails'
// routes config
import routes from '../routes'

import {
  TheHeaderDropdown,
  TheHeaderDropdownMssg,
  TheHeaderDropdownNotif,
  TheHeaderDropdownTasks
} from './index'

const useStyles = makeStyles(theme => ({
  header_bg: {
    background: "rgb(131,73,191)",
    background: "linear-gradient(-90deg, rgba(131,73,191,1) 16%, rgba(25,229,246,1) 84%)",
    minHeight: "390px",
    position: "fixed",
    width: "100%",
    top: 0,
    left: 0,
    "@media (max-width: 1200px)": {
      minHeight: "430px",
    },
    "@media (max-width: 767px)": {
      minHeight: "600px",
    }
  },
  header_icon: {
    width: "200px",
    display: "block",
    position: "absolute",
    bottom: "10px",
    right: "10px",
    "@media (max-width: 767px)": {
      marginTop: "0",
    }
  },
  back_icon: {
    position: "absolute",
    left: "30px",
    bottom: "10px",
  },
  header_bg1: {
    background: "rgb(131,73,191)",
    background: "linear-gradient(-90deg, rgba(131,73,191,1) 16%, rgba(25,229,246,1) 84%)",
    zIndex: "20",
    border: "0",
    paddingRight: "20px",
    position: "fixed"
  },
  logo_image: {
    whiteSpace: "nowrap",
    background: "url(./dg_logo.png) no-repeat",
    backgroundSize: "100px",
    padding: "40px 0px 40px 130px",
    backgroundPosition: "0 50%",
    color: "#fff",
    display: "block",
    marginLeft: "40px",
    fontSize: "2.2em",
    "@media (max-width: 1200px)": {
      backgroundSize: "70px",
      padding: "40px 0px 40px 90px",
      backgroundPosition: "0 50%",
      fontSize: "1.6em",
    }

  },
  right_content: {
    width: "580px",
    margin: "0",
    "@media (max-width: 1200px)": {
      width: "100%",
      margin: "-20px 0 20px 40px"
    },
    "@media (max-width: 767px)": {
      // marginLeft: "50px",

    }
  },
  report_block: {
    width: "350px",
    display: "table",
    float: "right",
    marginBottom: "80px"
  },
  report_box: {
    width: "20%",
    background: "url(./list_icon.png) no-repeat",
    backgroundSize: "35px",
    backgroundPosition: "50% 0",
    padding: "50px 15px 0 15px",
    color: "#fff",
    display: "table",
    textAlign: "center",
    fontSize: "0.8em",
    boxShadow: "1px 0px 0 #fff",
    float: "left"
  },
  report_title: {
    fontSize: "1em",
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "20px"
  },
  acc_activity: {
    color: "#fff",
    margin: "4em 0",
  },

  bottom_content: {
    background: "none",
    border: "none",
    paddingLeft: "40px",
    display: "block",
    "@media (max-width: 767px)": {
      // paddingLeft: "50px",

    }
  },
  grid_icon: {
    fontSize: "2.7em",
    color: "#fff",
    margin: "-2px 0 0 17px",
    cursor: "pointer"
  },
  carousel_arrow_right: {
    color: "rgb(255, 255, 255)",
    background: "none",
    position: "absolute",
    right: "20px",
    border: "none",
  },
  carousel_arrow_left: {
    color: "rgb(255, 255, 255)",
    background: "none",
    position: "absolute",
    left: "20px",
    border: "none",
  }
}));


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

const TheHeaderNew = (props) => {
  const history = useHistory()

  const [urlVal, SetUrlVal] = useState("")
  // const [urlValTrue, SetUrlValTrue] = useState(false)
  const [sliderData, SetSliderData] = useState(["./canvas.png", "./canvas.png", "./canvas.png", "./canvas.png", "./canvas.png", "./canvas.png", "./canvas.png", "./canvas.png", "./canvas.png", "./canvas.png", "./canvas.png"])

  const [counter, setCounter] = useState(0)


  useEffect(() => {
    // console.log("url props::", props)
  }, [])
  console.log("url props::", props)
  // console.log("urlVal", urlVal);
  // console.log("useEffect")

  // console.log("url props::", this.props.document)

  const dispatch = useDispatch()
  const classes = useStyles();
  const sidebarShow = useSelector(state => state.sidebarShow)

  const url = useSelector(state => state.url)
  console.log("url::", url)

  // const urll = () => {
  //   let CurrUrl = window.location.href
  //   console.log("CurrUrl", CurrUrl);
  //   let lastSegment = CurrUrl.split("/").pop();
  //   SetUrlVal(lastSegment)
  //   console.log("urlVl", urlVal)

  //   dispatch({ type: 'set', sidebarShow: val })
  // }

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch({ type: 'set', sidebarShow: val })
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch({ type: 'set', sidebarShow: val })
  }

  let change = ""
  if (window.location.href.includes("detail")) {
    change = "detail page"
  }

  if (window.location.href.includes("details")) {
    change = "details page"
  }

  if (window.location.href.includes("incoming")) {
    change = "incoming page"
  }
  console.log("change", change)



  const CustomRightArrow = ({ onClick, ...rest }) => {
    const {
      onMove,
      carouselState: { currentSlide, deviceType }
    } = rest;
    console.log("currentSlide: ", currentSlide);
    console.log("deviceType: ", deviceType);
    setCounter(currentSlide)
    // onMove means if dragging or swiping in progress.
    return <button onClick={() => {
      onClick();
      //RightArrow();
    }} className={classes.carousel_arrow_right} ><i class="fa fa-chevron-right" aria-hidden="true"></i></button>;
  };

  const CustomLeftArrow = ({ onClick, ...rest }) => {
    const {
      onMove,
      carouselState: { currentSlide, deviceType }
    } = rest;
    setCounter(currentSlide)
    // onMove means if dragging or swiping in progress.
    return <button onClick={() => {
      onClick();
      //LeftArrow();
    }} className={classes.carousel_arrow_left} ><i class="fa fa-chevron-left" aria-hidden="true"></i></button>;
  };

  return (

    <>
      <div className={classes.header_bg}></div>
      <CHeader withSubheader className={classes.header_bg1}>
        {/* <CToggler
          inHeader
          className="ml-md-3 d-lg-none"
          onClick={toggleSidebarMobile}
        />
        <CToggler
          inHeader
          className="ml-3 d-md-down-none"
          onClick={toggleSidebar}
        /> */}

        <CHeaderNav className="mr-auto">
          <CHeaderNavItem >
            <Link to="/document_list" className={classes.logo_image}>
              IMAGE DATA EXTRACT
            </Link>
          </CHeaderNavItem>

        </CHeaderNav>
        <CHeaderNav className={classes.right_content}>
          <CInputGroup>
            <CInput type="text" />
          </CInputGroup>

          <h2 className={classes.grid_icon}>
            <i class="fa fa-th" aria-hidden="true"></i>
          </h2>

          <TheHeaderDropdown />
        </CHeaderNav>

        <CSubheader className={classes.bottom_content} style={{ border: "0" }}>
          <CRow>

            <CCol md="8">
              <h4 className={classes.acc_activity}>&nbsp;</h4>
            </CCol>

            <CCol md="4">
              {change == 'detail page' &&
                <div style={{ width: "400px", padding: "0 50px", position: "absolute", right: "20px" }}>
                  {/* <div style={{ width: "100px", height: "100px", position: "absolute", background: "#f00" }}></div> */}
                  <Carousel responsive={responsive}
                    //focusOnSelect={true}
                    customLeftArrow={<CustomLeftArrow />}
                    customRightArrow={<CustomRightArrow />}
                  >
                    {sliderData.length > 0 && sliderData.map((obj, idx) => (

                      <div

                        style={{ background: idx == counter ? "rgb(5, 162, 210)" : 'none', margin: "5px" }}
                      >
                        <CImg src={obj} style={{ width: "100%", opacity: idx == counter ? "0.6" : '1' }} /></div>
                    ))}

                  </Carousel>
                  <div style={{ color: "#fff", textAlign: "right", marginTop: "15px" }}>Pages {counter} of {sliderData.length}</div>
                </div>
              }
              {/* <div style={{ fontSize: "3em", color: "#f00" }}>Change{change}</div> */}

              {change == 'details page' &&
                <CRow>
                  <CCol>
                    <div className={classes.report_block}>
                      <h4 className={classes.report_title}>DOCUMENT REPORT CARD</h4>
                      <div className={classes.report_box}>
                        RECIEVED
                        12/12/21
                      </div>
                      <div className={classes.report_box}>
                        PROCESSED
                        12/12/21
                      </div>
                      <div className={classes.report_box}>
                        COMPLETED
                        12/12/21
                      </div>
                      <div className={classes.report_box} style={{ boxShadow: "none" }}>
                        REPORTED
                        12/12/21
                      </div>
                    </div>
                  </CCol>
                </CRow>
              }

              {(
                change == 'incoming page'
                //  || change == 'detail page'
              ) &&
                <div className={classes.header_icon}>
                  <CRow>
                    <CCol xs="4">
                    </CCol>
                    <CCol xs="4" >
                      <Link to="" class="fa fa-print" aria-hidden="true" style={{ color: "#fff", fontSize: "2em" }}></Link>
                    </CCol>
                    <CCol xs="4" >
                      <Link to="" class="fa fa-download" aria-hidden="true" style={{ color: "#fff", fontSize: "2em" }}></Link>
                    </CCol>
                  </CRow>
                </div>
              }

            </CCol>
            <div className={classes.back_icon}>
              <CButton onClick={() => {
                // e.preventDefault();
                history.goBack()
              }}
                class="fa fa-chevron-circle-left" aria-hidden="true" style={{ color: "#fff", fontSize: "2em", border: "none", background: "none" }}>

              </CButton>
            </div>
          </CRow>

        </CSubheader>

      </CHeader >
    </>
  )
}

export default TheHeaderNew
