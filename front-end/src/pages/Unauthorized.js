import React from 'react'
import { Link } from 'react-router-dom'

const Unaithorized = () => {
  return (
    <div className='center'>
        <div className='block-title'>
            Unauthorized
        </div>
        <Link to="/sign-in/" className='block-title linkk'>Sign In</Link>
    </div>
  )
}

export default Unaithorized