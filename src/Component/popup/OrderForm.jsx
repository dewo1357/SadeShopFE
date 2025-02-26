/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState } from "react";
import Button from "../Element/Button/Button";
import { API_URL } from "../../../config";
import { getAcc, Refresh_Token } from "../../pages/manage";
import { Await } from "react-router-dom";
const OrderForm = (props) => {
    const { product, active,SetLoading2, popup2, setMotionLeft, MotionMenuCart } = props;
    const [Pcs, SetPcs] = useState(1);
    const [Index, SetIndex] = useState(0);
    const [account,setAccount]=useState(getAcc())

    const close = () => {
        console.log()
        active(false, popup2);
        SetPcs(1);
        SetIndex(0);
    };


    const AddToAPI = async () => {
        const data_baru = {
            idProduct: product.id,
            index: Index,
            pcs: Pcs,
            SellerID: product.SellerID,
        }
        try {
            const response = await fetch(API_URL + "addToCart", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${account.acces_token}`,
                },
                body: JSON.stringify(data_baru)
            })
            if (!response) {
                throw new Error("Gagal Memasukan Keranjang")
            }
           
            let result = await response.json();
            if(result.statusCode === 401){
                await Refresh_Token();
                return location.href="/"
            }
            const product = result.data;
            console.log(product)
            active(false)

        } catch (err) {
            console.log(err.message)
        }
    }


    const AddToCart = async (e) => {
        e.preventDefault();
        await AddToAPI();
        SetLoading2 ? SetLoading2(true) : alert("Check Your Cart")
        active(false, popup2);
        MotionMenuCart && innerWidth > 700 ? MotionMenuCart(false, setMotionLeft): alert("Check Your Cart")
    }

    return (
        <div>
            <div className="InfoProduct">
                <Button ContentButton="✖" action={close}></Button>
                <div className="container">
                    <div className="left">
                        <img src={product ? "https://qcgtgzcrwkdtkzzgkclh.supabase.co/storage/v1/object/public/gambarProducts/" + product.URLimages : null} alt="" />
                    </div>
                    <div className="right">
                        <div className="HeaderAndPrice">
                            <div>
                                <h1>{product ? product.title : null}</h1>
                                <h2>{product ? product.kind[Index] : null}</h2>
                            </div>
                            <div>
                                <h1 >Rp {product ? new Intl.NumberFormat('ID-id').format(product.price[Index] * Pcs) : null}</h1>
                                <div className="SumOfPcs">
                                    <span className={`ComponentCategoryOption pcs ${Pcs == 1 ? 'disabled' : ''}`} onClick={Pcs > 1 ? () => { SetPcs(Pcs - 1) } : undefined}>➖</span>
                                    {(product && product.stok[Index] > 0) ? Pcs : "SOLD"}
                                    <span onClick={product && product.stok[Index] > Pcs ? () => { SetPcs(Pcs + 1) }
                                        : undefined}
                                        className={`ComponentCategoryOption pcs ${product && product.stok[Index] <= Pcs ? 'disabled' : ''}`}>
                                        ➕</span>
                                </div>
                            </div>
                        </div>
                        <div className="ContentProductForm">
                            <p>{product ? product.content : null}</p>
                        </div>
                        <div className="FooterOrderForm">
                            <div className="CategoryOption" >
                                {product ? product.kind.map((item, index) => (
                                    <span
                                        className={`ComponentCategoryOption ${Index === index ? "disabled" : ""}`}
                                        onClick={Index !== index ? () => { SetIndex(index) } : undefined}
                                        key={item}>{index + 1}
                                    </span>))
                                    : null}
                            </div>
                            <Button styling="btn" ContentButton="Add To Cart" action={AddToCart} disabled={product ? product.stok[Index] <= 0 ? true : false : ""} ></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}


export default OrderForm