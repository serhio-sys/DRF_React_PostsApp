import classes from "./Input.module.css"
import React from "react";

const Input = (props) => {
    return (
        <input {...props} className={classes.input}/>
    )
}
    
export default Input;