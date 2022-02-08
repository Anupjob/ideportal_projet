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
  CRow,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  //CImg,
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
    width: "100%",
    display: "table",
    position: "fixed",
    zIndex: "0",
    height: "180px",
    top: "0",
    "@media (max-width: 1200px)": {
      height: "230px",
    },
    "@media (max-width: 767px)": {
      height: "260px",
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
    bottom: "12px",
    "@media (max-width: 1200px)": {
      bottom: "25px"
    },
    // "@media (max-width: 767px)": {
    //   bottom: "67px"
    // }
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
    backgroundSize: "70px",
    padding: "20px 0px 20px 90px",
    backgroundPosition: "0 50%",
    color: "#fff",
    display: "block",
    marginLeft: "40px",
    fontSize: "1.8em",
    "@media (max-width: 1200px)": {
      // backgroundSize: "70px",
      // padding: "40px 0px 40px 90px",
      // backgroundPosition: "0 50%",
      // fontSize: "1.6em",
    }

  },
  right_content: {
    width: "580px",
    margin: "0",
    "@media (max-width: 1200px)": {
      width: "100%",
      margin: "-10px 0 10px 40px;"
    },
    "@media (max-width: 767px)": {
      // marginLeft: "50px",

    }
  },
  report_block: {
    width: "350px",
    display: "table",
    float: "right",
    marginBottom: "20px"
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
    cursor: "pointer"
  },
  acc_activity: {
    color: "#fff",
    // margin: "4em 0",
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
    margin: "-2px 0 0 0px",
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


  const [Toggle, setToggle] = useState(false)

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
  const ButtonGroup = ({ next, previous, goToSlide, ...rest }) => {
    const { carouselState: { currentSlide } } = rest;
    return (
      <div className="carousel-button-group" style={{position: "absolute",  zIndex: "1", bottom: "12px", right: "40px"}}>
        {/* <CButton className={currentSlide === 0 ? 'disable' : ''} onClick={() => previous()} />
        <CButton onClick={() => next()} /> */}
 <div style={{ color: "#fff", textAlign: "right", marginTop: "15px" }}>Pages 
                      <CInput type='text' 
                      value={counter} 
                      onChange={(e) => {
                        goToSlide(e.target.value);
                        setCounter(e.target.value)
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
                      /> of {sliderData.length}</div>
        {/* <CButton onClick={() => goToSlide(currentSlide + 4)} > Go to any slide </CButton> */}
      </div>
    );
  };
  const sliderClick = () => {
    setToggle(!Toggle)
  }


  console.log("Toggle", Toggle)
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
            <i class="fa fa-search" aria-hidden="true" style={{ position: "absolute", zIndex: "11", top: "10px", left: "10px", color: "#999" }}></i>
            <CInput placeholder="Search" aria-label="Search" style={{ paddingLeft: "30px" }} />

          </CInputGroup>

          <CDropdown inNav className="c-header-nav-items mx-3" direction="down">
            <CDropdownToggle className="c-header-nav-link" caret={false}>
              <h2 className={classes.grid_icon}>
                <i class="fa fa-th" aria-hidden="true"></i>
              </h2>


            </CDropdownToggle>
            <CDropdownMenu className="pt-0" placement="bottom-end">
              <CDropdownItem onClick={() => { history.push('/compnies') }} >
                Companies List
              </CDropdownItem>
              <CDropdownItem divider />
              <CDropdownItem onClick={() => { history.push('/companyUser') }}>
                Users List
              </CDropdownItem>
              <CDropdownItem divider />
              <CDropdownItem onClick={() => { history.push('/processors') }}>
                Processor List
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <TheHeaderDropdown />
        </CHeaderNav>

        <CSubheader className={classes.bottom_content} style={{ border: "0" }}>
          <CRow>

            <CCol md="8">
              <h4 className={classes.acc_activity}>&nbsp;</h4>
            </CCol>

            <CCol md="4">
              {/* {change == 'detail page' &&

                <div className={classes.report_block}>
                  <h4 className={classes.report_title} onClick={() => sliderClick()}>PDF VIEWER <i class="fa fa-chevron-down" aria-hidden="true"></i>
                  </h4>
                  {Toggle &&
                    <div style={{ width: "400px", padding: "20px 50px", position: "fixed", right: "20px", background: '#8349bf', boxShadow: "0px 4px 6px rgba(0,0,0,0.5)", border: "1px solid #fff", borderRadius: "5px", paddingBottom: "60px" }}>
                      <Carousel responsive={responsive} focusOnSelect={true}
                        customButtonGroup={<ButtonGroup />}
                        customLeftArrow={<CustomLeftArrow />}
                        customRightArrow={<CustomRightArrow />}
                        style={{ display: "table" }}
                      >
                        {sliderData.length > 0 && sliderData.map((obj, idx) => (

                          <div style={{ background: idx == counter ? "rgb(5, 162, 210)" : 'none', margin: "5px" }} >
                            <CImg src={obj} style={{ width: "100%", opacity: idx == counter ? "0.6" : '1' }} /></div>
                        ))}

                      </Carousel>
                     
                    </div>
                  }

                </div>

              } */}
              {/* <div style={{ fontSize: "3em", color: "#f00" }}>Change{change}</div> */}

              {/* {change == 'details page' &&
                <CRow>
                  <CCol>

                    <div className={classes.report_block}>


                      <h4 className={classes.report_title} onClick={() => sliderClick()}>DOCUMENT REPORT CARD <i class="fa fa-chevron-down" aria-hidden="true"></i>
                      </h4>
                      {Toggle &&
                        <div style={{ width: "400px", padding: "20px", position: "fixed", right: "20px", background: '#8349bf', boxShadow: "0px 4px 6px rgba(0,0,0,0.5)", border: "1px solid #fff", borderRadius: "5px" }}>
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
                      }

                    </div>
                  </CCol>
                </CRow>
              } */}

              {
                change == 'incoming page' &&
                <div style={{ width: "100%" }}>
                  <CRow>
                    <CCol>
                      <div className={classes.report_block}>
                        <h4 className={classes.report_title} >&nbsp;
                        </h4>
                      </div>
                    </CCol>
                  </CRow>
                  {/* <div className={classes.header_icon}>
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
                  </div> */}
                </div>
              }

            </CCol>
            {
              change == 'incoming page' ?
                <div className={classes.back_icon}></div>
                :
                <div className={classes.back_icon}>
                  <CButton onClick={() => {
                    // e.preventDefault();
                    history.goBack()
                  }}
                    class="fa fa-chevron-circle-left" aria-hidden="true" style={{ color: "#fff", fontSize: "2em", border: "none", background: "none" }}>

                  </CButton>
                </div>
            }
          </CRow>

        </CSubheader>

      </CHeader >
    </>
  )
}

export default TheHeaderNew
