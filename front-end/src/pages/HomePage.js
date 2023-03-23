import React from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentToken, selectCurrentUser } from '../context/authSlice'

const HomePage = () => {
  const user = useSelector(selectCurrentUser)
  const token = useSelector(selectCurrentToken)
  console.log(token)
  console.log(user)
  return (
    <div className='center'>
        <div className='block-title'>
            Home
        </div>
    </div>
  )
}

export default HomePage