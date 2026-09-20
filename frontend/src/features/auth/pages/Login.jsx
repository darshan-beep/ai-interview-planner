import React, { useState } from 'react';
import './auth.form.scss'
import { useNavigate,Link } from 'react-router-dom';
import {useAuth}from '../hooks/use.auth'


const Login = () => {
  const navigate =useNavigate();
  const {loading,handlelogin}=useAuth()
  const[email,setemail] = useState('')
  const [password,setpassword]=useState('')
  const handlesubmit=async(e)=>{
     e.preventDefault();
     await handlelogin({email, password})
     navigate('/');
  }
  if(loading){
    return(<main><h1>loading......</h1></main>)
  }
  return (
    <main>
      <div className='form-container'>
      <h1>Login</h1>
      <form onSubmit={handlesubmit}>
       
        <div className='input-group'>
            <label htmlFor="email">email</label>
            <input
            onChange={(e)=>{setemail(e.target.value)}}
            type="text" placeholder='enter email' id ='email' name='email'/>
        </div>

        <div className='input-group'>
        <label htmlFor="password">password</label>
        <input
        onChange={(e)=>{setpassword(e.target.value)}}
        type="text" placeholder='enter password' id='password' name='password' />
        </div>
        <button className= 'button primary-button'> Login</button>
        <p>create account <Link to ='/register' className='mail'>Register</Link></p>
      </form>
      </div>
    </main>
    
      
    
  )
}

export default Login

