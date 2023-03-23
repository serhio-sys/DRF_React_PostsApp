import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "../api/axios"
import User from "../components/User"


const FollowedPage = () => {
    const [users,setUsers] = useState([])
    const [userdata,setUserData] = useState({id:useParams().pk})
    const [isLoading,setLoading] = useState(true) 

    useEffect(()=>{
        const fetchDataLive = async () => {
            try{
                const response = await axios.get(`users/${userdata.id}/followed/`)
                const response2 = await axios.get(`users/${userdata.id}/`)
                setUsers(response.data.results)
                setUserData(response2.data)
            }
            catch(err){
                console.log(err)
            }
        }

        fetchDataLive()
        setLoading(false)
    },[])

    return (
        <div className='center'>
            <div className='block'>
                <h2>User: {userdata.username}</h2>
                <h1>Followed List</h1>
                <div className='block-users'>
                    {
                        isLoading
                        ?
                        <h2>Loading...</h2>
                        :
                        users.length>0
                        ?
                        users.map((it)=>(
                            <User user={it}/>
                        ))
                        :
                        <h2>No users found...</h2>
                    }
                </div>
            </div>
        </div>
    )
}

export default FollowedPage