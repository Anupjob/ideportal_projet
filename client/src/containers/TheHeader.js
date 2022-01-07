import React from 'react'
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
  CRow
} from '@coreui/react'

import TextField from "@material-ui/core/TextField"

import CIcon from '@coreui/icons-react'

// routes config
import routes from '../routes'

import {
  TheHeaderDropdown,
  TheHeaderDropdownMssg,
  TheHeaderDropdownNotif,
  TheHeaderDropdownTasks
} from './index'

const TheHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector(state => state.sidebarShow)

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch({ type: 'set', sidebarShow: val })
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch({ type: 'set', sidebarShow: val })
  }
  const header_bg = {
    background: "rgb(131,73,191)",
    background: "linear-gradient(200deg, rgba(131,73,191,1) 16%, rgba(25,229,246,1) 84%)"
  }
  const logo_image = {
    whiteSpace: "nowrap",
    background: "url(./dg_logo.png) no-repeat",
    backgroundSize: "100px",
    padding: "60px 0px 60px 130px",
    backgroundPosition: "0 50%",
    color: "#fff"
  }

  return (

    <CHeader withSubheader style={header_bg}>

      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />

      <CHeaderNav className="d-md-down-none mr-auto">
        <CHeaderNavItem >
          <h3 style={logo_image}>IMAGE DATA EXTRACT</h3>
        </CHeaderNavItem>

      </CHeaderNav>
      <CHeaderNav>
        <CInputGroup>
          <CInput type="text" placeholder="Username" autoComplete="username" />
        </CInputGroup>
      </CHeaderNav>
      <CHeaderNav>
        <TheHeaderDropdown />
      </CHeaderNav>

      <CSubheader style={{ background: "none", border: "none", paddingLeft: "70px" }}>

        <h4 style={{ color: "#fff" }}>Account Activity-ABC Company, Inc.</h4>
      </CSubheader>

    </CHeader >

  )
}

export default TheHeader
