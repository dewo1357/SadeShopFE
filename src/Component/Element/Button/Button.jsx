/* eslint-disable react/prop-types */
const Button = (props) => {
    const { ContentButton,action,isHidden,styling,disabled } = props
    return (
        <div className={styling}>
            <button  type="submit" onClick={ action?action:null } hidden={isHidden} disabled={disabled}> { ContentButton } </button>
        </div>
    )
}
export default Button