/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import Statesss from "../States";
import { Refresh_Token, ActionToDeleteCheckoutCart, getAcc } from "../manage";
import { useSocket } from "../../SocketProvider";
import { API_URL } from "../../../config";
import PopupNotification from "../../Component/popup/PopupNotifCation";
import CheckOutHeader from "./CheckoutHeader";
import CheckOutProductList from "./CheckoutProductList";
import CheckOutPayment from "./CheckOutPayment";

const CheckOut = () => {
    const [CartCheckout, SetCartCheckout] = useState([]);
    const [account, SetAccount] = useState(getAcc());
    const [loading, SetLoading] = useState(true);
    const [SubtotalProductPrice, SetSubTotalProdukPrice] = useState(0);
    const [subTotalCost, setSubTotalCost] = useState(0);
    const [subTotalService, setsubTotalService] = useState(0);
    const [Total, setTotalAll] = useState(0);
    const [address, setAddress] = useState({
        name: "",
        city: "",
        province: "",
        jalan: "",
        postalCode: ""
    });
    const [processLoading, SetProcessLoading] = useState(false);
    const socket = useSocket();
    const { Loading2, SetLoading2 } = Statesss();
    const ConfirmBack = useRef();
    const [popupConfirm, setpopupconfirm] = useState(false);

    const GetCheckOutData = async () => {
        try {
            const response = await fetch(API_URL + "GetCheckOutData", {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${account.acces_token}`
                }
            });
            if (!response) {
                throw new Error("Failed To Fetch Data");
            }
            const result = await response.json();
            console.log(result);
            SetCartCheckout(result.data);
            SetLoading(false);
            SetSubTotalProdukPrice(result.subTotalPrice);
            setSubTotalCost(result.subTotalShippingCost);
            setsubTotalService(result.ServicePrice);
            setTotalAll(result.Total);

            // Mengambil data alamat dari salah satu data checkout
            setAddress({
                name: result.data[0].Customer,
                city: result.data[0].city,
                province: result.data[0].province,
                jalan: result.data[0].kecamatan,
                postalCode: result.data[0].postalCode
            });
        } catch (err) {
            console.log(err.message);
        }
    };

    const EditPilihanPengiriman = async (transaction_id, value) => {
        try {
            const response = await fetch(API_URL + "ShippingSetter", {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transaction_id: transaction_id,
                    value: value
                })
            });
            if (!response) {
                throw new Error("Failed");
            }
            const result = await response.json();
            if (result.statusCode === -401) {
                await Refresh_Token(socket);
                location.href = "/cart";
            }
            SetLoading(true);
        } catch (e) {
            console.log(e.message);
        }
    };

    const ProcessOrder = async () => {
        SetProcessLoading(true);
        try {
            const response = await fetch(API_URL + "FinishCheckout", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${account.acces_token}`
                }
            });
            if (!response) {
                throw new Error("Failed");
            }
            const result = await response.json();
            if (result.statusCode === 401) {
                await Refresh_Token(socket);
                location.href = "/cart";
            }
            localStorage.removeItem("CheckoutData");
            location.href = "/InformationOrder";
        } catch (e) {
            console.log(e.message);
        }
    };

    const BackToCart = () => {
        if (JSON.parse(localStorage.getItem('CheckoutData'))) {
            ConfirmBack.current.style.visibility = "visible";
            setTimeout(() => {
                setpopupconfirm(true);
            }, 100);
        }
    };

    useEffect(() => {
        SetLoading2(true);
        if (loading) {
            GetCheckOutData();
            console.log(account.username);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    return (
        <>
            <div className="FormCheckout">
                <div ref={ConfirmBack} className="overlay3">
                    <div className={`ConfirmBackToCart ${popupConfirm ? "ConfirmBackToCartOn" : ""}`}>
                        <h2 style={{ color: "red" }}>PERINGATAN</h2>
                        <h2>Apakah Anda Yakin Untuk Kembali?</h2>
                        <p>
                            Jika Kembali, Maka Data Checkout Akan hilang. <br /> Data Checkout Ini Bersifat Sementara
                        </p>
                        <div className="ConfirmBackToCartAction">
                            <button onClick={() => { ConfirmBack.current.style.visibility = "hidden" }}>Batal</button>
                            <button onClick={() => { ActionToDeleteCheckoutCart() }} style={{ backgroundColor: "red" }}>Batal Checkout</button>
                        </div>
                    </div>
                </div>
                <CheckOutHeader address={address} BackToCart={BackToCart} />
                <div style={{backgroundColor:"black",padding:"5px",borderRadius:"10px"}}>
                    <CheckOutProductList CartCheckout={CartCheckout} EditPilihanPengiriman={EditPilihanPengiriman} />
                </div>
                <CheckOutPayment
                    SubtotalProductPrice={SubtotalProductPrice}
                    subTotalCost={subTotalCost}
                    subTotalService={subTotalService}
                    Total={Total}
                />
                <div className="EksekusiCheckout">
                    <button onClick={ProcessOrder}>Buat Pesanan</button>
                </div>
            </div>
            <div className={`loading ${processLoading ? "loadingOn" : ""}`}>
                <div className="OverlayLoading">
                    <h2>Mohon Ditunggu<br></br> Pesanan Kamu Sedang Di Proses</h2>
                    <img src="/Images/Loading.gif" alt="" />
                </div>
            </div>
            <PopupNotification />
        </>
    );
};

export default CheckOut;