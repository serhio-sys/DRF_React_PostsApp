
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from '../api/axios'
import CustomButton from '../UI/CustomButton'
import Input from '../UI/Input'


const ForgotPasswordConfirm = () => {
    const [errorMsg,setMsg] = useState('')
    const [FormData,setData] = useState({
      "password":'',
      "token":useParams().token,
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
        const response = await axios.post("password_reset/confirm/",FormData)
        console.log(response.data)
        setSuccess(true)
      }
      catch(err){
        if(err.response.status === 404){
            setMsg("Token is expired!")
        }
        setMsg(err.response.data.password[0])
      }
    }
  
    return (
      <div className='center'>
          <div className='block'>
              <form method='post'>
                  <h1>Reset Password Step 2</h1>
                  {
                  success
                    ?
                  <div className='msg' style={{'color':'blue'}}>Successful! Your new password - {FormData.password}</div>  
                    :
                  <>
                  <div className='msg' style={{'color':'red'}}>{errorMsg}</div> 
                  <Input type="text" name='password' required={true} onChange={(e)=>inputHandler(e)} placeholder='enter new password'/>
                  <CustomButton type="submit" onClick={(event)=>submitHandler(event)}>Reset password</CustomButton>
                  </>
                  }
              </form>
          </div>
      </div>
    )
}

export default ForgotPasswordConfirm;