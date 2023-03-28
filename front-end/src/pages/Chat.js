import jwtDecode from "jwt-decode"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import axios from "../api/axios"
import { selectCurrentRefresh, selectCurrentToken, selectCurrentUser } from "../context/authSlice"
import RefreshToken from "../context/RefreshToken"
import io from 'socket.io-client'

const ChatPage = () => {
    const myusername = useSelector(selectCurrentUser)
    const chatid = Number(useParams().first)
    const [second,setSecond] = useState({id:useParams().user})
    const myid = jwtDecode(useSelector(selectCurrentToken)).user_id
    const [chat,setChat] = useState({})
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const refresh = useSelector(selectCurrentRefresh)
    const [loading,setLoading] = useState(true)
    const [socket,setSocket] = useState(null)

    

    useEffect(()=>{
        if (socket===null) {
            setSocket(new WebSocket('ws://127.0.0.1:8000/ws/chat/' + chatid + '/'))
        }
        if(socket){
            socket.onopen = () => {
                console.log("WebSocket Client Connected");
            }
        
            socket.onclose = () => {
                console.log("WebSocket Client Closed");
            }
            socket.onmessage = (e) => {
                const data = JSON.parse(e.data);
                update(data)
            }
        }
    
        function update(data) {
            document.querySelector('.chat-scroll').innerHTML += `<div>${data.user}:${data.message}</div>`;
        }
    },[socket])

    useEffect(()=>{
        async function fetchChat(){
            console.log("go")
            try{
                const response = await axios.get(`chat/${second.id}/`,{
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                setChat(response.data)
                setLoading(false)
            }
            catch(err){
                if (err.response.status === 401) {
                await RefreshToken(dispatch,refresh,fetchChat)
                }
                console.log(err)
            }
        }

        async function fetchUser() {
            try{
                const response = await axios.get(`users/${second.id}/`)
                setSecond(response.data)
            }
            catch(err){
                console.log(err)
            }
        }
        fetchUser()
        fetchChat()
    },[])

    const SendMSG = async () => {
        const messageInputDom = document.querySelector('.chat-input');
        const message = messageInputDom.value;
        var user = myusername;
        socket.send(
            JSON.stringify({
                'user':user,
                'message': message,
                'user_id': myid
            })
        )
        messageInputDom.value = '';
    }

    return (
        loading
        ?
        <div className='center'>
            <div className='block-title'>
                Loading...
            </div>
        </div>
        :
        <div className="center"> 
            <div className="block">
                <h2>Chat</h2>
                <div style={{color:"white"}}>You writing to {second.username}</div>
                <div className="chat-scroll">
                    {
                        chat.messages.map((item)=>(
                            item.user===myid
                            ?<div>{myusername}:{item.msg}</div>
                            :<div>{second.username}:{item.msg}</div>
                        ))
                    }
                </div>
                <div className="sendform">
                    <input type={'text'} className={"chat-input"} placeholder="Enter what you want"/>
                    <button className="chat-btn" onClick={SendMSG}>Send</button>
                </div>
            </div>
        </div>
    )
    
}

export default ChatPage