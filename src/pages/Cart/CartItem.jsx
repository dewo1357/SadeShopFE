/* eslint-disable react/prop-types */


const CartItemList = ({
    dataCart,
    Loading2,
    transaction_id_array,
    ArrayCheck,
    tempValuePcs,
    onInput,
    setOnInput,
    Checked,
    IncrementDecrement,
    EditPcs,
    refresh,
    DeleteCart,
    setTotal,
    setTotalItem,
    totalPrice,
    totalItem,
    SetLoading2
}) => {
    let OverallIndex = 0;

    return (
        <div className="CartPagesLayout">
            {!Loading2 ? dataCart.map((item) => (
                <div key={item.Seller}>
                    <h1>{item.Seller}</h1>
                    {item.cartProduk.map((items) => (
                        <div key={OverallIndex++} className="ListPesanan">
                            <div>
                                <input
                                    type="checkbox"
                                    checked={transaction_id_array.includes(items.id)}
                                    onChange={(e) => Checked(e.target.checked, items.id, items.index)}
                                />
                            </div>
                            <div className="JudulCart">
                                <h2>{items.title}</h2>
                            </div>
                            <div className="HargaCart">
                                <h2>Rp. {Intl.NumberFormat('id-ID').format(items.price)}</h2>
                            </div>
                            <div className={`EditPcs ${ArrayCheck[items.index] || transaction_id_array.includes(items.id) ? "NotActive" : ""}`}>
                                <span onClick={(ArrayCheck[items.index] || transaction_id_array.includes(items.id))
                                    ? () => { } : () => { IncrementDecrement(items.id, items.pcs, false) }}>-</span>
                                <input
                                    type="number"
                                    value={!onInput ? items.pcs : tempValuePcs[items.index] != 0 ? tempValuePcs[items.index] : items.pcs}
                                    onBlur={(e) => { refresh(items.id, Number(e.target.value)) }}
                                    onFocus={() => setOnInput(true)}
                                    onChange={(e) => EditPcs(items.id, Number(e.target.value), items.index)}
                                    readOnly={ArrayCheck[items.index]}
                                />
                                <span onClick={(ArrayCheck[items.index] || transaction_id_array.includes(items.id))
                                    ? () => { } : () => { IncrementDecrement(items.id, items.pcs, true) }}>+</span>
                            </div>
                            <div className="HargaCart">
                                <h2>Rp. {Intl.NumberFormat('id-ID').format(items.totalPrice)}</h2>
                            </div>
                            <div className={`hapusCart ${ArrayCheck[items.index] || transaction_id_array.includes(items.id) ? "NotActive" : ""}`}>
                            <span onClick={ArrayCheck[items.index] || transaction_id_array.includes(items.id) ? () => { } : () => {
                                    DeleteCart(items.id, setTotal, setTotalItem, totalPrice, totalItem, SetLoading2)
                                }}>Delete</span>
                            </div>
                        </div>
                    ))}
                </div>
            )) : []}
        </div>
    );
};

export default CartItemList;