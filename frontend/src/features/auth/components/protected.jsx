import { useAuth } from "../hooks/use.auth";
import React from 'react'
import { Navigate } from "react-router-dom";

const Protected =({children}) => {
    const {loading,User}=useAuth()
    
    if(loading){
       return <main><h1>loading....</h1></main>
    }
    if(!User){
        return <Navigate to = {'/login'}/>

    }
  return children;
}

export default Protected     
