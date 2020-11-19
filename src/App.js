import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import axios from './axios';
import themeFile from './util/theme';
import jwtDecode from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
// Material UI
import Hidden from '@material-ui/core/Hidden';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED, SET_FINGERPRINT } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';
//Components
import Navbar from './components/layout/Navbar';
import Bottombar from './components/layout/Bottombar';
import AuthRoute from './util/AuthRoute';
// Pages
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import User from './pages/user';
// Firebase
import firebase from 'firebase';
import config from './util/config';

const theme = createMuiTheme(themeFile);
firebase.initializeApp(config);

const token = localStorage.FBIdToken;
if (token){
  // Decode Token
  const decodedToken = jwtDecode(token);
  // If it's expired, then logout
  if(decodedToken.exp * 1000 < Date.now()){
    store.dispatch(logoutUser());
  } else {
    // If not, then authorize 
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
} else {
  (async () => {
    // Load fingerprint
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    // Dispatch identifier
    store.dispatch ({
      type: SET_FINGERPRINT,
      payload: result.visitorId,
    });  
  })()
};

function App() {
  return (
    <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <div className='App'>
        <Router>
          <Navbar />
          <div className='container'>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/nav/:genre' render={(props) => <Home {...props} key={uuidv4()}/>} />
              <AuthRoute
                exact
                path='/login'
                component={Login}
              />
              <AuthRoute
                exact
                path='/signup'
                component={Signup}
              />
              {/* <Route exact path='/users/:handle' component={User} /> */}
              <Route exact path='/users/:handle' render={(props) => <User {...props} key={uuidv4()}/>} />
              {/* <Route exact path='/users/:handle/snippet/:snippetId' component={User} /> */}
              <Route exact path='/users/:handle/snippet/:snippetId' render={(props) => <User {...props} key={uuidv4()}/>} />
              
            </Switch>
          </div>
          <Hidden smUp> 
            <Bottombar />
          </Hidden>
        </Router>
      </div>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
