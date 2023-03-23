import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../context/authApiSlice'
import { setCredentials } from '../context/authSlice'
import CustomButton from '../UI/CustomButton'
import Input from '../UI/Input'

function LoginPage() {

  const [errorMsg,setMsg] = useState('')
  const [loginFormData,setData] = useState({
    "username":'',
    "password":''
  })

  const inputHandler = (event) =>{
    setData({
      ...loginFormData,
      [event.target.name]:event.target.value
    })
  }
  
  const navigate = useNavigate()
  const location = useLocation()
  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useDispatch()

  const from = location.state?.from?.pathname || "/";

  const submitHandler = async (event) => {
    const user = loginFormData.username
    setMsg('')
    event.preventDefault()
    try{
      console.log(loginFormData)
      const response = await login(loginFormData).unwrap()
      localStorage.setItem("token",response.access)
      localStorage.setItem("refresh",response.refresh)
      dispatch(setCredentials({...response,user}))
      navigate('/',from)      
    }
    catch(err){
      console.log(err)
      setMsg(err.data.detail)
    }
  }

  return (
    <div className='center'>
      {
        isLoading
        ?
        <div className='block-title'>
            Loading...
        </div>
        :
        <div className='block'>
            <form method='post'>
                <h1>Login Form</h1>
                <div className='msg' style={{'color':'red'}}>{errorMsg}</div>
                <Input type="text" name='username' required={true} onChange={(e)=>inputHandler(e)} placeholder='username'/>
                <Input type="password" name='password' required={true} onChange={(e)=>inputHandler(e)} placeholder='password'/>
                <h3>Forgot password? <Link to={'/reset-password/'}>Reset</Link></h3>
                <CustomButton type="submit" onClick={(event)=>submitHandler(event)}>Submit</CustomButton>
            </form>
        </div>
      }
    </div>
  )
}

export default LoginPage