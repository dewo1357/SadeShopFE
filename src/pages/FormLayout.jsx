/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const FormLayout = (props) => {
    const {title, Content, Children, type} = props;
    return (
        <div className='formLayOut'>
            <h1>{title}</h1>
            <p>{ Content }</p>
            { Children }
            <Navigation navi={ type }/>
        </div>
    )
}

const Navigation = ({ navi })=>{
    if(navi==='register'){
        return(
            <><p>Have a Account? <Link to={"/"}>Login</Link></p></>
        )
    }else{
        return (
            <><p>Haven't a Account? <Link to={"/register"}>Register</Link></p></>
        )
    }
}

export default FormLayout;