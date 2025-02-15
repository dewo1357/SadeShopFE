/* eslint-disable react/prop-types */
const Input = (props) => {
    const { type, placeholder, name, value, onChange, blur, isHidden,max } = props;
    return (
        <div>
            <input type={type} 
            placeholder={placeholder} 
            value={value} 
            name={name} 
            onChange={onChange} 
            onBlur={blur} 
            defaultValue={value} 
            hidden={isHidden} 
            maxLength={max}
            required />
        </div>
    )
}

export default Input;