import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom"
import { selectCurrentUser } from "../context/authSlice";


const RequreAuth = () => {
    
    const user = useSelector(selectCurrentUser)
    return (
            user
            ?
            <Outlet/>
            :
            <Navigate to={'/unauthorized/'}/>
    )
}


export default RequreAuth;