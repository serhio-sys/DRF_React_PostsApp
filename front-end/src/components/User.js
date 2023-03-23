import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from '../api/axios'

const User = (props) => {
    const [count,setCount] = useState(0)

    useEffect(()=>{
        async function fetchCountData() {
            try{
                const response = await axios.get(`posts/${props.user.id}/filter/`)
                setCount(response.data.count)
            }
            catch(err){
                console.log(err)
            }
        }

        fetchCountData()
    },[props.user.id])

    return (
        <>
            <div className='user'>
                <div>
                    <div className='user-username'>{props.user.username}</div>
                    <div className='user-email'>{props.user.email}</div>
                </div>
                <div className='user-count'>Count of posts: {count}</div>
                <Link className='user-link' to={`/users/${props.user.id}/`}>View Profile</Link>
            </div>
        </>   
    )
}

export default User