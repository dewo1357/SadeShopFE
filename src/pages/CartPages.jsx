/* eslint-disable no-unused-vars */

import { useEffect, useRef } from "react";
import ListCart from "../Component/Card_Cart/ListCart";
import { useState } from "react";
import Statesss from "./States";
import CallPopupOrderAndPayment from "../Component/CallPopupOrderAndPayment";
import MyComponent from "./MyComponent";
import { active, DeleteCart, ClosePopup, FinishAndClosePoopup, process, Refresh_Token, ActionToDeleteCheckoutCart, getAcc } from "./manage";
import { useSocket } from "../SocketProvider";
import { API_URL } from "../../config";
import Button from "../Component/Element/Button/Button";
import PopupNotification from "../Component/popup/PopupNotifCation";

const CartPages = () => {
    const {
        totalItem, setTotalItem,
        VisibleForm, SetVisibleForm,
        isVisible, setVisible,
        listCart, SetListCart,
        GrabProduk, totalPrice, setTotal,
        FinsihPay, SetFinishPay,
    } = Statesss();

    const socket = useSocket()


    const [dataCart, setDataCart] = useState([]);
    const [account, setAccount] = useState(getAcc())
    const [ArrayCheck, setArrayCheck] = useState([]);
    const [ProcessMap, setProcessMap] = useState(false);
    const [Loading2, SetLoading2] = useState(true)
    const [address, seAddress] = useState({
        latitude: null, longitude: null, address: {
            state: null,
            city: null,
            road: null
        }
    });
    const [LoadingMap, setLoadingMap] = useState(false)

    const popup = useRef(null)
    const popup2 = useRef(null)
    const [transaction_id_array, setArrayTransaction] = useState([])
    const oke = async () => {
        try {
            const response = await fetch(API_URL + `GetCartBasedOnSeller`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${account.acces_token}` }
            });
            if (!response) {
                throw new Error("Gagal")
            }
            const result = await response.json();
            if (result.statusCode === 401) {
                await Refresh_Token(socket)
                location.href = "/cart"
            }
            setDataCart(JSON.parse(result.data))
            console.log(result)

            if (result.cartToPay) {
                setArrayTransaction(result.cartToPay)
                setTotalItem(result.TotalItem)
                setTotal(result.totalPrice)

            } else {
                setArrayTransaction([])
            }

            if (ArrayCheck.length === 0) {
                setArrayCheck(Array(JSON.parse(result.lengthCart)).fill(false))
            }
            setTempValuePcs(Array(JSON.parse(result.lengthCart)).fill(0))
            console.log(tempValuePcs)
            console.log("api memanggil")

        } catch (e) {
            console.log(e.messages)
        }
    }

    const Edit = async (id, target) => {
        console.log(target)
        try {
            const data = {
                idProduct: id,
                value: target,
            }
            const response = await fetch(API_URL + `EditPcsCart`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${account.acces_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.statusCode === 401) {
                await Refresh_Token(socket)
                location.href = "/cart"
            }
            if (!response) {
                throw new Error("Gagal Update Data")
            }


        } catch (err) {
            console.log(err.messages)
        }

    }
    let OverallIndex = 0; // variabel ini dipakai untuk seleksi checkbox
    const ConfirmBack = useRef();
    const IncrementDecrement = (id, pcs, increment,) => {
        setTimeout(() => {

            if (increment) {
                Edit(id, Number(pcs) + 1)
            } else {
                if (pcs > 0) {
                    EditPcs(id, Number(pcs) - 1)
                }
            }
            oke()
        }, 200)
    }

    const [tempValuePcs, setTempValuePcs] = useState([])
    console.log(tempValuePcs)

    const [onInput, setOnInput] = useState(false)
    const EditPcs = (id, target, index) => {
        //ketika saat edit tidak dalam mode input, maka bisa langsung render UPDATE
        //Namun ketika edit data berasal dari input maka akan bertahan sementara, dan update berjalan di fungsi OnBlur
        if (!onInput) {
            Edit(id, target)
            SetLoading2(true)
        } else {
            setTempValuePcs(tempValuePcs[index] = target)
        }

    }

    const close = () => {
        SetLoading2(false)
        location.href = "/products"
    }

    console.log(ArrayCheck)

    const Checked = async (e, idCart, OverallIndex) => {
        const payload_data = { idCart, e }
        const Check = ArrayCheck.slice();
        try {
            const response = await fetch(API_URL + "AddToPayCart", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${account.acces_token}`
                    , 'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload_data)
            })

            if (!response) {
                throw new Error("Failed")
            }
            const result = await response.json();
            if (result.statusCode === 401) {
                await Refresh_Token(socket)
            }

            setTotal(result.TotalPrice)
            setTotalItem(result.TotalItem)
            SetLoading2(true)

        } catch (err) {
            console.log(err.message)
        }
        if (e) {
            Check[OverallIndex] = true
        } else {
            //ketika checkbox non aktif maka akan di kurangi
            Check[OverallIndex] = false
        }
        setArrayCheck(Check);

    }

    console.log(transaction_id_array)



    //fungsi ini dipakai ketika proses input sudah selesai, dan ada di bagian OnBlur.
    const refresh = (id, target) => {
        setOnInput(false)
        SetLoading2(true)
        Edit(id, target)

    }

    const ActionToChekout = () => {
        location.href = "/checkout"
    }

    const [popupConfirm, setpopupconfirm] = useState(false)
    useEffect(() => {
        if (JSON.parse(localStorage.getItem('CheckoutData'))) {
            ConfirmBack.current.style.visibility = "visible"
            setTimeout(() => {
                setpopupconfirm(true)
            })
        }
        if (Loading2) {
            oke();
        }
        SetLoading2(false)
        console.log("menjalankan sekali")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Loading2])
    console.log(dataCart.length)
    const [processLoading, SetProcessLoading] = useState(false)
    console.log(address)






    return (
        <>
            <PopupNotification/>
            <div className="TitleMenu Keranjang">
                <h1 style={{ cursor: "pointer" }}
                    onClick={() => close()}>SadeShop.com</h1>
                <h1>
                    Cart
                </h1>
            </div>
            <div className="CartPagesLayout">
                <form action="">
                    {!Loading2 ? dataCart.map((item) => (
                        <div key={item}>
                            <h1>{item.Seller}</h1>
                            {item.cartProduk.map((items) => (

                                <div key={OverallIndex++} className="ListPesanan">
                                    <div>
                                        <input type="checkbox" checked={transaction_id_array.includes(items.id) ? true : false} name={items.title} id={items.title} onChange={(e) => Checked(e.target.checked, items.id, items.index)} />
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

                                        <input type="number" name={item.id} value={!onInput ? items.pcs : tempValuePcs[items.index] != 0 ? tempValuePcs[items.index] : items.pcs}
                                            onBlur={(e) => { refresh(items.id, Number(e.target.value)) }} onFocus={() => setOnInput(true)} onChange={(e) => EditPcs(items.id, Number(e.target.value), items.index, item.pcs, items.title)} readOnly={(ArrayCheck[items.index]) ? true : false} />

                                        <span onClick={(ArrayCheck[items.index] || transaction_id_array.includes(items.id))
                                            ? () => { } : () => { IncrementDecrement(items.id, items.pcs, true) }}>+</span>
                                    </div>
                                    <div className="HargaCart">
                                        <h2>Rp. {Intl.NumberFormat('id-ID').format(items.totalPrice)}</h2>
                                    </div>
                                    <div className={`hapusCart ${ArrayCheck[items.index] || transaction_id_array.includes(items.id) ? "NotActive" : ""}`}>
                                        <span onClick={(ArrayCheck[items.index] || transaction_id_array.includes(items.id) ? () => { } : () => {
                                            DeleteCart(items.id, setTotal, setTotalItem, totalPrice, totalItem, SetLoading2)
                                        })} >Delete</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )) : []}
                </form>
            </div>
            <div className="TotalPrice" >
                <div className="InfoPrice">
                    <p >Pcs :<b>{totalItem}</b></p>
                    <div>
                        <p>Total</p>
                        <h1>Rp {Intl.NumberFormat('id-ID').format(totalPrice)}</h1>
                    </div>
                </div>
                <Button styling="btn" action={(ArrayCheck.includes(true) || transaction_id_array.length != 0) ? () => active(false, ListCart.length, popup, setVisible, popup) : () => { }} ContentButton="Checkout" ></Button>
            </div>
            <div className="popup">
                <h1>oke</h1>
            </div>
            <CallPopupOrderAndPayment
                GrabProduk={GrabProduk}
                popup2={popup2}
                popup={popup}
                isVisible={isVisible}
                process={process}
                ClosePopup={ClosePopup}
                FinishAndClosePoopup={FinishAndClosePoopup}
                VisibleForm={VisibleForm}
                setVisible={setVisible}
                SetVisibleForm={SetVisibleForm}
                FinsihPay={FinsihPay}
                SetFinishPay={SetFinishPay}
                listCart={listCart}
                SetListCart={SetListCart}
                account={account}
                totalPrice={totalPrice}
                setTotal={setTotal}
                totalItem={totalItem}
                setTotalItem={setTotalItem}
                SetLoading2={SetLoading2}
                SetProcessLoading={SetProcessLoading}
                setProcessMap={setProcessMap}
                address={address}
                seAddress={seAddress}
                LoadingMap={LoadingMap}
                setLoadingMap={setLoadingMap}
            />
            <div className={`OverlayMap ${ProcessMap ? "OverlayMapOn" : ""}`}>
                <div className="Map">
                    <MyComponent setProcessMap={setProcessMap} seAddress={seAddress} setLoadingMap={setLoadingMap} />
                </div>
            </div>
            <div className={`loading ${processLoading ? "loadingOn" : ""}`} >
                <div className="OverlayLoading">
                    <h2>Mohon Ditunggu<br></br> Pesanan Kamu Sedang Di Proses</h2>
                    <img src="/Images/Loading.gif" alt="" />
                </div>
            </div>
            <div ref={ConfirmBack} className="overlay3">
                <div className={`ConfirmBackToCart ${popupConfirm ? "ConfirmBackToCartOn" : ""}`}>
                    <h2 style={{ color: "red" }} >PERINGATAN</h2>
                    <h2>
                        Terdapat Process Checkout
                    </h2>
                    <p>
                        Apakah Anda Ingin Melanjutkan Process Checkout?. <br /> Jika Tidak, Maka Data Checkout Sebelumnya Akan Dihapus Secara Permanen.
                    </p>
                    <div className="ConfirmBackToCartAction">
                        <button style={{ backgroundColor: "red" }} onClick={() => { ActionToDeleteCheckoutCart() }}>Hapus</button>
                        <button onClick={ActionToChekout}>Lanjutkan Process</button>
                    </div>
                </div>
            </div>
        </>


    )
}

export default CartPages