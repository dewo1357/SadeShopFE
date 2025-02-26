
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
        GrabProduk, SetGrabProduk } = Statesss();
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
            const data = await GetData();
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
        }
    }, [Loading2, socket]);


    return (
        GenreData !== null || listCart !== null ?
            <>
                <div className="OverallProductsPages" style={{gap:motionLeft?"10px":"5px",display:!account ||innerWidth < 900?"block":false}}>
                    <div>
                        <PopupNotification
                            popupConfirm2={popupConfirm2}
                        />
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
                            listCart={listCart}
                            GenreData={GenreData}
                            SearchCard={SearchCard}
                            setGenre={setGenre}
                        >
                        </HeaderMenu>

                        {!account ?
                            <div>
                                <div className="HomeProduct">
                                    <div>
                                        <h1 >
                                            Penuhi Segala Kebutuhan Kamu
                                        </h1>
                                    </div>
                                    <div className="HomePictProduct">
                                        <div className="HomePictProductComponent">
                                            <img style={{ width: "100%", objectFit: "cover" }} src="/Images/simply-mersah-MLV5zTSzj98-unsplash (1).jpg" alt="" />
                                            <img style={{ width: "100%", objectFit: "cover" }} src="/Images/micheile-henderson-NuYB_I4wXFM-unsplash (1).jpg" alt="" />
                                            <img style={{ width: "100%", objectFit: "cover" }} src="/Images/dwayne-joe-9wubaeSG13U-unsplash (1).jpg" alt="" />
                                        </div>
                                        <div className="HomePictProductComponent kedua">
                                            <img style={{ width: "100%", objectFit: "cover" }} src="/Images/katsiaryna-endruszkiewicz-BteCp6aq4GI-unsplash (2).jpg" alt="" />
                                            <img style={{ width: "100%", objectFit: "cover" }} src="/Images/jeff-trierweiler-yrINjq6HInM-unsplash (1).jpg" alt="" />
                                            <img style={{ width: "100%", objectFit: "cover" }} src="/Images/laika-notebooks-RDYGxXuRyx4-unsplash (1).jpg" alt="" />
                                        </div>
                                    </div>

                                </div>
                                <div>
                                    <h1 style={{ fontSize: "30px" }}>Product</h1>
                                </div>
                            </div>
                            : false}
                        <div >
                            <Search type="text" placeholder="Search Produk" action={(e) => SearchCard(e, GenreData, setGenre)} />
                        </div>
                        <ListProduct motionLeft={motionLeft} Loading={Loading} GenreData={GenreData} popup2={popup2} SetGrabProduk={SetGrabProduk} account={account} />
                    </div>
                    <Cart
                        motionLeft={motionLeft}
                        setMotionLeft={setMotionLeft}
                        setSumProcess={setSumProcess}
                        setNotifMessage={setNotifMessage}
                        socket={socket}
                        Loading2={Loading2}
                        SetLoading2={SetLoading2}
                        account={account}
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

            </> : <div style={{ width: "100%" }} >
                <h1>Memproses</h1>
                <img src="Images/Loading.gif" alt="" width="100" />
            </div>

    )
}
export default ProductPages;