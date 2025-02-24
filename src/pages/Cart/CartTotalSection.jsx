/* eslint-disable react/prop-types */

import Button from "../../Component/Element/Button/Button";

const CartTotalSection = ({
    totalItem,
    totalPrice,
    ArrayCheck,
    transaction_id_array,
    active,
    ListCart,
    popup,
    setVisible
}) => {
    return (
        <div className="TotalPrice">
            <div className="InfoPrice">
                <p>Pcs :<b>{totalItem}</b></p>
                <div>
                    <p>Total</p>
                    <h1>Rp {Intl.NumberFormat('id-ID').format(totalPrice)}</h1>
                </div>
            </div>
            <Button
                styling="btn"
                action={(ArrayCheck.includes(true) || transaction_id_array.length != 0) ? () => active(false, ListCart.length, popup, setVisible, popup) : () => { }}
                ContentButton="Checkout"
            />
        </div>
    );
};

export default CartTotalSection;