


import HeaderMenu from "../../Component/HeaderMenu"
import OrderForm from "../../Component/popup/OrderForm"
import { useState, useRef, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useSocket } from "../../SocketProvider";
import PopupNotification from "../../Component/popup/PopupNotifCation"
import { Close, GetdataProdukUser, checkId, getAcc } from "../manage";
import Statesss from "../States"
import ProfilPagesLayout from "./ProfileLayout"
import VerifyForm from "./VerifyForm"
import ProductSeller from "./ProductSeller"

const ProfilPages = () => {

    const {
        totalItem, setTotalItem,
        GrabProduk,
        listCart, SetListCart,
        totalPrice, setTotal,
    } = Statesss()

    const socket = useSocket();

    const popup2 = useRef(null);

    const { idUser } = useParams();
    const [GenreData, SetGenreData] = useState([])

    // eslint-disable-next-line no-unused-vars
    const [account, setAccount] = useState(getAcc())



    const [getMyAccount, setMyAccount] = useState([])



    const getData = async () => {
        const result = await GetdataProdukUser(account.acces_token);
        if (result.data) {
            SetGenreData(result.data);
        }
        sessionStorage.setItem('sessionProfilProduk', JSON.stringify(result.data))
    }

    const [verified, setVerified] = useState(false)
    const [checked, setChecked] = useState(true)
    const [notifMessage, setNotifMessage] = useState(false)

    const [delay, setDelay] = useState(true);
    const [addData, setAddData] = useState(true)
    const [isAccess, setAccess] = useState(false)



    useEffect(() => {
        try {
            setTimeout(async () => {
                const get_Account = await checkId(idUser, socket)
                console.log("masuk akun")
                setMyAccount(get_Account.account)
                SetGenreData(get_Account.product);
                if (get_Account) {
                    if (get_Account.access) {

                        setAccess(true);
                    }
                } else {
                    location.href = "/products"
                }
            }, 1000)


            if (!addData) {
                getData();
                setAddData(true)
            }

            if (isAccess && checked) {
                setChecked(false)
            }

        } catch (err) {
            console.log(err.message)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAccess, addData])

    setTimeout(() => {
        setDelay(false)
    }, 100);

    const TurnOnForm = () => {
        location.href = `/SetProduct/?AddData=${true}`
    }

    const [processLoading, SetProcessLoading] = useState(false)
    const [FinnalMessage, setFinnalMessage] = useState(false)
    const [FinnalMessage2, setFinnalMessage2] = useState(false)
    const [Pesan, setPesan] = useState(null)
    const popupVerify = useRef();

    const [SumProcess, setSumProcess] = useState(0)

    return (
        getMyAccount && GenreData ? <div className="ProfilPagesLayout" hidden={delay ? true : false}>
            <PopupNotification />
            <HeaderMenu
                selected={isAccess ? 1 : ""}
                To2={`/profil/${account.username}`}
                To1="/products"
                To4="/"
                To3="/SettingPages"
                To5="/cart"
                SumProcess={SumProcess}
                notifMessage={notifMessage}
                socket={socket}
                isAccess={isAccess}
                GenreData={GenreData}
            />
            <ProfilPagesLayout
                setFinnalMessage2={setFinnalMessage2}
                getMyAccount={getMyAccount}
                isAccess={isAccess}
                setNotifMessage={setNotifMessage}
                account={account}
                setVerified={setVerified}
                setSumProcess={setSumProcess}
                setChecked={setChecked}
                popupVerify={popupVerify}
                setPesan={setPesan}
                SetProcessLoading={SetProcessLoading}
            />
            <VerifyForm
                socket={socket}
                getMyAccount={getMyAccount}
                account={account}
                setPesan={setPesan}
                SetProcessLoading={SetProcessLoading}
                popupVerify={popupVerify}
                setFinnalMessage={setFinnalMessage}
                processLoading={processLoading}
                FinnalMessage={FinnalMessage}
                FinnalMessage2={FinnalMessage2}
                Pesan={Pesan}
            />
            <div className={`afterProfil ${!isAccess ? "centerProfil" : ""}`} hidden={!isAccess || !verified ? true : false}>
                <h1 hidden={!verified ? true : false}>PRODUCTS</h1>
                <div className="AddProductButton" hidden={!isAccess || !verified ? true : false} >
                    <button onClick={TurnOnForm}  >➕</button>
                </div>
            </div>
            <ProductSeller
                GenreData={GenreData}
                getMyAccount={getMyAccount}
                isAccess={isAccess}
                popup2={popup2}
            />
            <div className="ProductPages" >
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
                        popup2={popup2}
                    >
                    </OrderForm>
                </div>
            </div>
        </div> :
            <center>
                <div>
                    <h1 style={{ fontFamily: "monospace" }}>Memproses..</h1>
                    <img src="/Images/Loading.gif" width="100" alt="" />
                </div>
            </center>
    )
}

export default ProfilPages;

