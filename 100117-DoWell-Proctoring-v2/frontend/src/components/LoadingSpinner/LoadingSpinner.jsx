import styles from "./styles.module.css";
import PropTypes from "prop-types";

const LoadingSpinner = ({ 
    color, 
    bgColor, 
    marginLeft, 
    marginRight, 
    width, 
    height, 
    className,
}) => {
    const customSpinnerColor = {
        borderTopColor: color ? color : "#005734",
        marginLeft: marginLeft ? marginLeft : "auto",
        marginRight: marginRight ? marginRight : "auto",
        width: width ? width : "1rem",
        height: height ? height : "1rem",
        backgroundColor: bgColor ? bgColor : 'transparent'
    }

    return <div 
        className={`${styles.loading} ${className ? className : ''}`} 
        style={customSpinnerColor}
    ></div>
}

LoadingSpinner.propTypes = {
    color: PropTypes.string,
    marginLeft: PropTypes.any,
    bgColor: PropTypes.string,
    marginRight: PropTypes.any,
    width: PropTypes.any,
    height: PropTypes.any,
    className: PropTypes.string,
}

export default LoadingSpinner;
