import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../api/axios";
import Post from "../components/Post";
import { logOut, selectCurrentRefresh, selectCurrentToken } from "../context/authSlice";
import '../App.css'
import '../mobile_media.css'
import AnotherPaginator from "../UI/AnotherPaginator";
import { Link, useNavigate } from "react-router-dom";
import RefreshToken from "../context/RefreshToken";

const Profile = () => {
    const user_id = jwtDecode(useSelector(selectCurrentToken)).user_id
    const [posts,setPosts] = useState([])
    const [linki,setLinks] = useState([])
    const [selectedPage,setPage] = useState(1)
    const [next,setNext] = useState(null)
    const [previous,setPrevious] = useState(null)
    const [total,setTotal] = useState(0)
    const [followed,setFollowed] = useState(0)
    const [followers,setFollowers] = useState(0) 
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const refresh = useSelector(selectCurrentRefresh)

    function fetchData(url) {
        axios.get(url)
        .then((res)=>{
            setPosts(res.data.results)
            setNext(res.data.next)
            setPrevious(res.data.previous)
            setTotal(res.data.count)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    
    const DeleteAccount = async () => {
        try{
            const response = await axios.delete(`delete-user/${user_id}/`,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response){
                dispatch(logOut())
                navigate('/')
            }
        }
        catch(err){
            if (err.response.status === 401){
                await RefreshToken(dispatch,refresh,DeleteAccount)
            }
            console.log(err.response)   
        }
    }

    useEffect(()=>{
        async function fetchFollowed() {
            try{
                const response = await axios.get(`followed/${user_id}/`)
                setFollowed(response.data.followed)
            }
            catch(err){
                console.log(err.response)
            }

            try{
                const response = await axios.get(`users/${user_id}/`)
                setFollowers(response.data.followers_ct)
            }
            catch(err){
                console.log(err)
            }
        }

        function changePaginate() {
            var links = []
            var counter = 0
            var cheker = 0
            for (let i = 0; i < total; i++) {
                cheker++
                if (cheker===1) {
                    counter++
                }
                else if(cheker===8){
                    cheker=0
                }
            }
            for (let i = 1; i <= counter; i++) {
                links.push(i!==selectedPage
                ?
                <li className='link' onClick={()=>setPage(i)}>{i}</li>
                :
                <li className='link selected' onClick={()=>setPage(i)}>{i}</li>)
            }
            setLinks(links)
        }

        fetchFollowed()
        changePaginate()
        fetchData(`posts/${user_id}/filter/?limit=8&offset=${(selectedPage-1)*8}`)
    },[selectedPage,total])
    
    console.log(posts)
    return (
        <div className='center'>
            <div className='block'>
                <div className='block-title title-over'>
                    Profile 
                </div>
                <div className="followbar">
                        <div style={{color:"white",width:"100%",display:"flex",gap:"1em",justifyContent:"center",alignItems:"center"}}>
                            <div className="ff-link"><a>Posts: {posts.length}</a></div>
                            <div className="ff-link"><Link to={`/followers/${user_id}/users/`}>Followers: {followers}</Link></div>
                            <div className="ff-link"><Link to={`/followed/${user_id}/users/`}>Followed: {followed}</Link></div>
                        </div>
                        <div className="link-towrite"><div className="post-delete"><button onClick={()=>{DeleteAccount()}}>Delete Account</button></div></div>
                    </div>
                <h1>Your Posts</h1>
                <div className='block-posts'>
                    {
                    posts.length>0
                    ?
                    posts.map((it)=>(
                        <React.Fragment key={it.id}>
                        <Post post={it} key={it.id}/>
                        </React.Fragment>
                    ))
                    :
                    <h2>Does not has any posts...</h2>
                    }
                </div>
                <AnotherPaginator links={linki} next={next} previous={previous} selectedPage={selectedPage} setPage={setPage}/>
            </div>
        </div>
    )
}

export default Profile;