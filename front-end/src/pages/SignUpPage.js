
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import CustomButton from '../UI/CustomButton'
import Input from '../UI/Input'


const SignUpPage = () => {

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate()

  const [loginFormData,setData] = useState({
      username:'',
      password:'',
      password1:'',
      email:''
    })

  const inputHandler = (event) =>{
      setData({
      ...loginFormData,
      [event.target.name]:event.target.value
    })
  }

  const sendForm = async (event) => {
    event.preventDefault()
    console.log(loginFormData)
    setErrMsg('')
    setSuccess(false)
    try{
      await axios.post(
        "create-users/",
        loginFormData,
      )
      setSuccess(true)
      setTimeout(()=>{
        navigate('/')
      },3000)
    }
    catch(error){
      setErrMsg(error.response.data.error)
    }

  }

    return (
    <div className='center'>
        <div className='block'>
            <form onSubmit={sendForm} method='post'>
                <h1>Registation Form</h1>
                {
                    !success
                    ?
                    <></>
                    :
                    <div className='msg'>Successfully Registation</div>
                }
                {
                  errMsg===''
                  ?
                  <></>
                  :
                  <div className='msg error'>{errMsg}</div>
                }
                <Input type="text" onChange={inputHandler} name="username" autoComplete="off" minLenght={6} required={true} placeholder='username'/>
                <Input type="email" onChange={inputHandler} name="email" required={true} placeholder='email'/>
                <Input type="password" onChange={inputHandler} name="password" minLenght={8} required={true} placeholder='password'/>
                <Input type="password" onChange={inputHandler} name="password1" minLenght={8} required={true} placeholder='password again'/>
                <CustomButton type="submit" >Submit</CustomButton>
            </form>
        </div>
    </div>
    )
}

export default SignUpPage