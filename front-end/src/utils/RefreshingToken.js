import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
import axios from "../api/axios"
import { logOut, refreshToken, selectCurrentRefresh } from "../context/authSlice"

const RefreshingToken = () => {
    const refresh = useSelector(selectCurrentRefresh)
    const dispatch = useDispatch()
    useEffect(() => { 
        async function RefreshingToken(){
          try{  
            const response = await axios.post("token/refresh/",{"refresh":refresh})
            dispatch(refreshToken({'access':response.data.access,'refresh': response.data.refresh}))
          }
          catch(err){
            if (err.response.status===401){
              dispatch(logOut())
              Navigate("/sing-in/")
            }
            console.log(err)
          }
        }
      
      RefreshingToken()
      },[])
    return (
        <Outlet/>
    )
}

export default RefreshingToken;