/* eslint-disable react/prop-types */
const ListCart = (props) => {
    const { brand, price, pcs, total,key} = props
    return (
        <div key={key} className="ListCart">
            <div key={key} className="TitlePcs">
                <h2>{brand}</h2>
                <h4>Rp {price}</h4>
            </div>
            <p>{pcs}x</p>
            <div className="TitlePcs">
                <h3>Rp {total}</h3>
                
            </div>
        </div>
    )
}

export default ListCart;

