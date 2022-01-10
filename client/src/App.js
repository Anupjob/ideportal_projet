import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './scss/style.scss';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

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


    // useEffect(() => {

    let firebaseConfig = {
      apiKey: "AIzaSyA2lABjNHoBIT59FBdExUsCERc5RJw74ps",
      authDomain: "imagedataextract.firebaseapp.com",
      databaseURL: "https://imagedataextract.firebaseio.com",
      projectId: "imagedataextract",
      storageBucket: "imagedataextract.appspot.com",
      messagingSenderId: "685805190840",
      appId: "1:685805190840:web:86b3c58797f8dcd5e57e4d",
      measurementId: "G-2T0WHRW487"
    }


    let fireApp = firebase.initializeApp(firebaseConfig);

    // this.setState({ fireAppInitialized: fireApp })
    setTimeout(() => {
      let uid = null
      firebase.auth().onAuthStateChanged(async (user) => {
        console.log("this.firebaseConfig", user);
        if (user && user.uid) {
          uid = user.uid
          this.setState({ uid: uid })
        }
      })
      setTimeout(() => {
        this.setState({ dataLoaded: true })
      }, 2000);
    }, 3000);
  }

  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading}>
          <Switch>
            <Route exact path="/" name="Login" render={props => <Login {...props} />} />
            <Route exact path="/register" name="Register Page" render={props => <Register {...props} />} />
            <Route exact path="/404" name="Page 404" render={props => <Page404 {...props} />} />
            <Route exact path="/500" name="Page 500" render={props => <Page500 {...props} />} />
            <Route path="/incoming_list" name="Dashboard" render={props => <TheLayout {...props} />} />
            <Route path="/document_list" name="Colors" render={props => <TheLayout {...props} />} />
            <Route path="/details" name="DocumentDetails" render={props => <TheLayout {...props} />} />

            {/* <Route path="/" name="Home" render={props => <TheLayout {...props} />} /> */}
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}

export default App;
