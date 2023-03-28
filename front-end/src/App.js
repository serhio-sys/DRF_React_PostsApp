import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PostCreate from './pages/PostCreate';
import PostDetail from './pages/PostDetail';
import PostList from './pages/PostsList';
import SignUpPage from './pages/SignUpPage';
import Unaithorized from './pages/Unauthorized';
import { Provider } from 'react-redux';
import { store } from './context/store';
import ForgotPassword from './pages/ForgotPassword';
import ForgotPasswordConfirm from './pages/ForgotPasswordConfirm';
import RequreAuth from './utils/RequireAuth';
import RefreshingToken from './utils/RefreshingToken';
import Profile from './pages/Profile';
import AnotherProfile from './pages/AnotherProfile';
import Users from './pages/Users';
import FollowedPage from './pages/FollowedPage';
import FollowersPage from './pages/FollowersPage';
import ChatPage from './pages/Chat';

function App() {
  return (
      <BrowserRouter>
        <Provider store={store}>
          <Layout>
              <Routes>
                <Route path='/' element={<HomePage/>}/>
                <Route path='/reset-password/:token/' element={<ForgotPasswordConfirm/>}/>
                <Route path='/reset-password/' element={<ForgotPassword/>}/>
                <Route path='/sign-in/' element={<LoginPage/>}/>
                <Route path='/unauthorized/' element={<Unaithorized/>}/>
                <Route path='/sign-up/' element={<SignUpPage/>}/>
                <Route path='/posts/' element={<PostList/>}/>
                <Route path='/posts/:pk/' element={<PostDetail/>}/>
                <Route path='/users/:pk/' element={<AnotherProfile/>}/>
                <Route path='/users/' element={<Users/>}/>
                <Route path='/followed/:pk/users/' element={<FollowedPage/>}/>
                <Route path='/followers/:pk/users/' element={<FollowersPage/>}/>
                <Route element={<RequreAuth/>}>       
                  <Route path='/chat/:first/:user/' element={<ChatPage/>}/>
                  <Route path='/profile/' element={<Profile/>}/> 
                  <Route element={<RefreshingToken/>}> 
                    <Route path='/create-post/' element={<PostCreate/>}/>
                  </Route> 
                </Route>
              </Routes>
            </Layout>
        </Provider>
      </BrowserRouter>
  );
}

export default App;
