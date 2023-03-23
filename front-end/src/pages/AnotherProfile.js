import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import Post from "../components/Post";
import '../App.css'
import '../mobile_media.css'
import AnotherPaginator from "../UI/AnotherPaginator";
import { Link, Navigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../context/authSlice";
import RefreshToken from "../context/RefreshToken";

const AnotherProfile = () => {
    const user_id = useParams().pk
    const [posts,setPosts] = useState([])
    const [linki,setLinks] = useState([])
    const [selectedPage,setPage] = useState(1)
    const [next,setNext] = useState(null)
    const [previous,setPrevious] = useState(null)
    const [total,setTotal] = useState(0)
    const [userdata,setUserdata] = useState({})
    const [followed,setFollowed] = useState(0)
    const myusername = useSelector(selectCurrentUser)
    const [followers,setFollowers] = useState(0)
    const [follw,setFollw] = useState(true)
    const dispatch = useDispatch()

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

    useEffect(()=>{
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

        async function fetchUserData() {
            try{
                const response = await axios.get(`users/${user_id}/`)
                const response2 = await axios.get(`followed/${user_id}/`)
                setUserdata(response.data)
                setFollowed(response2.data.followed)
                setFollowers(response.data.followers_ct)
                console.log(response.data.followers)
                if (response.data.followers.includes(myusername)) {
                    setFollw(false)
                }
            }
            catch(err){
                console.log(err?.response)
            }

        }
        fetchUserData()
        changePaginate()
        fetchData(`posts/${user_id}/filter/?limit=8&offset=${(selectedPage-1)*8}`)
    },[selectedPage,total,user_id])
    
    const FollowUnFollow = async () => {
        try{
            const response = await axios.post(`users/${user_id}/follow/`,{},{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.data[0]) {
              setFollw(false)
              setFollowers(followers+1)  
            } 
            else {
              setFollw(true)
              setFollowers(followers-1)  
            }
        }
        catch(err){
            if (err.response.status === 401){
                await RefreshToken(dispatch,localStorage.getItem('refresh'),FollowUnFollow)
            }
            console.log(err)
        }
    }

    return (
        myusername
        ?
            myusername===userdata.username
            ?
            <Navigate to={'/profile/'}/>
            :
            <div className='center'>
                <div className='block'>
                    <div className='block-title title-over'>
                        Profile: {userdata.username}
                    </div>
                    <div className="followbar">
                        <div style={{color:"white",width:"100%",display:"flex",gap:"1em",justifyContent:"center",alignItems:"center"}}>
                            <div className="ff-link"><a>Posts: {posts.length}</a></div>
                            <div className="ff-link"><Link to={`/followers/${user_id}/users/`}>Followers: {followers}</Link></div>
                            <div className="ff-link"><Link to={`/followed/${user_id}/users/`}>Followed: {followed}</Link></div>
                        </div>
                        <div className="link-towrite"><div><Link>Write Now</Link></div></div>
                    </div>
                    <div style={{width:"100%",display:"flex",justifyContent:"center"}}>
                        {follw?<button className="follow-btn" onClick={()=>{FollowUnFollow()}}>Follow</button>:<button className="unfollow-btn" onClick={()=>{FollowUnFollow()}}>Un Follow</button>}
                    </div>
                    <h1>Posts</h1>
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
        :
        <div className='center'>
            <div className='block'>
                <div className='block-title title-over'>
                    Profile: {userdata.username}
                </div>
                <div className="followbar" style={{color:"white",width:"100%",display:"flex",gap:"1em",justifyContent:"center",alignItems:"center"}}>
                    <div className="ff-link"><a>Posts: {posts.length}</a></div>
                    <div className="ff-link"><Link to={`/followers/${user_id}/users/`}>Followers: {followers}</Link></div>
                    <div className="ff-link"><Link to={`/followed/${user_id}/users/`}>Followed: {followed}</Link></div>
                </div>
                <h1>Posts</h1>
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

export default AnotherProfile;