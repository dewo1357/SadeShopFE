/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import ListCart from "../../Component/Card_Cart/ListCart";
import Statesss from "../States";
import CallPopupOrderAndPayment from "../../Component/CallPopupOrderAndPayment";
import MyComponent from "../MyComponent";
import { active, DeleteCart, ClosePopup, FinishAndClosePoopup, process, Refresh_Token, ActionToDeleteCheckoutCart, getAcc } from "../manage";
import { useSocket } from "../../SocketProvider";
import { API_URL } from "../../../config";
import PopupNotification from "../../Component/popup/PopupNotifCation";
import CartItemList from "./CartItem";
import CartTotalSection from "./CartTotalSection";
import { useNavigate } from "react-router-dom";

const CartPages = () => {
    const {
        totalItem, setTotalItem,
        VisibleForm, SetVisibleForm,
        isVisible, setVisible,
        listCart, SetListCart,
        GrabProduk, totalPrice, setTotal,
        FinsihPay, SetFinishPay,
    } = Statesss();
    
    const navigate = useNavigate();
    const socket = useSocket();
    const [dataCart, setDataCart] = useState([]);
    const [account, setAccount] = useState(getAcc());
    const [ArrayCheck, setArrayCheck] = useState([]);
    const [ProcessMap, setProcessMap] = useState(false);
    const [Loading2, SetLoading2] = useState(true);
    const [address, seAddress] = useState({
        latitude: null, longitude: null, address: {
            state: null,
            city: null,
            road: null
        }
    });
    const [LoadingMap, setLoadingMap] = useState(false);
    const popup = useRef(null);
    const popup2 = useRef(null);
    const [transaction_id_array, setArrayTransaction] = useState([]);
    const [tempValuePcs, setTempValuePcs] = useState([]);
    const [onInput, setOnInput] = useState(false);
    const [processLoading, SetProcessLoading] = useState(false);
    const ConfirmBack = useRef();

    const oke = async () => {
        try {
            const response = await fetch(API_URL + `GetCartBasedOnSeller`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${account.acces_token}` }
            });
            if (!response) {
                throw new Error("Gagal");
            }
            const result = await response.json();
            if (result.statusCode === 401) {
                await Refresh_Token(socket);
                navigate("/cart")
            }
            setDataCart(JSON.parse(result.data));
            console.log(result);

            if (result.cartToPay) {
                setArrayTransaction(result.cartToPay);
                setTotalItem(result.TotalItem);
                setTotal(result.totalPrice);
            } else {
                setArrayTransaction([]);
            }

            if (ArrayCheck.length === 0) {
                setArrayCheck(Array(JSON.parse(result.lengthCart)).fill(false));
            }
            setTempValuePcs(Array(JSON.parse(result.lengthCart)).fill(0));
            console.log(tempValuePcs);
            console.log("api memanggil");
        } catch (e) {
            console.log(e.messages);
        }
    };

    const Edit = async (id, target) => {
        console.log(target);
        try {
            const data = {
                idProduct: id,
                value: target,
            };
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
                await Refresh_Token(socket);
                navigate("/cart")
            }
            if (!response) {
                throw new Error("Gagal Update Data");
            }
        } catch (err) {
            console.log(err.messages);
        }
    };

    const IncrementDecrement = (id, pcs, increment) => {
        setTimeout(() => {
            if (increment) {
                Edit(id, Number(pcs) + 1);
            } else {
                if (pcs > 0) {
                    EditPcs(id, Number(pcs) - 1);
                }
            }
            oke();
        }, 200);
    };

    const EditPcs = (id, target, index) => {
        if (!onInput) {
            Edit(id, target);
            SetLoading2(true);
        } else {
            setTempValuePcs(tempValuePcs[index] = target);
        }
    };

    const close = () => {
        SetLoading2(false);
        navigate("/")
    };

    const Checked = async (e, idCart, OverallIndex) => {
        const payload_data = { idCart, e };
        const Check = ArrayCheck.slice();
        try {
            const response = await fetch(API_URL + "AddToPayCart", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${account.acces_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload_data)
            });

            if (!response) {
                throw new Error("Failed");
            }
            const result = await response.json();
            if (result.statusCode === 401) {
                await Refresh_Token(socket);
                location.href="/cart"
            }

            setTotal(result.TotalPrice);
            setTotalItem(result.TotalItem);
            SetLoading2(true);

        } catch (err) {
            console.log(err.message);
        }
        if (e) {
            Check[OverallIndex] = true;
        } else {
            Check[OverallIndex] = false;
        }
        setArrayCheck(Check);
    };

    const refresh = (id, target) => {
        setOnInput(false);
        SetLoading2(true);
        Edit(id, target);
    };

    const ActionToChekout = () => {
        location.hreg="/checkout"
        
    };

    const [popupConfirm, setpopupconfirm] = useState(false);
    useEffect(() => {
        if (account !== false) {
            if (Loading2) {
                oke();
            }
            SetLoading2(false);
            console.log("menjalankan sekali");
            
        }else{
            navigate("/login")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Loading2]);

    

    return (
        <>
            <PopupNotification />
            <div className="TitleMenu Keranjang">
                <h1 style={{ cursor: "pointer" }} onClick={() => close()}>SadeShop.com</h1>
                <h1>Cart</h1>
            </div>
            <CartItemList
                dataCart={dataCart}
                Loading2={Loading2}
                transaction_id_array={transaction_id_array}
                ArrayCheck={ArrayCheck}
                tempValuePcs={tempValuePcs}
                onInput={onInput}
                setOnInput={setOnInput}
                Checked={Checked}
                IncrementDecrement={IncrementDecrement}
                EditPcs={EditPcs}
                refresh={refresh}
                DeleteCart={DeleteCart}
                setTotal={setTotal}
                setTotalItem={setTotalItem}
                totalPrice={totalPrice}
                totalItem={totalItem}
                SetLoading2={SetLoading2}
            />
            <CartTotalSection
                totalItem={totalItem}
                totalPrice={totalPrice}
                ArrayCheck={ArrayCheck}
                transaction_id_array={transaction_id_array}
                active={active}
                ListCart={ListCart}
                popup={popup}
                setVisible={setVisible}
            />
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
            <div className={`loading ${processLoading ? "loadingOn" : ""}`}>
                <div className="OverlayLoading">
                    <h2>Mohon Ditunggu<br></br> Pesanan Kamu Sedang Di Proses</h2>
                    <img src="/Images/Loading.gif" alt="" />
                </div>
            </div>
        </>
    );
};

export default CartPages;