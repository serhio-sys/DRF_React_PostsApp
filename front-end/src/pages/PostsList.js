import React from 'react'
import Paginator from '../UI/Paginator'
import { useState,useEffect } from 'react'
import Post from '../components/Post'
import '../App.css'
import '../mobile_media.css'
import axios from '../api/axios'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../context/authSlice'
import { Link } from 'react-router-dom'


const PostList = () => {
    const user = useSelector(selectCurrentUser)
    const [posts,setPosts] = useState([])
    const [selectedPage,setPage] = useState(1)
    const [total,setTotal] = useState(2)
    const [linki,setLinks] = useState([])
    const [next,setNext] = useState("")
    const [previous,setPrevious] = useState("")
    const [isLoading,setIsLoading] = useState(true)

    function fetchData(url) {
        axios.get(url)
        .then((res)=>{
            setPosts(res.data.results)
            setTotal(res.data.count)
            setNext(res.data.next)
            setPrevious(res.data.previous)
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


        changePaginate()
        fetchData(`posts/?page=${selectedPage}`)
        console.log(selectedPage)
        setIsLoading(false)
    },[selectedPage,total])

    return(
        <>
            {
                isLoading
                ?
                <div className='center'>
                    <div className='block-title'>
                        Loading...
                    </div>
                </div>
                :
                <div className='center'>
                    <div className='block'>
                    {
                        user
                        ?
                        <div className='create-link'><Link to={"/create-post/"}>Create Post</Link></div>
                        :
                        <></>
                    }
                        <h1>Post List</h1>
                        <div className='block-posts'>
                            {posts.map((it)=>(
                                <React.Fragment key={it.id}>
                                <Post post={it} key={it.id}/>
                                </React.Fragment>
                                ))}
                        </div>
                        <Paginator links={linki} next={next} previous={previous} setPage={setPage}/>
                    </div>
                </div>
            }
        </>
    )

}

export default PostList