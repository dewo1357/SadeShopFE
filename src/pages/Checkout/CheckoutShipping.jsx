/* eslint-disable react/prop-types */

import Label from "../../Component/Element/Label/Label";

const CheckOutShipping = ({ CartCheckout, EditPilihanPengiriman }) => {
    return (
        <div className="ComponentBodyCheckout">
            <div className="productContainer">
                {CartCheckout.map((item, index) => (
                    <div key={index} className="ContanerProductList">
                        <h3>Seller : {item.Seller.nama}</h3>
                        {item.product.map((items, index) => (
                            <div key={index} className="productList Order">
                                <div>
                                    <h3>{items.title}</h3>
                                </div>
                                <div>
                                    <h3>Rp {Intl.NumberFormat('id-ID').format(items.totalPrice)}</h3>
                                </div>
                            </div>
                        ))}
                        <div className="ShippingOption" key={item.transaction_id}>
                            <Label Content="Pengiriman" />
                            <select onChange={(e) => { EditPilihanPengiriman(item.transaction_id, e.target.value) }}>
                                {item.jenis_pengiriman.map((itemss, index) => (
                                    <option key={index} value={index}>
                                        {itemss.description}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="HeaderShipping">
                            <h2>{item.piihan_pengiriman.name}</h2>
                        </div>
                        <div className="Shipping">
                            <div>
                                <p>{item.piihan_pengiriman.description}</p>
                                <p>Rp {Intl.NumberFormat('id-ID').format(item.piihan_pengiriman.cost)}</p>
                            </div>
                            <div>
                                <p>{item.piihan_pengiriman.service}</p>
                                <p>{item.piihan_pengiriman.etd}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CheckOutShipping;