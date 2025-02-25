/* eslint-disable react/prop-types */
const ListCart = (props) => {
    const { brand, price, pcs, total,keys} = props
    return (
        <div key={keys} className="ListCart">
            <div key={keys} className="TitlePcs">
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

