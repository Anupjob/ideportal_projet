import React from 'react'
import { Link } from 'react-router-dom'
import {
  // CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInputGroup,
  CRow,
} from '@coreui/react'
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button/Button"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CountryList from './CountryList';
import _ from "underscore";
import Modal from '@material-ui/core/Modal';
import { AccordionDetails } from '@material-ui/core'


//import Modal from 'react-modal';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getAuth, RecaptchaVerifier } from "firebase/auth";
const auth = getAuth();


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

const formDesc = {
  color: "#2d333a",
  fontSize: "21px",
  textAlign: "center",
  marginBottom: "40px"
}
const divider = {
  lineHeight: "3px",
  borderTop: "1px solid #707070",
  marginTop: "20px"
}
const orText = {
  background: "rgb(255, 255, 255)",
  display: "table",
  margin: "-23px auto",
  padding: "20px",
  color: "#707070"
}
const phoneBtn = {
  textTransform: 'none',
  lineHeight: "3",
  margin: "0px auto 0 auto",
  background: "url(./phone_icon.png)",
  backgroundSize: "25px",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "10px",
  width: "222px",
  display: "block"
}
const googleBtn = {
  textTransform: 'none',
  lineHeight: "3",
  marginTop: "30px",
  background: "url(./phone_icon.png)",
  backgroundSize: "25px",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "100px",
  justifyContent:'center',
  
}


