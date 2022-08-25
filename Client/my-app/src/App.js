import React from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { useEffect } from 'react';
import { useState } from 'react';
import { Outlet, useNavigate} from 'react-router-dom';
import socket from './socket';

function App() {
  const [route,setRoute] = useState({link:"", data:{}});
  const navigate = useNavigate(); 
  useEffect(() => {
      if(!localStorage.getItem("auth")){
        const goToLoginPage = () => navigate("/login");  
        goToLoginPage();
      }else{
        const goToUserPage = () => navigate("/userpage");
        goToUserPage();
      }
 },[]);
  
  return (
    <ChakraProvider theme={theme}>
      <ColorModeSwitcher />
        <Outlet context={[setRoute,route,socket]}/>
    </ChakraProvider>
  );
}


export default App;
