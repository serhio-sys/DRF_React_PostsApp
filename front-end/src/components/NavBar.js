import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {Link, useNavigate} from 'react-router-dom'
import { logOut, selectCurrentUser } from '../context/authSlice'

export default function NavBar(props) {
    const user = useSelector(selectCurrentUser)
    //const token = useSelector(selectCurrentToken)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    return(
        <nav>
            <div className='logo'>
                PostApp
            </div>
            <ul>
                <li><Link to='/users/'>Users</Link></li>
                <li><Link to='/posts/'>Posts</Link></li>
                <li><Link to='/'>Home</Link></li>
                {
                    user
                    ?
                    <li class="dropdown">
                    <button class="dropbtn">{user}</button>
                    <div class="dropdown-content">
                        <Link to={'/profile/'}>Profile</Link>
                        <Link onClick={()=>{
                            dispatch(logOut())
                            navigate('/')
                            }} className='btn'>Logout</Link>
                    </div>
                    </li>
                    :
                    <li class="dropdown">
                    <button class="dropbtn">Profile</button>
                    <div class="dropdown-content">
                        <Link to='/sign-in/' className='btn'>Sign in</Link>
                        <Link to='/sign-up/' className='btn'>Sign up</Link>
                    </div>
                    </li>
                }
            </ul>
        </nav>
    )
}