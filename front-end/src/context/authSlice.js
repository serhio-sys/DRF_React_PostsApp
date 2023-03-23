import { createSlice } from "@reduxjs/toolkit"
import jwtDecode from "jwt-decode"

const authSlice = createSlice({
    name: 'auth',
    initialState: { user: localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')).username : null,
                    token: localStorage.getItem('token') ? localStorage.getItem('token') : null,
                    refresh: localStorage.getItem('refresh') ? localStorage.getItem('refresh') : null},
    reducers: {
        setCredentials: (state, action) => {
            const { user, access, refresh } = action.payload
            state.user = user
            state.token = access
            state.refresh = refresh
        },
        logOut: (state, action) => {
            localStorage.removeItem('token')
            localStorage.removeItem('refresh')
            state.user = null
            state.token = null
            state.refresh = null
        },
        refreshToken: (state, action) => {
            console.log("refreshed")
            const {access,refresh} = action.payload
            localStorage.setItem('token',access)
            localStorage.setItem('refresh',refresh)
            state.token = access
            state.refresh = refresh
        }
    },
})

export const { setCredentials, logOut, refreshToken } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentToken = (state) => state.auth.token
export const selectCurrentRefresh = (state) => state.auth.refresh