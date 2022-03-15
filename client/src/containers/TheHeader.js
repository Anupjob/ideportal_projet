import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
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
  CRow,
  CButton
} from '@coreui/react'
import { Link, useHistory } from 'react-router-dom'
// const BrowserHistory = require('react-router/lib/BrowserHistory').default;

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
    background: "linear-gradient(200deg, rgba(131,73,191,1) 16%, rgba(25,229,246,1) 84%)",
    height: "300px",
    position: "fixed",
    width: "100%",
    top: 0,
    left: 0,
  },
  header_bg1: {
    background: "rgb(131,73,191)",
    background: "linear-gradient(200deg, rgba(131,73,191,1) 16%, rgba(25,229,246,1) 84%)",
    zIndex: "20",
    border: "0", paddingRight: "20px", position: "fixed"
  },
  logo_image: {
    whiteSpace: "nowrap",
    background: "url(./dg_logo.png) no-repeat",
    backgroundSize: "100px",
    padding: "60px 0px 60px 130px",
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
  }
}));

const TheHeader = () => {

  const history = useHistory()

  const dispatch = useDispatch()
  const classes = useStyles();
  const sidebarShow = useSelector(state => state.sidebarShow)

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch({ type: 'set', sidebarShow: val })
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch({ type: 'set', sidebarShow: val })
  }
  // const header_bg = {
  //   background: "rgb(131,73,191)",
  //   background: "linear-gradient(200deg, rgba(131,73,191,1) 16%, rgba(25,229,246,1) 84%)",
  //   height: "300px",
  //   position: "fixed",
  //   width: "100%",
  //   top: 0,
  //   left: 0,
  //   '@media (min-width: 780px)': {
  //     width: '800px'
  //   }
  // }


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
            <Link 
            // to="/document_list" 
            className={classes.logo_image}>
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
            <CCol xs="10"><h4 style={{ color: "#fff" }}>Account Activity-{localStorage.getItem('company')}</h4></CCol>
            <CCol xs="2">
              <CRow>

                <CCol xs="4" style={{ textAlign: "right" }}>

                  <CButton onClick={() => {
                    // e.preventDefault();
                    history.goBack()
                  }}
                    class="fa fa-chevron-circle-left" aria-hidden="true" style={{ color: "#fff", fontSize: "2em", border: "none", background: "none" }}></CButton>
                </CCol>
                <CCol xs="4" style={{ textAlign: "right" }}>
                  <Link to="" class="fa fa-print" aria-hidden="true" style={{ color: "#fff", fontSize: "2em" }}></Link>
                </CCol>
                <CCol xs="4"><Link to="" class="fa fa-download" aria-hidden="true" style={{ color: "#fff", fontSize: "2em" }}></Link></CCol>
              </CRow>
            </CCol>
          </CRow>

        </CSubheader>

      </CHeader >
    </>
  )
}

export default TheHeader
