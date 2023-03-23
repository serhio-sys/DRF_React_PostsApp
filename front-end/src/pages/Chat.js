import jwtDecode from "jwt-decode"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import axios from "../api/axios"
import { selectCurrentUser } from "../context/authSlice"

const ChatPage = () => {
    const myusername = useSelector(selectCurrentUser)
    const first = Number(useParams().first)
    const [second,setSecond] = useState({id:useParams().second})
    const myid = jwtDecode(localStorage.getItem('token')).user_id
    const navigate = useNavigate()
    const [doesnotexist,setDoesnot] = useState(false)
    
    useEffect(()=>{
        const fetchUserData = async () => {
            try{
                const response = await axios.get(`users/${second.id}/`)
                setSecond(response.data)
            }
            catch(err){
                if(err?.response.status === 404){
                    setDoesnot(true)
                }
                console.log(err)
            }
        }

        fetchUserData()
    },[])

    if (doesnotexist) {
        return(
            <div className='center'>
                <div className='block-title'>
                    User not exists!
                </div>
                <Link to="/sign-in/" className='block-title linkk'>Back to HomePage</Link>
            </div>
        )
    }
    else if (myid===second.id||myid!==first){
        return(
            <Navigate to={"/"}/>
        )
    }
    return (
        <div className="center"> 
            <div className="block">
                <h2>Chat</h2>
                <div style={{color:"white"}}>You writing to {second.username}</div>
                <div className="chat-scroll">Scroled Block</div>
                <div className="sendform">
                    <input type={'text'} className={"chat-input"} placeholder="Enter what you want"/>
                    <button className="chat-btn">Send</button>
                </div>
            </div>
        </div>
    )
    
}

export default ChatPage