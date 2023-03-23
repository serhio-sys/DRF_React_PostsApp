import classes from "./CustomButton.module.css"

const CustomButton = ({children, ...props}) => {
    return (
        <button {...props} className={classes.btn}>{children}</button>
    );
};

export default CustomButton; 