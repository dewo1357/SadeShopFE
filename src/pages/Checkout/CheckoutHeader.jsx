/* eslint-disable react/prop-types */
const CheckOutHeader = ({ address, BackToCart }) => {
    return (
        <div className="BodyCheckout">
            <div className="ComponentBodyCheckout">
                <div className="ButtonAndTitleCheckout">
                    <div>
                        <span onClick={BackToCart}><img src="/Images/arrow-left_10023749.png" alt="" /></span>
                    </div>
                    <div className="AddressCheckout">
                        <img src="/Images/round.png" alt="" />
                        <h3>{address.name}, {address.province} {address.city}, {address.jalan} {address.postalCode}</h3>
                       
                    </div>
                </div>
            </div>
            <div className="">
                <h1 style={{ marginBottom: "38px", marginTop: "32px" }}>Shipping Setting</h1>
            </div>
        </div>
    );
};

export default CheckOutHeader;