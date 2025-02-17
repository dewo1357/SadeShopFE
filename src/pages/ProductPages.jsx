/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import CardProduct from "../Component/Card_Cart/CardLProduct";
import { useState, useEffect, useRef } from "react";
import ListCart from "../Component/Card_Cart/ListCart";
import Search from "../Component/Search";
import SmartPhoneCartAndMenu from "../Component/SmartPhoneCartAndMenu/SmartPhoneCartAndMenu";
import HeaderMenu from "../Component/HeaderMenu";
import OrderForm from "../Component/popup/OrderForm";
import { active, MotionMenuCart, DeleteCart, Close, SearchCard, GetData, Get_Cart } from "./manage";
import Statesss from "./States";
import Button from "../Component/Element/Button/Button";
import { useSocket } from "../SocketProvider";
import PopupNotification from "../Component/popup/PopupNotifCation";
const ProductPages = () => {
    const socket = useSocket();

    const {
        totalItem, setTotalItem,
        listCart, SetListCart,
        totalPrice, setTotal, RightOn,
        GrabProduk, SetGrabProduk } = Statesss();
    const [GenreData, setGenre] = useState([])
    const [Loading2, SetLoading2] = useState(true)

    //visibleForm FormPayment

    //NavCartMotionState
    const [motionLeft, setMotionLeft] = useState(false);
    //popups
    const popup2 = useRef(null)

    const account = JSON.parse(localStorage.getItem('account'))
    const Session_DataProduk = sessionStorage.getItem('ProductMaster');

    const [popupConfirm, setpopupconfirm] = useState(false)
    const [popupConfirm2, setpopupconfirm2] = useState(false)
    const [message, setMessage] = useState(null)

    const [Loading, SetLoading] = useState(true);

    const ActionGrabProduk = (data) => {
        console.log(data)
        Close(true, popup2)
        SetGrabProduk(data);
    }
    const Get_data = async () => {
        if (Session_DataProduk !== null) {
            console.log("data diambil dari session");
            SetLoading(false)
            return setGenre(JSON.parse(Session_DataProduk))
        }
        const data = await GetData(account.acces_token, socket);
        if (data) {
            console.log("data diambil dari API")
            setGenre(data);
            SetLoading(false)
            sessionStorage.setItem('ProductMaster', JSON.stringify(data))
            sessionStorage.removeItem('CartUser')
        }


    }


    const [SumProcess, setSumProcess] = useState(0)
    const [notifMessage, setNotifMessage] = useState(false)
    const ConfirmBack = useRef();
    useEffect(() => {
        if (!account.isRegist) {
            if (socket) {
                socket.emit("Register", {
                    username: account.username,
                    id: account.id
                })
                const data = { ...account, isRegist: true }
                localStorage.setItem('account', JSON.stringify(data))
            }
        }

        if (Loading2) {
            console.log("menjalankan")
            Get_data();
            Get_Cart(SetListCart, setSumProcess, setNotifMessage, account);
            SetLoading2(false)
        }
    }, [Loading2, socket]);
    console.log(listCart)

    if (account == null) {
        location.href = "/";
    } else {
        return (
            GenreData !== null || listCart !== null ? <>
                <div className="OverallProductsPages">
                    <PopupNotification
                        socket={socket}
                        popupConfirm={popupConfirm}
                        popupConfirm2={popupConfirm2}
                        setpopupconfirm={setpopupconfirm}
                        setMessage={setMessage}
                    />
                    <div>
                        <div className="TitleMenu">
                            <h1>SadeShop.com</h1>
                            <HeaderMenu
                                socket={socket}
                                selected={0}
                                To2={`/profil/${account.username}`}
                                To4="/"
                                To3="/SettingPages"
                                motionLeft={motionLeft}
                                MotionMenuCart={MotionMenuCart}
                                setMotionLeft={setMotionLeft}
                                ConfirmBack={ConfirmBack}
                                setpopupconfirm2={setpopupconfirm2}
                                RightOn={RightOn}
                                SumProcess={SumProcess}
                                notifMessage={notifMessage}

                            >
                            </HeaderMenu>

                        </div>
                        <Search type="text" placeholder="Search Produk" action={(e) => SearchCard(e, GenreData, setGenre)} />

                        <SmartPhoneCartAndMenu listCart={listCart} index={0} DeleteCart={DeleteCart}
                            totalItem={totalItem} totalPrice={totalPrice}
                            active={() => { active(false, ListCart.length) }}

                            To2="profile" To4="/"
                        />

                        <div className={` ${motionLeft ? "ProductPages motion_on" : "ProductPages"}`}>
                            {!Loading ? GenreData.map((item) => (
                                <CardProduct key={item.id} >
                                    <CardProduct.images source={"https://qcgtgzcrwkdtkzzgkclh.supabase.co/storage/v1/object/public/gambarProducts/" + item.URLimages} />
                                    <CardProduct.HeaderContent title={item.title} seller={item.name.nama} dataProduct={item}>
                                        <p>
                                            {item.content}
                                        </p>
                                    </CardProduct.HeaderContent>
                                    {item.Account.username !== account.username ?
                                        <CardProduct.Footer price={new Intl.NumberFormat('id-ID').format(item.price[0])} action={() => ActionGrabProduk(item)} Content="ORDER" />
                                        : <CardProduct.Footer price={new Intl.NumberFormat('id-ID').format(item.price[0])} action={() => { location.href = `/profil/${item.Account.username}` }} Content="CHECK" />}
                                </CardProduct>
                            )) : 'Loading'}
                        </div>
                    </div>
                    <div className={`CartContainer ${motionLeft ? "motion_Cart" : ""}`}>
                        <div hidden={motionLeft ? false : true}
                            style={{
                                display: "flex", marginTop: "0",
                                alignItems: "center", justifyContent: "space-around"
                            }}>
                            <h1 style={{
                                textAlign: "left", marginLeft: "1",transition:"1000ms",
                                width: motionLeft?"280px":"0px", margin: "5px"
                            }} hidden={motionLeft ? false : true}>CART</h1>
                            <button hidden={motionLeft ? false : true}
                                style={{
                                    height: "40px", backgroundColor: "transparent",
                                    display: motionLeft ? "flex" : "none", justifyContent: "center", border: "0px"
                                }}
                                onClick={() => { MotionMenuCart(motionLeft, setMotionLeft) }}>
                                <img hidden={motionLeft ? false : true} src="/Images/icons8-cancel-64.png" width="40"></img>
                            </button>
                        </div>
                        <div className="LayoutListCart" hidden={motionLeft ? false : true}>
                            {listCart.map((items, index) => (
                                <ListCart key={`${items.idCart}${index}`} brand={items.title} pcs={items.pcs}
                                    price={new Intl.NumberFormat('id-ID').format(items.price)}
                                    total={new Intl.NumberFormat('id-ID').format(items.totalPrice)}
                                    action={() => {
                                        DeleteCart(items.idCart, setTotal, setTotalItem, totalPrice, totalItem, SetLoading2)
                                    }
                                    } />
                            ))}
                        </div>
                        <div className="ButtonToSeeCart" hidden={motionLeft ? false : true}>
                            <Button ContentButton="Check Your Cart" action={() => { location.href = "/cart" }}></Button>
                        </div>
                    </div>
                </div>
                <div ref={popup2} className="popup">
                    <OrderForm
                        active={Close}
                        product={GrabProduk}
                        listcart={listCart}
                        SetListCart={SetListCart}
                        setTotal={setTotal}
                        totalPrice={totalPrice}
                        item={totalItem}
                        setTotalItem={setTotalItem}
                        SetLoading2={SetLoading2}
                        popup2={popup2}
                        motionLeft={motionLeft}
                        setMotionLeft={setMotionLeft}
                        MotionMenuCart={MotionMenuCart}>
                    </OrderForm>
                </div>

            </> : <div>
                <h1>Memproses</h1>
                <img src="Images/Loading.gif" alt="" width="100" />
            </div>

        )
    }
}

/*
 
*/

export default ProductPages;