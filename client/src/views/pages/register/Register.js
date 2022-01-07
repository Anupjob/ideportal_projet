import React from 'react'
import { Link } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInputGroup,
  CRow
} from '@coreui/react'
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button/Button"
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';




const bgColor = {
  background: "rgb(131,73,191)",
  background: "linear-gradient(200deg, rgba(131,73,191,1) 16%, rgba(25,229,246,1) 84%)",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: "100%",
  overflowY: "auto"
}
const buttonStyle = {
  textTransform: 'none',
  backgroundColor: "#4ea7d8",
  lineHeight: "3"
}
const formTitle = {
  color: "#2d87b9",
  textAlign: "center",
  fontSize: "2.2em"
}
const pageTitle = {
  color: "#fff",
  textAlign: "left",
  fontSize: "2.2em",
  background: "url(./dg_logo.png) no-repeat",
  backgroundSize: "110px",
  padding: "15px 0 15px 140px"
}

const pageDesc = {
  color: "#fff",
  fontSize: "1.2em",
  margin: "35px 0"
}

const pageDescList = {
  color: "#fff",
  fontSize: "1.2em",
  margin: "35px 0",
  background: "url(./list_icon.png) no-repeat",
  backgroundSize: "30px",
  padding: "0px 0px 20px 50px",
  backgroundPosition: "0 5px"
}


class Register extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    }
  }


  sign = () => {

    this.props.history.push('/Login');


  }

  handleClickEmail = (e) => {

    this.setState({ email: e.target.value });

  }

  handleClickPwd = (e) => {

    this.setState({ password: e.target.value });

  }

  handleClickFirst = (e) => {

    this.setState({ firstName: e.target.value });

  }

  handleClickLast = (e) => {

    this.setState({ lastName: e.target.value });

  }

  handleClickSignUp = () => {


    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(async (res) => {

        console.log("res", res);

        var obj = {

          userId: res.user.uid,
          firstName: this.state.firstName,
          email: this.state.email,
          code: this.state.password,

        }

        firebase.firestore().collection("users").doc(res.user.uid)
          .set(obj).then(function () {
            console.log("Document successfully updated!");

          });

        // firebase.database().ref('users/' + res.user.uid).update({
        //   userId: res.user.uid,
        //   firstName: this.state.firstName,
        //   lastName: this.state.lastName,
        //   email: this.state.email,
        //   code: this.state.password,
        // });

        this.props.history.push('/');

      })



  }

  render() {

    console.log("this.state", this.state);
  return (

    <CContainer fluid style={bgColor}>
      <CContainer style={{ paddingTop: "70px" }}>
        <CRow>
          <CCol md="7">
            <h1 style={pageTitle}>WELCOME TO <br />IMAGE DATA EXTRACT</h1>
            <p style={pageDesc}>From single printed documents to millions of digital documents processed Digital Glyde's Digital Image Data Extract can help you easily etract specific data seamlessly out of any printed document or digital file format.</p>

            <p style={pageDescList}><strong><em>Data Extraction</em></strong> allow users to scan/scrape multiple data sources simultaneously.</p>

            <p style={pageDescList}><strong><em>Data Aggregation and Preparation</em></strong> creates rules and workflows to cleanse the relevant data.</p>

            <p style={pageDescList}><strong><em>Modeling and Deployement of Models</em></strong> uses analytics to determaine modules and predictions.</p>

            <p style={pageDescList}><strong><em>Data Integration</em></strong> helps increase operational efficiency by bringing data together info a unified view.</p>
          </CCol>
          <CCol md="5">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1 style={formTitle} className="mb-4">Register Here</h1>
                    <CInputGroup className="mb-4">
                      <TextField id="outlined-basic" label="Name" variant="outlined" style={{ width: "100%" }} 
                    onChange={this.handleClickFirst}
                    />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <TextField id="outlined-basic" label="Email" variant="outlined" style={{ width: "100%" }} 
                    onChange={this.handleClickEmail}
                    />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <TextField id="outlined-basic" label="Password" type="password" variant="outlined" style={{ width: "100%" }} 
                    onChange={this.handleClickPwd}
                    />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <TextField id="outlined-basic" label="Confirm Password" type="password" variant="outlined" style={{ width: "100%" }} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <Button variant={"contained"} color={"primary"} fullWidth style={buttonStyle}
                    onClick={this.handleClickSignUp}
                    >Sign Up</Button>
                    </CInputGroup>
                    <CRow>
                      <CCol className="mb-4">
                        <Link to="/" style={{ color: "#2d333a" }}>
                          {"Already have an account? Login"}
                        </Link>
                      </CCol>
                    </CRow>

                  </CForm>
                </CCardBody>
              </CCard>

            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </CContainer>

  )
  }
}

export default Register
