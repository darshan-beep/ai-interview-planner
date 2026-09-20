
import { useState } from 'react'
import React from 'react'
import './auth.form.scss'
import { useNavigate,Link } from 'react-router-dom'
import { useAuth } from '../hooks/use.auth'


const Register = () => {
  const navigate = useNavigate()
    const [ username, setusername ] = useState("")
    const [ email, setemail ] = useState("")
    const [ password, setpassword ] = useState("")
const {loading,handleregister} = useAuth()
  const  handlesubmit= async(e)=>{
    e.preventDefault();
     await handleregister({username,email,password})
        navigate("/")
  }
  if(loading){
    return <main><h1>loading....</h1></main>
  }
  return (
    <main>
    <div className='form-container'>
      <h1>Register</h1>
      <form onSubmit={handlesubmit}>
        <div className='input-group'>
        <label htmlFor="username">username</label>
        <input
         onChange={(e)=>{setusername(e.target.value)}}
        type="text" placeholder='enter username' id='username' name='username' />
        </div>
        <div className='input-group'>
            <label htmlFor="email">email</label>
            <input
            onChange={(e)=>{setemail(e.target.value)}}
            type="text" placeholder='enter email' id= 'email' name='email'/>
        </div>
        <div className='input-group'>
        <label htmlFor="password">password</label>
        <input 
         onChange={(e) => { setpassword(e.target.value) }}
        type="text" placeholder='enter password' id='password' name='password' />
        </div>
        <button className='button primary-button'>Register</button>
        <p>already have an account?<Link to='/login'>Login</Link></p>
      </form>

    </div>
    </main>
  )
}

export default Register;
