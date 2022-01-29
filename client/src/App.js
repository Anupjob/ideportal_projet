import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './scss/style.scss';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import * as wjcCore from "@grapecity/wijmo";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const DocumentDetails = React.lazy(() => import('./views/details/DocumentDetails'));
const PdfViewGoogleAzure = React.lazy(() => import('./views/details/PdfViewGoogleAzure'));
const CompniesData = React.lazy(() => import('./views/compnies/CompniesData'));
const ProcessorsData = React.lazy(() => import('./views/processors/ProcessorsData'));
const CompanyUserData = React.lazy(() => import('./views/companyUser/CompanyUserData'));
const IssueHistoryData = React.lazy(() => import('./views/details/IssueHistoryData'))

// const TheHeaderNew = React.lazy(() => import('./containers/TheHeaderNew'));

const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProvider: "",
      fireAppInitialized: {},
      dataLoaded: false,
      uid: ""
    }
  }

  componentDidMount = () => {

  wjcCore.setLicenseKey("audubonqa1.digitalglyde.com|audubonqa2.digitalglyde.com,926535591656245#B0XdJIDMyIiOiIXZ6JCLlNHbhZmOiI7ckJye0ICbuFkI1pjIEJCLi4TPR5WRXNncmxWRZh7athmSi3CUyFkM4JXQHNWSvsSQrhmZyBlepxETqdUNsVGW4I4RzMTY7QzNMl7NkZ4MkNkYN96cid5dZdDVsZ7QGp6SwM6dlhWYZhEV9JkUxMlSJRkYxYENEdmc6d6amFUZ9EkWYZ5NWl6SyRTSHJ5V7w6YwdzdLxWZERWSzIWbZZTTRhkQ4QUZBpHTphnMKJkZRZHb5hUb5kDcjNXWN9mbyVneKFXUB9WVo3kbnJ7TO3GR8tSWvMkU8o5VV9mTrlmYptiboJVcyc7RZFHb7V5NolUeYV4NJBjclt4dDplR9ZTZLxWVzVmMKVGTsp5RUp6Qv3ia5kUNB96LhljYBtEculUREBlUzxmVQN7Kx8GbyMjQ8lTOatWbyV4TygWdSF7RR3iR9pWcLJWOhp4KvlDTDZkMWdESYVVeEl4QyQUergkcyVDNXh4TqVDaiojITJCLiEENDFEREJjNiojIIJCL6cTN4cTNxETM0IicfJye#4Xfd5nIJBjMSJiOiMkIsIibvl6cuVGd8VEIgQXZlh6U8VGbGBybtpWaXJiOi8kI1xSfiUTSOFlI0IyQiwiIu3Waz9WZ4hXRgAicldXZpZFdy3GclJFIv5mapdlI0IiTisHL3JyS7gDSiojIDJCLi86bpNnblRHeFBCI73mUpRHb55EIv5mapdlI0IiTisHL3JCNGZDRiojIDJCLi86bpNnblRHeFBCIQFETPBCIv5mapdlI0IiTisHL3JyMDBjQiojIDJCLiUmcvNEIv5mapdlI0IiTisHL3JSV8cTQiojIDJCLi86bpNnblRHeFBCI4JXYoNEbhl6YuFmbpZEIv5mapdlI0IiTis7W0ICZyBlIsICMxgTNyEDI7IzNwEjMwIjI0ICdyNkIsISbvNmLlRWesdGbhRXanlGZuITYx96biVHZ5FGLt36YuUGZ9x6ZsFGdpdWak9SMhFnbvJWdkVXYiojIz5GRiwiIlRWesdEIsFGdpdWaEJiOiEmTDJCLiUDNyYTN6ETO5UzM5YjM9IiOiQWSiwSfdtlOicGbmJILcI");




    // useEffect(() => {

    // let firebaseConfig = {
    //   apiKey: "AIzaSyA2lABjNHoBIT59FBdExUsCERc5RJw74ps",
    //   authDomain: "imagedataextract.firebaseapp.com",
    //   databaseURL: "https://imagedataextract.firebaseio.com",
    //   projectId: "imagedataextract",
    //   storageBucket: "imagedataextract.appspot.com",
    //   messagingSenderId: "685805190840",
    //   appId: "1:685805190840:web:86b3c58797f8dcd5e57e4d",
    //   measurementId: "G-2T0WHRW487"
    // }


    // let fireApp = firebase.initializeApp(firebaseConfig);

    // this.setState({ fireAppInitialized: fireApp })
    // setTimeout(() => {
    //   let uid = null
    //   firebase.auth().onAuthStateChanged(async (user) => {
    //     console.log("this.firebaseConfig", user);
    //     if (user && user.uid) {
    //       uid = user.uid
    //       this.setState({ uid: uid })
    //     }
    //   })
    //   setTimeout(() => {
    //     this.setState({ dataLoaded: true })
    //   }, 2000);
    // }, 3000);
  }

  render() {
    return (
      <HashRouter>
        {/* {window.location.pathname !== "/" ? <TheHeaderNew /> : null} */}
        <React.Suspense fallback={loading}>
          <Switch>
            <Route exact path="/" name="Login" render={props => <Login {...props} />} />
            <Route exact path="/register" name="Register Page" render={props => <Register {...props} />} />
            <Route exact path="/404" name="Page 404" render={props => <Page404 {...props} />} />
            <Route exact path="/500" name="Page 500" render={props => <Page500 {...props} />} />
            <Route path="/incoming_list" name="Dashboard" render={props => <TheLayout {...props} />} />
            <Route path="/document_list" name="Colors" render={props => <TheLayout {...props} />} />
            <Route path="/details" name="DocumentDetails" render={props => <TheLayout {...props} />} />
            <Route path="/detail/:id" name="PdfViewGoogleAzure" render={props => <TheLayout {...props} />} />
            <Route path="/compnies" name="CompniesData" render={props => <TheLayout {...props} />} />
            <Route path="/processors" name="ProcessorsData" render={props => <TheLayout {...props} />} />
            <Route path="/companyUser" name="CompanyUserData" render={props => <TheLayout {...props} />} />
            <Route path="/issueHistory" name="IssueHistoryData" render={props => <TheLayout {...props} />} />





            
            {/* <Route path="/" name="Home" render={props => <TheLayout {...props} />} /> */}
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}

export default App;
