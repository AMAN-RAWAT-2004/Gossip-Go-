import {configureStore} from  "@reduxjs/toolkit"
import authReducers from './Slices/authSlices'
import userReducers from './Slices/userSlices'
import conversationReducers from './Slices/conversationSlices'
import messageReducers from "./Slices/messageSlice";

const store=configureStore({
    reducer:{
        auth:authReducers,
        users:userReducers,
        conversation:conversationReducers,
        messages:messageReducers,
    }
})

export default store;