class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      code: '',
      firstName: '',
      lastName: '',
      v: '',
      search: '',
      newArr: [],
      confirmResult: null,
      change: false,
      changeOne: false,
      phone: '',
      error: '',
      setOpen: false,
      phoneNumber: '',
      expanded: '',
      setExpanded: false,
      setPass: false,
      selectedItem: {
        Name: "United States",
        phoneNumber: "1",
        flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAeCAMAAABpA6zvAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAj1QTFRF4bm96r/B6b/B3a6y5bO15bK1wltjyF1j8unr+vDx+vDwyHB2z3J31ZSZ3JicGS9dJTplITdjGjBdKDxnHjNhGzFfKT1oHzZjQjJXtzxFvT1EGjBedYKdXWyNFStaIDVih5OrRFV7FCpZLkJsjpmvdYKeGC5cWmyNQDFWuD5Hvj9GM0dwRlh9NEdwOEtzLEBqTF2BLUFrOUx0M0dvPVB2KT9pTFJ1HDJfeIWgFy1bJjpmhI+oNklxFi1bS12BY3KRFixbUmOF9/f5////aHaUVGSGIjdjPlF3Gi9dfYqkU2SGaHeVUGKFSk5ySlt/PlB3MkZvMUVuKz9qV2eJKz9pO093QDFVtjpCvDpBFSxbgo6nUWKEEilYJjtmj5qwOUxzEihYFCtaa3mXFCxbRDpfRFZ7KDxoJzxnXW2NKT5pYXCQQFJ5UF6BTl+DHjNgcH6aO051HjRhYnGQS1yAUGCD9fT1/vv8/vv7Fy1cfYmjT1+DiZSsZ3aUFS1cRkBkO011M0ZvMERtQVN5QlR6LEBrQ1V7Ok10N0pyL0VvQTBVtTc/uzc+coCcW2qLhJCpLkJri5atc4CcWGmLR0drHzRhITZiaXiWRVd8c4GdIDZiWGiKJTpmPE92YG+PL0NtKj5pJztnIDZjTlh76c/S8dbX8dXXdoOfXm2NiZWsEylZL0JskJuxd4SfFy5cW22OQDNXukZOwUZNwEZNJDllPVB3P1F4MkdwSzxfu0ZOzdLczNHbzdHbzNDb1tPb8NXXWNrergAAAA90Uk5T/v7+/v7+/v7+/v7+/v7+6a2FXwAAAAFiS0dEQ2fQDWIAAAAJcEhZcwAAAEgAAABIAEbJaz4AAAITSURBVDjLY+AXEOQXEhbhFxUT5RcRFuIXFODnFxCXkJRCAwzSMrJy8gqKSsoqykqKCvJysqpqaqrqGppaaICBX1tZR1dP38DQyNBAX09XR9nYxMTY1IyBkQkVMPDzm1sYWFpZ29jaWFtZ2lmYq9nbqzk4OjmjAQZpF1dpNwt3D0NPQw93CzdpL29zc28fX2YWVlTAwO/nryzmFRAYFBwUGOAlpuzvFxLiFxoWHoEGGPgjpaOiY2Lj4hPi42JjoqOkE5OS5JJT2NjRAIOQY2paeoZNpn6WfqZNRnpaqmNsrGN2DgcnFypg4M/KzXPLLyjUV9UvLMh3y8stKiwsKi4pLStHBQz8FaKVVYmx1XpKetWxiVWVog41Nba1ddw8aICBv77Bv7HJsLmltaXZsKnRv6Gtvb2to7OrGw0w8Pf0ysn3NSf2T+hPbO6Tl+udqKY2cdJkXj40wMA/Zeq06XnpM7TztGek502fNjNv1qxCaSwBzp8+e9YcMeG58+bPmyssNmfW7AXFxQsWLlq8ZCkqYOBftlxJfkXqylWrV61MXSGvtHzN2rVr1q3fsHETKmAQMNLdHLtFefP8rfM3K2+J3axrJCBgtG37DgyFO3ft2rlz1+6dO/fs3LkbxATjvfuWolvtTCRg4CMSMHQTCRh4iAQM5UQCBi4iAQM7kYAhgkjAwEokID7AmYgEDFpEAgYpIgEA2hc6qEvsr/QAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTMtMTAtMDdUMTM6MTU6MTUrMDI6MDDoZk8yAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDEzLTEwLTA3VDEzOjE1OjE1KzAyOjAwmTv3jgAAAABJRU5ErkJggg==",
      }
    }
  }

  state = { isSignedIn: false }
  uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    ],
    width: 240,
    callbacks: {
      signInSuccess: () => false

    }
  }


  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user })
      if (user) {
        this.props.history.push('/dashboard');
      }
    })

    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container",
      {
        size: "invisible",
        callback: () => { console.log('Callback!'); },
        // other options
      })
    
  }

  onSelected = (data, dataOne, dataTwo) => {
    console.log("selected", data, dataOne, dataTwo, this.state);
    this.state.selectedItem.phoneNumber = data;
    this.state.selectedItem.Name = dataTwo;
    this.state.selectedItem.flag = dataOne;
    this.setState({ setExpanded: false });
    //this.setState({ selectedItem.phoneNumber : data });
    //return selected;
  }

  searchText = (event) => {

    console.log("searchText", event.target.value);
    this.setState({ search: event.target.value });

    var newArray = [];
    _.each(CountryList, (key, item) => {
      //var patt = /this.state.search/g;

      // if(key.name.common.toUpperCase() === event.target.value.toUpperCase()){
      var string = key.name.common.toUpperCase();
      var substring = event.target.value.toUpperCase();
      var bool = string.includes(substring);

      if (bool == true) {
        newArray.push({ Name: key.name.common, flag: key.flag, phoneNumber: key.callingCode[0] })
      }
    })
    this.setState({ newArr: newArray });
  }
  handle = (event) => {
    this.setState({ v: event.target.value })
  }
  login = () => {
    const { confirmResult, phone, selectedItem } = this.state;

    confirmResult.confirm(this.state.v).then(function (result) {
      var fullPhoneNumber = '+' + selectedItem.phoneNumber + phone;
      // firebase.database().ref('users/' + result.user.uid).update({
      var obj = {
        userId: result.user.uid,
        firstName: '',
        lastName: '',
        email: '',
        code: '',
        phoneNumber: fullPhoneNumber,
      }
      // });

      firebase.firestore().collection("users").doc(result.user.uid)
        .set(obj).then(function () {
          console.log("Document successfully updated!");

        });

    }).catch(error => {
      this.setState({ error: 'Enter Code is Incorrect!' })
      console.log("error", error);
    });
  }
  handleChange = (panel) => (event, isExpanded) => {
    //var setExpanded = '';
    //setExpanded(isExpanded ? panel : false);
    this.setState({ expanded: panel, setExpanded: !this.state.setExpanded })
  };
  handleClickEmail = (e) => {
    this.setState({ email: e.target.value });
  }

  handleClickPwd = (e) => {
    this.setState({ password: e.target.value });
  }

  handleClick = () => {
    //console.log("one");
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
        this.props.history.push('/dashboard');
      }).catch((error) => {
        console.log(error);
        alert("Please Enter Right Email or Password !");
      })
  }
  handlePhone = (event) => {
    this.setState({ phone: event.target.value })
  }

  phoneClick = () => {
    this.setState({ change: true, setOpen: true })
  }
  onClick = () => {
    //const phoneNumber = '+918607151081';
    const phoneNumber = '+' + this.state.selectedItem.phoneNumber + this.state.phone;
    console.log("===phoneNumber:::", phoneNumber)

    //var testVerificationCode = "123456";
    const appVerifier = window.recaptchaVerifier;
    console.log("===appVerifier:::",appVerifier)

    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(confirmResult => {
        console.log("===confirmResult:::",confirmResult)

        this.setState({ confirmResult, changeOne: true })
      })
      .catch(error => {
        console.log("error", error);
      });
  }
  render() {

    var contList = [];
    _.each(CountryList, (key, item) => {
      contList.push({ Name: key.name.common, flag: key.flag, phoneNumber: key.callingCode[0] })
    })
    console.log("contList", contList);
    console.log("this.state", this.state);

    const body = (
      <div style={{ backgroundColor: 'white', position: 'absolute', top: 120, left: 520, border: '2px solid #04af86', paddingLeft: 10, paddingRight: 10 }}>
        <h3 id="simple-modal-title" style={{ fontFamily: 'Rockwell', display: 'flex', justifyContent: 'center' }}>Sign in with Phone Number :</h3>
        <p id="simple-modal-description">
          <ExpansionPanel style={{ width: 350 }} expanded={this.state.expanded === 'panel1' && this.state.setExpanded == true} onChange={this.handleChange('panel1')}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography>Select Phone Number Country </Typography>
              &nbsp;


            </ExpansionPanelSummary>

            <div style={{ height: 200, overflowY: 'scroll' }}>

              <div style={{ marginTop: 5, marginLeft: 10, marginRight: 10 }}>
                <TextField
                  variant="outlined"
                  label="Search"
                  fullWidth
                  value={this.state.search}
                  onChange={this.searchText}
                //style={{position:'fixed'}}
                />

              </div>
              <br />

              {this.state.search === '' ?
                <div>

                  {contList.map(dataOne => (
                    <ExpansionPanelDetails >
                      <Typography onClick={() => this.onSelected(dataOne.phoneNumber, dataOne.flag, dataOne.Name.toLocaleUpperCase())}>

                        <img src={dataOne.flag} />
                        &nbsp;&nbsp;
                        {dataOne.Name.toLocaleUpperCase()}
                        &nbsp;&nbsp;
                        ( + {dataOne.phoneNumber} )

                      </Typography>
                    </ExpansionPanelDetails>
                  ))}


                </div>

                :
                <div>

                  {this.state.newArr.map(dataOn => (
                    <ExpansionPanelDetails >
                      <Typography onClick={() => this.onSelected(dataOn.phoneNumber, dataOn.flag, dataOn.Name.toLocaleUpperCase())}>

                        <img src={dataOn.flag} />
                        &nbsp;&nbsp;
                        {dataOn.Name.toLocaleUpperCase()}
                        &nbsp;&nbsp;
                        ( + {dataOn.phoneNumber} )

                      </Typography>
                    </ExpansionPanelDetails>
                  ))}


                </div>

              }

            </div>
          </ExpansionPanel>
          <br />
          <Typography style={{ display: 'flex', justifyContent: 'center' }}><b style={{ fontSize: 16 }}>Selected :</b> &nbsp; <img src={this.state.selectedItem.flag} style={{ height: 20, width: 30, fontSize: 16 }} /> &nbsp; {this.state.selectedItem.Name} ( + {this.state.selectedItem.phoneNumber})</Typography>

          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
            <Grid container >
              <Grid item xs={12} sm={12}>
                <Grid container >
                  <Grid item xs={12} sm={3}>
                    <p style={{ marginTop: 22 }}> + ({this.state.selectedItem.phoneNumber}) - </p>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      //style={{marginRight:80}}
                      //variant="outlined"
                      label="Enter Phone Number"
                      value={this.state.phone}
                      onChange={this.handlePhone}
                    />
                  </Grid>
                </Grid>
              </Grid>

            </Grid>

          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={this.onClick}
              style={{ display: 'flex',justifyContent: 'center', marginTop: 18, height: 30, borderRadius: 5, backgroundColor: '#04af86', color: 'white', fontSize: 12, fontWeight: 600 }}
            >
              <p style={{marginTop:10}} >Send Code</p>
            </Button>
          </div>
        </p>

        {this.state.changeOne ?
          <p id="simple-modal-description">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              A verification code sent to this phone number.
            </div>

            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
              <Grid container >
                <Grid item xs={12} sm={6} style={{ marginLeft: 10 }}>
                  <TextField
                    //variant="outlined"
                    label="Enter Verification Code"
                    value={this.state.v}
                    onChange={this.handle}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button onClick={this.login}
                    style={{ marginTop: 18, height: 30, width: 100, borderRadius: 5, backgroundColor: '#04af86', color: 'white', fontSize: 12, fontWeight: 600 }}
                  >
                    <p>Sign In</p>
                  </Button>

                </Grid>

              </Grid>

            </div>


          </p>

          : null}

        <p style={{ color: 'red', marginLeft: 10 }} id="simple-modal-description">
          {this.state.error}
        </p>

        <br /><br />
      </div>
    );

    return (

      <CContainer fluid style={bgColor}>
        <CContainer style={{ padding: "70px 0" }}>
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
                      <h1 style={formTitle}>Let's Get Started!</h1>
                      <p style={formDesc}>Sign in to your Image Data Extract Account</p>
                      <CInputGroup className="mb-4">
                        <TextField id="outlined-basic" label="Email" variant="outlined" style={{ width: "100%" }} onChange={this.handleClickEmail} />
                      </CInputGroup>
                      <CInputGroup className="mb-4">

                        <TextField id="outlined-basic" label="Password" type="password" variant="outlined" style={{ width: "100%" }}
                          onChange={this.handleClickPwd}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <Button variant={"contained"} color={"primary"} fullWidth style={buttonStyle}
                          onClick={this.handleClick}
                        >Login</Button>
                    </CInputGroup>
                    <CRow>
                      <CCol className="mb-4">
                        <Link to="/register" style={{ color: "#2d333a" }}>
                          {"Don't have an account? Sign Up"}
                        </Link>
                      </CCol>
                    </CRow>

                    <div style={divider}><div style={orText}>OR</div></div>

                    <div style={{ paddingBottom: 20, paddingTop: 20 }}>
                  <StyledFirebaseAuth
                    uiConfig={this.uiConfig}
                    firebaseAuth={firebase.auth()}
                  />
                </div>
                    <Button id="recaptcha-container" variant={"outlined"} fullWidth style={phoneBtn} onClick={this.phoneClick} >Sign In with Phone No</Button>

                    <Modal
                    open={this.state.setOpen}
                    onClose={this.handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                  >
                    {body}
                  </Modal>
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

export default Login
