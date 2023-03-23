import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import axios from '../api/axios'
import { selectCurrentRefresh } from '../context/authSlice'
import RefreshToken from '../context/RefreshToken'
import CustomButton from '../UI/CustomButton'
import Input from '../UI/Input'

const PostCreate = () => {
    const refresh = useSelector(selectCurrentRefresh)
    const [errorMsg,setMsg] = useState('')
    const [loginFormData,setData] = useState({
      "title":'',
      "desk":''
    })
    const [success,setSuccess] = useState(false)
    const dispatch = useDispatch()

    const inputHandler = (event) =>{
      setData({
        ...loginFormData,
        [event.target.name]:event.target.value
      })
    }

    const submitHandler = async (e) => {
      setMsg('')
      e.preventDefault()
      setSuccess(false)
      try{
        const response = await axios.post("posts/",loginFormData,{
          headers:{
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        console.log(response.data)
        setSuccess(true)
      }
      catch(err){
        if (err.response.status === 401) {
          await RefreshToken(dispatch,refresh,submitHandler,e)
          setSuccess(true) 
        }
        else{
          setMsg(err.response.data.detail)
          console.log(err)
        }
        
      }
    }
  
    return (
        success
        ?<Navigate to={"/posts/"}/>
        :
        <div className='center'>
          <div className='block'>
              <form method='post' onSubmit={(e)=>submitHandler(e)}>
                  <h1>Post Form</h1>
                  {
                  success
                    ?
                  <div className='msg' style={{'color':'blue'}}>Successfully created!</div>  
                    :
                  <div className='msg' style={{'color':'red'}}>{errorMsg}</div>
                  } 
                  <Input type="text" name='title' required={true} onChange={(e)=>inputHandler(e)} placeholder='Enter title of post'/>
                  <Input type="text" name='desk' required={true} onChange={(e)=>inputHandler(e)} placeholder='Enter some description'/>
                  <CustomButton type="submit">Submit</CustomButton>
              </form>
          </div>
      </div>
    )
}

export default PostCreate;