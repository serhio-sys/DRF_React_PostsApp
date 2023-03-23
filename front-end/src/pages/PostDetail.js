import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from '../api/axios'

const PostDetail = () => {

    const [post,setPost] = useState({})
    const pk = useParams().pk

    useEffect(()=>{
        function fetchData(){
            axios.get(`posts/${pk}/`)
            .then((res)=>{
                setPost(res.data)
            })
            .catch((err)=>{
                console.log(err)
            })
        }
        fetchData()
    },[pk])

    return (
        <div className='center'>
            <div className='block'>
                <h1>Post Detail</h1>
                <div className='block-body'>
                    <h2>{post.title}</h2>
                    <h3>{post.desk}</h3>
                </div>
            </div>
        </div>
    )
}

export default PostDetail