import React, { useState } from 'react'
import axios from '../api/axios'
import CustomButton from '../UI/CustomButton'
import Input from '../UI/Input'


const ForgotPassword = () => {
    const [errorMsg,setMsg] = useState('')
    const [FormData,setData] = useState({
      "email":'',
    })
    const [success,setSuccess] = useState(false)
  
    const inputHandler = (event) =>{
      setData({
        ...FormData,
        [event.target.name]:event.target.value
      })
    }
  
    const submitHandler = async (event) => {
      setMsg('')
      setSuccess(false)
      event.preventDefault()
      try{
        await axios.post("password_reset/",FormData)
        setSuccess(true)
      }
      catch(err){
        setMsg(err.response.data.email[0])
      }
    }
  
    return (
      <div className='center'>
          <div className='block'>
              <form method='post'>
                  <h1>Reset Password Step 1</h1>
                  {
                  success
                    ?
                  <div className='msg' style={{'color':'blue'}}>Successfully! Check your mail...</div>  
                    :
                  <>
                  <div className='msg' style={{'color':'red'}}>{errorMsg}</div> 
                  <Input type="email" name='email' required={true} onChange={(e)=>inputHandler(e)} placeholder='email'/>
                  <CustomButton type="submit" onClick={(event)=>submitHandler(event)}>Reset password</CustomButton>
                  </>
                  }
              </form>
          </div>
      </div>
    )
}

export default ForgotPassword;