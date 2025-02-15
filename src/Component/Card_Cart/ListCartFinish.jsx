/* eslint-disable react/prop-types */
const ListCartFinish = (props) => {
    const { brand, pcs, total } = props
    return (
        <div className="ListCart finish">
            <div className="TitlePcs">
                <h3>{brand}</h3>
                <h3>Rp {total}</h3>
            </div>
            <p>{pcs}x</p>
        </div>
    )
}

export default ListCartFinish;
