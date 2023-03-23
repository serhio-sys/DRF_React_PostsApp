import { Navigate } from "react-router-dom"
import axios from "../api/axios"
import { logOut, refreshToken } from "./authSlice"

export default async function RefreshToken(dispatch,refresh,request,event=null){
    try{  
        const response = await axios.post("token/refresh/",{"refresh":refresh})
        dispatch(refreshToken({'access':response.data.access,'refresh': response.data.refresh}))
        if (event == null) {
            request()
        } else {
            request(event)
        }
    }
    catch(err){
        if (err.response?.status === 401){
            console.log("Error!!")
            dispatch(logOut())
            Navigate("/sing-in/")
        } 
        console.log(err)
    }
}