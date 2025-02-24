/* eslint-disable react/prop-types */


const CheckOutPayment = ({ SubtotalProductPrice, subTotalCost, subTotalService, Total }) => {
    return (
        <div>
            <div className="Payment">
                <h1>Information</h1>
            </div>
            <div className="ComponentPayment">
                <div>
                    <h2>Sub Total Amount</h2>
                </div>
                <div>
                    <h2>Rp {Intl.NumberFormat('id-ID').format(SubtotalProductPrice)}</h2>
                </div>
            </div>
            <div className="ComponentPayment">
                <div>
                    <h2>Sub Total Shipping Cost</h2>
                </div>
                <div>
                    <h2>Rp {Intl.NumberFormat('id-ID').format(subTotalCost)}</h2>
                </div>
            </div>
            <div className="ComponentPayment">
                <div>
                    <h2>Sub Total Service Cost</h2>
                </div>
                <div>
                    <h2>Rp {Intl.NumberFormat('id-ID').format(subTotalService)}</h2>
                </div>
            </div>
            <div className="ComponentPayment">
                <div>
                    <h2>Total</h2>
                </div>
                <div>
                    <h2>Rp {Intl.NumberFormat('id-ID').format(Total)}</h2>
                </div>
            </div>
        </div>
    );
};

export default CheckOutPayment;