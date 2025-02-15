/* eslint-disable react/prop-types */
const Label = (props) => {
    const { Content } = props;
    return (
        <div>
            <label htmlFor="">{ Content }</label>
        </div>
    )
}


export default Label;