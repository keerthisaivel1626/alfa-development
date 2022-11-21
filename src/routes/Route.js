import React from 'react';
import { useSelector } from 'react-redux';
import PostAuth from './PostAuth';
import PreAuth from './PreAuth';
import SplashScreen from 'react-native-splash-screen'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeAuthStatus, storeLoginResponse } from '../redux/reducers/AuthReducer';
import { useDispatch } from 'react-redux';

const Route = () => {

  SplashScreen.hide();

  const dispatch = useDispatch();

  const { isAuth } = useSelector((state) => state.authreducer);

  React.useEffect(()=>{
    checkAuthStatus();
  },[]);

  const checkAuthStatus = async () => {
    let response = JSON.parse(await AsyncStorage.getItem('responseAfterLogin'));
    // console.log(JSON.stringify(response,null,4))
    if(response){
      dispatch(changeAuthStatus(true));
      dispatch(storeLoginResponse(response));
    }
  }

  return <>{isAuth ? <PostAuth /> : <PostAuth />}</>;
}

export default Route