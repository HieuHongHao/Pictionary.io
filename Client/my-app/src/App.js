import React from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { useEffect } from 'react';
import { useState } from 'react';
import { Outlet, useNavigate} from 'react-router-dom';
import Login from './Component/Login';

function App() {
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [route,setRoute] = useState({link:"/userpage", data:{}});
  const navigate = useNavigate(); 
  useEffect(() => {
      if (localStorage.getItem('auth')) {
        const goToUserPage = () => navigate(`${route.link}`,{replace:true});
        goToUserPage();
      }
  },[navigate,route]);
  
  if (!isLogedIn) {
    return (
      <ChakraProvider theme={theme}>
        <Login setIsLogedIn={setIsLogedIn} />
      </ChakraProvider>
    );
  }
  
  return (
    <ChakraProvider theme={theme}>
      <ColorModeSwitcher />
        <Outlet context={[setIsLogedIn,setRoute,route]}/>
    </ChakraProvider>
  );
}


export default App;
