/* eslint-disable react/prop-types */
const PersonalDetail = (props) => {
    const { title,data } = props;
    return (
        <div className="ComponentPersonalDetail">
            <h3> {title} </h3>
            <h3><span>{data}</span></h3>
        </div>
    )
}

export default PersonalDetail