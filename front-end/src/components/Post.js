import jwtDecode from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from '../api/axios'
import { selectCurrentRefresh, selectCurrentUser } from '../context/authSlice'
import RefreshToken from '../context/RefreshToken'

const Post = (props) => {
    const [user,setUser] = useState('')
    const [liked,setLiked] = useState(false)
    const [likes_ct,setLikesCt] = useState(props.post.likes_ct)
    const username = useSelector(selectCurrentUser)
    const refresh = useSelector(selectCurrentRefresh)
    const dispatch = useDispatch()
    const [removed,setRemoved] = useState(false)
    var myid
    if (localStorage.getItem('token')) {
        myid = jwtDecode(localStorage.getItem('token')).user_id
    } else {
        myid = -100
    }

    useEffect(()=>{
        const fetchData = async () => {
            await axios.get("users/"+props.post.creator_id+"/")
            .then((res)=>{
                setUser(res.data)
            })
            .catch((err)=>{
                console.log(err)
            })

            if (props.post.likes.includes(username)){
                setLiked(true)
            }
        }
        fetchData()
    },[props.post.creator_id,props.post.likes,username])

    const Delete = async () => {
        try{
            const response = await axios.delete(`delete-post/${props.post.id}/`,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response){
                setRemoved(true)
            }
        }
        catch(err){
            if (err.response.status === 401){
                await RefreshToken(dispatch,refresh,Delete)
            }
            console.log(err.response)   
        }
    }

    const LikeOrUnlike = async () => {
        try{
            const response = await axios.post(`posts/${props.post.id}/like/`,{},{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
                
            })
            console.log(response)
            if (response.data[0]){
                setLiked(true)
                setLikesCt(likes_ct+1)
            }
            else{
                setLiked(false)
                setLikesCt(likes_ct-1)
            }
        }
        catch(err){
            if (err.response.status === 401){
                await RefreshToken(dispatch,refresh,LikeOrUnlike)
            }
            console.log(err.response)
        }
    }

    return (
        <>
            {
                removed
                ?
                <></>
                :
                <div className='post'>
                    {myid===props.post.creator_id?<div className='post-delete' style={{width:"100%",marginBottom:"0.5em"}}><button onClick={()=>{Delete()}}>Delete</button></div>:<></>}
                    <div className='post-title'>{props.post.title}</div>
                    <div className='post-desc'>{props.post.desk}</div>
                    <div className='post-likes'>Likes: {likes_ct}</div>
                    <hr style={{width:"100%"}}/>
                    {
                        username
                        ? !liked ? <button className='like' onClick={()=>LikeOrUnlike()}>♥</button> : <button className='unlike' onClick={()=>LikeOrUnlike()}>♥</button>
                        :
                        <></>
                    }
                    <Link style={{width:"100%"}} className="block-title detail" to={`/posts/${props.post.id}`}>View Detail</Link>
                    <hr style={{width:"100%"}} />
                    <div style={{fontStyle:"italic",fontWeight:"100",wordSpacing:"-2px",fontFamily:"sans-serif",fontSize:"12px"}}>Creator: <Link to={`/users/${user.id}/`}>{user.username}</Link></div>
                </div>
            }
        </>   
    )
}

export default Post