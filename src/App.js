import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import axios from './axios';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import themeFile from './util/theme';
import jwtDecode from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';
// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';
//Components
import Navbar from './components/layout/Navbar';
import AuthRoute from './util/AuthRoute';
// Pages
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';
import User from './pages/user';
// Firebase
import firebase from 'firebase';
import config from './util/config';

const theme = createMuiTheme(themeFile);
firebase.initializeApp(config);

const token = localStorage.FBIdToken;
if (token){
  const decodedToken = jwtDecode(token);
  if(decodedToken.exp * 1000 < Date.now()){
    store.dispatch(logoutUser());
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

function App() {
  return (
    <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <div className="App">
        <Router>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={home} />
              <AuthRoute
                exact
                path="/login"
                component={login}
              />
              <AuthRoute
                exact
                path="/signup"
                component={signup}
              />
              {/* <Route exact path="/users/:handle" component={User} /> */}
              <Route exact path="/users/:handle" render={(props) => <User {...props} key={uuidv4()}/>} />
              {/* <Route exact path="/users/:handle/snippet/:snippetId" component={User} /> */}
              <Route exact path="/users/:handle/snippet/:snippetId" render={(props) => <User {...props} key={uuidv4()}/>} />
              
            </Switch>
          </div>
        </Router>
      </div>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
