
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import Search from "../../Component/Search";
import HeaderMenu from "../../Component/HeaderMenu";
import OrderForm from "../../Component/popup/OrderForm";
import { MotionMenuCart, Close, SearchCard, GetData, getAcc } from "../manage";
import Statesss from "../States";
import { useSocket } from "../../SocketProvider";
import PopupNotification from "../../Component/popup/PopupNotifCation";
import Cart from "./Cart";
import ListProduct from "./ListProduct";
const ProductPages = () => {
    const socket = useSocket();

    const {
        totalItem, setTotalItem,
        listCart, SetListCart,
        totalPrice, setTotal, RightOn,
        GrabProduk } = Statesss();
    const [GenreData, setGenre] = useState([])
    const [Loading2, SetLoading2] = useState(true)

    //NavCartMotionState
    const [motionLeft, setMotionLeft] = useState(false);
    
    //popups
    const popup2 = useRef(null)

    // eslint-disable-next-line no-unused-vars
    let [account, setAccount] = useState(getAcc()) //GET ACCOUNT


    const Session_DataProduk = sessionStorage.getItem('ProductMaster');
    const [popupConfirm2, setpopupconfirm2] = useState(false)
    const [Loading, SetLoading] = useState(true);

    
    const Get_data = async () => {
        if (Session_DataProduk !== null && Array.isArray(JSON.parse(Session_DataProduk))) {
            setGenre(JSON.parse(Session_DataProduk))
            SetLoading(false)
            console.log(JSON.parse(Session_DataProduk))
        } else {
            const data = await GetData(account.acces_token);
            if (data) {
                console.log("data diambil dari API")
                setGenre(data);
                SetLoading(false)
                sessionStorage.setItem('ProductMaster', JSON.stringify(data))
                sessionStorage.removeItem('CartUser')
            }
        }
    }

    const [SumProcess, setSumProcess] = useState(0)
    const [notifMessage, setNotifMessage] = useState(false)
    const ConfirmBack = useRef();
    useEffect(() => {
        if (Loading2 && socket) {
            console.log("menjalankan")
            Get_data();
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
                        popupConfirm2={popupConfirm2}
                    />
                    <div>
                        <HeaderMenu
                            socket={socket}
                            selected={0}
                            To2={`/profil/${account.username}`}
                            To4="/"
                            To3="/SettingPages"
                            To5="/cart"
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
                        <Search type="text" placeholder="Search Produk" action={(e) => SearchCard(e, GenreData, setGenre)} />
                       <ListProduct motionLeft={motionLeft} Loading={Loading} GenreData={GenreData} popup2={popup2}/>
                    </div>
                    <Cart 
                    motionLeft={motionLeft} 
                    setMotionLeft={setMotionLeft}
                    setSumProcess={setSumProcess}
                    setNotifMessage={setNotifMessage}
                    socket={socket}
                    />
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
export default ProductPages;