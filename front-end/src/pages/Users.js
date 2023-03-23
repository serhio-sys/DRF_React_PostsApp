import { useEffect, useState } from "react"
import axios from "../api/axios"
import User from "../components/User"

const Users = () => {
    const [users,setUsers] = useState([])
    const [search,setSearch] = useState('')
    const [interval,setInt] = useState()
    const [isLoading,setLoading] = useState(false) 

    const fetchDataLive = async () => {
        try{
            const response = await axios.post('search-users/',{'username':search})
            setUsers(response.data.users)
            console.log(response.data.users)
        }
        catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{    
        clearTimeout(interval)  
        setLoading(true)
        setInt(setTimeout(()=>{
            setLoading(false) 
            fetchDataLive()  
        },1000))
    },[search])

    useEffect(()=>{
        fetchDataLive()
        setLoading(false)
    },[])

    return (
        <div className='center'>
            <div className='block'>
                <h2>Live Search</h2>
                <input type={'text'} className='search-input' onChange={(e)=>{setSearch(e.target.value)}} placeholder="Enter name of users"/>
                <h1>Users List</h1>
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

export default Users