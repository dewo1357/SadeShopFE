/* eslint-disable no-unused-vars */

import { useEffect } from "react";
import { useState } from "react";
import Label from "../Component/Element/Label/Label";
import Statesss from "./States";
import { Refresh_Token, ActionToDeleteCheckoutCart, getAcc } from "./manage"
import { useRef } from "react";
import { useSocket } from "../SocketProvider";
import { API_URL } from "../../config";


const CheckOut = () => {
    const [CartCheckout, SetCartCheckout] = useState([])
    const [account,SetAccount] = useState(getAcc())
    const [loading, SetLoading] = useState(true);
    const [SubtotalProductPrice, SetSubTotalProdukPrice] = useState(0)
    const [subTotalCost, setSubTotalCost] = useState(0)
    const [subTotalService, setsubTotalService] = useState(0)
    const [Total, setTotalAll] = useState(0)
    const [address, setAddress] = useState({
        name: "",
        city: "",
        province: "",
        jalan: "",
        postalCode: ""

    })
    const [processLoading, SetProcessLoading] = useState(false)
    const socket = useSocket()

    const { Loading2, SetLoading2 } = Statesss();



    const GetCheckOutData = async () => {
        try {
            const response = await fetch(API_URL+"GetCheckOutData", {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${account.acces_token}`
                }
            })
            if (!response) {
                throw new Error("Failed To Fecth Data")
            }
            const result = await response.json()
            console.log(result)
            SetCartCheckout(result.data)
            SetLoading(false)
            SetSubTotalProdukPrice(result.subTotalPrice)
            setSubTotalCost(result.subTotalShippingCost)
            setsubTotalService(result.ServicePrice)
            setTotalAll(result.Total)

            //mengambil data alamat dari salah satu data checkout. 
            //mengambil index pertama saja karena index selanjutnya juga sama
            setAddress({
                name: result.data[0].Customer,
                city: result.data[0].city,
                province: result.data[0].province,
                jalan: result.data[0].kecamatan,
                postalCode: result.data[0].postalCode
            })

        } catch (err) {
            console.log(err.message)
        }
    }

    const EditPilihanPengiriman = async (transaction_id, value) => {
        try {
            const response = await fetch(API_URL+"ShippingSetter", {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transaction_id: transaction_id,
                    value: value
                })
            })
            if (!response) {
                throw new Error("Failed")
            }
            const result = await response.json();
            if (result.statusCode == -401) {
                await Refresh_Token(socket)
                location.href = "/cart"
            }
            SetLoading(true)
        } catch (e) {
            console.log(e.message)
        }
    }
    console.log(Loading2)
    useEffect(() => {
        SetLoading2(true)
        if (loading) {
            GetCheckOutData();
            console.log(account.username)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading])
    console.log(CartCheckout)
    console.log(address)

    const ProcessOrder = async () => {
        SetProcessLoading(true)
        try {
            const response = await fetch(API_URL+"FinishCheckout", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${account.acces_token}`
                }
            })
            if (!response) {
                throw new Error("Failed")
            }
            const result = await response.json();
            if (result.statusCode == 401) {
                await Refresh_Token(socket)
                location.href = "/cart"
            }
            localStorage.removeItem("CheckoutData")
            location.href = "/InformationOrder"
        } catch (e) {
            console.log(e.message)
        }
    }


    const ConfirmBack = useRef();
    const [popupConfirm, setpopupconfirm] = useState(false)
    const BackToCart = () => {
        if (JSON.parse(localStorage.getItem('CheckoutData'))) {
            ConfirmBack.current.style.visibility = "visible"
            setTimeout(() => {
                setpopupconfirm(true)
            }, 100)
        }
    }



    return (
        <>
            <div className="FormCheckout">
                <div ref={ConfirmBack} className="overlay3">
                    <div className={`ConfirmBackToCart ${popupConfirm ? "ConfirmBackToCartOn" : ""}`}>
                        <h2 style={{ color: "red" }} >PERINGATAN</h2>
                        <h2>
                            Apakah Anda Yakin Untuk Kembali?
                        </h2>
                        <p>
                            Jika Kembali, Maka Data Checkout Akan hilang. <br /> Data Checkout Ini Bersifat Sementara
                        </p>
                        <div className="ConfirmBackToCartAction">
                            <button onClick={() => { ConfirmBack.current.style.visibility = "hidden" }}>Batal</button>
                            <button onClick={() => { ActionToDeleteCheckoutCart() }} style={{ backgroundColor: "red" }}>Batal Checkout</button>
                        </div>
                    </div>
                </div>
                <div className="BodyCheckout">
                    <div className="ComponentBodyCheckout">
                        <div className="ButtonAndTitleCheckout">
                            <div>
                                <span onClick={BackToCart}><img src="/Images/arrow-left_10023749.png" alt="" /></span>
                            </div>
                            <div style={{ textAlign: "left", display: "flex", gap: "12px", alignItems: "center", fontSize: "20px" }}>

                                <img src="/Images/round.png" alt="" /><h3>{address.name}, {address.province} {address.city}, {address.jalan} {address.postalCode}</h3>
                                <h2>Checkout</h2>
                            </div>

                        </div>
                        <div className="InformationCheckout">

                            <div>
                                {CartCheckout.map((item, index) => (
                                    <div key={index} className="ContanerProductList" >
                                        <h3>{item.Seller.nama}</h3>
                                        {item.product.map((items, index) =>
                                            <div key={index} className="productList Order">
                                                <div>
                                                    <h3>{items.title}</h3>
                                                </div>
                                                <div>
                                                    <h3>Rp {Intl.NumberFormat('id-ID').format(items.totalPrice)}</h3>
                                                </div>
                                            </div>
                                        )}
                                        <div className="FooterOngkos">
                                            <h3>Ongkos Kirim</h3>
                                            <h3>Rp {Intl.NumberFormat("id-ID").format(item.piihan_pengiriman.cost)}</h3>
                                        </div>
                                        <div className="FooterOngkos">
                                            <h3>Total</h3>
                                            <h3>Rp {Intl.NumberFormat("id-ID").format(item.totalPay)}</h3>
                                        </div>
                                    </div>


                                ))}
                            </div>
                        </div>
                        <div>

                        </div>
                    </div>
                    <div className="ComponentBodyCheckout">
                        <div className="ButtonAndTitleCheckout">
                            <h1 style={{ marginBottom: "38px", marginTop: "32px" }}>Shipping Setting</h1>
                        </div>
                        <div className="productContainer">
                            {CartCheckout.map((item, index) => (
                                <div key={index} className="ContanerProductList" >
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
                                        <Label Content="Pengiriman" ></Label>
                                        <select name="" id="" onChange={(e) => { EditPilihanPengiriman(item.transaction_id, e.target.value) }}>
                                            {item.jenis_pengiriman.map((itemss, index) => (
                                                <option key={index} value={index}>
                                                    {itemss.description}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="HeaderShipping">
                                        <h2>
                                            {item.piihan_pengiriman.name}
                                        </h2>
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
                </div>
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
                <div className="EksekusiCheckout">
                    <button onClick={ProcessOrder}>Buat Pesanan</button>
                </div>
            </div>
            <div className={`loading ${processLoading ? "loadingOn" : ""}`} >
                <div className="OverlayLoading">
                    <h2>Mohon Ditunggu<br></br> Pesanan Kamu Sedang Di Proses</h2>
                    <img src="/Images/Loading.gif" alt="" />
                </div>
            </div>
        </>
    )
}

export default CheckOut;