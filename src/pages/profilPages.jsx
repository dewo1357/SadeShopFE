/* eslint-disable no-unused-vars */

import MyComponent from "./MyComponent"
import HeaderMenu from "../Component/HeaderMenu"

import Label from "../Component/Element/Label/Label"
import OrderForm from "../Component/popup/OrderForm"
import { useState, useRef, useEffect } from "react"
import CardProduct from "../Component/Card_Cart/CardLProduct"
import { useParams } from "react-router-dom"
import { useSocket } from "../SocketProvider";
import PopupNotification from "../Component/popup/PopupNotifCation"
import { Close, Refresh_Token, GetdataProdukUser, checkId } from "./manage";
import Statesss from "./States"
import { API_URL } from "../../config"

const ProfilPages = () => {

    const { turnOnAddProduct,
        turnOnAddProduct2, SetTurnOn2,
        totalItem, setTotalItem,
        GrabProduk, SetGrabProduk,
        listCart, SetListCart,
        totalPrice, setTotal,
    } = Statesss()

    const socket = useSocket();

    const popup2 = useRef(null);

    const { idUser } = useParams();
    const [GenreData, SetGenreData] = useState([])
    const [ProcessMap, setProcessMap] = useState(false);
    const [LoadingMap, setLoadingMap] = useState(false)
    const account = JSON.parse(localStorage.getItem('account'))


    const [dataAddress, setDataAaddress] = useState({
        state: '',
        city: '',
        road: '',
        postalCode: '',
    })

    const [address, seAddress] = useState({
        latitude: null, longitude: null, address: {
            state: null,
            city: null,
            road: null
        }
    });
    const [getMyAccount, setMyAccount] = useState([])

    const changeProvince = (e, SessionUpdate) => {
        if (SessionUpdate === 'state') {
            const state = e
            setDataAaddress({ ...dataAddress, state })
        } else if (SessionUpdate === 'city') {
            const city = e
            setDataAaddress({ ...dataAddress, city })
        } else if (SessionUpdate === 'road') {
            const road = e
            setDataAaddress({ ...dataAddress, road })
        } else {
            const postalCode = e
            setDataAaddress({ ...dataAddress, postalCode })
        }
    }

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
    const IsVerified = async () => {
        try {
            const response = await fetch(API_URL + "CheckAccount", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${account.acces_token}`
                }
            })
            if (!response) {
                throw new Error("Failed")
            }
            const result = await response.json();
            if (result.statusCode === 401) {
                await Refresh_Token(socket)
                location.href = `/profil/${getMyAccount.username}`
            }

            console.log(result)
            if (!result.verified) {
                verify.current.style.visibility = "visible"
            } else {
                setVerified(true)
            }
            setNotifMessage(result.notifMessage ? true : false)
            setChecked(false)

        } catch (e) {
            return
        }
    }
    const [delay, setDelay] = useState(true);
    const [addData, setAddData] = useState(true)
    const [isAccess, setAccess] = useState(false)
    useEffect(() => {
        try {
            setTimeout(async () => {
                const get_Account = await checkId(idUser)
                console.log("masuk akun")
                setMyAccount(get_Account.account)
                SetGenreData(get_Account.product);
                if (get_Account) {
                    if (get_Account.access) {
                        IsVerified();
                        setAccess(true);
                    }
                }
            }, 1000)

            if (LoadingMap) {
                setLoadingMap(false)
                setDataAaddress({
                    state: address.address.state,
                    city: address.address.city,
                    road: address.address.road,
                    postalCode: address.address.postcode
                })
            }
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
    }, [isAccess, addData, LoadingMap])



    setTimeout(() => {
        setDelay(false)
    }, 100);

    const ActionGrabProduk = (data) => {
        Close(true, popup2)
        SetGrabProduk(data);
    }

    const Build = useRef();
    const TurnOnForm = () => {
        /*
        if (window.innerWidth > 768) {
            Build.current.style.visibility = !turnOnAddProduct ? 'visible' : 'hidden';
            setTurnAdd(TurnAdd ? false : true)
            setTimeout(() => {
                SetTurnOn(turnOnAddProduct ? false : true)
            }, 100)
            location.href = "#"
        } else {
            
        }
        */
        location.href = `/SetProduct/?AddData=${true}`

    }






    const [turnEdit, setTurnEdit] = useState(false)
    const [TurnAdd, setTurnAdd] = useState(false)
    const TurnOnFormEdit = (id, Title, Kind, Prices, Stok_brg, script, gambar, bobot) => {
        const ProductToEdit = {
            id: id,
            Name: Title,
            Price: Prices,
            Kind: Kind,
            Stok: Stok_brg,
            Content: script,
            image: gambar,
            bobot: bobot
        }
        sessionStorage.setItem('ProductEdit', JSON.stringify(ProductToEdit))
        location.href = "/SetProduct"


    }
    const CloseFormEdit = () => {
        console.log(turnOnAddProduct2)
        Build.current.style.visibility = 'hidden';
        console.log("keluar")
        setTurnEdit(false)
        setTurnAdd(false)
        setTimeout(() => {
            SetTurnOn2(turnOnAddProduct2 ? false : true)
        }, 100)
    }

    const [processLoading, SetProcessLoading] = useState(false)
    const [FinnalMessage, setFinnalMessage] = useState(false)
    const [FinnalMessage2, setFinnalMessage2] = useState(false)
    const [Pesan, setPesan] = useState(null)
    const [done, setDone] = useState(false)
    const overlayVerify = useRef();
    const popupVerify = useRef();
    const verify = useRef();
    const VerifyAccount = async (e) => {
        e.preventDefault();
        SetProcessLoading(true)
        setPesan("Verifikasi Account Kamu Sedang Di Proses")
        const acc = JSON.stringify({
            id: getMyAccount.id,
            email: getMyAccount.email,
            state: dataAddress.state,
            city: dataAddress.city,
            road: dataAddress.road,
            postalCode: dataAddress.postalCode,
            pass: e.target.pass.value
        })
        try {
            const response = await fetch(API_URL + "VerifyAccount", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${account.acces_token}`
                },
                body: acc
            })
            popupVerify.current.style.visibility = 'hidden'
            setDone(false)
            if (!response) {
                throw new Error("Failed")
            }
            const result = await response.json();
            if (result.statusCode === 401) {
                await Refresh_Token(socket)
                getMyAccount ?
                    location.href = `/profil/${getMyAccount.username}` :
                    location.href = "/"
            }
            setFinnalMessage(result.message)
        } catch (e) {
            return
        }
    }

    const ProcessVerify = () => {
        setDone(true)
    }

    const FinallyDialog = () => {
        SetProcessLoading(false)
        setFinnalMessage(false)
    }

    const [ProcessChangeProfile, SetProcessChangeProfile] = useState(false)
    const UploadImageToAPI = async (e, file) => {
        setPesan("Foto Kamu Sedang Di Proses")
        SetProcessLoading(true)
        SetProcessChangeProfile(true)
        e.preventDefault();
        const files = new FormData()
        files.append('files', file);
        try {
            const response = await fetch(API_URL + "ChangeImageProfile", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${account.acces_token}`,
                },
                body: files,
            })
            location.href = `/profil/${getMyAccount.username}`
            if (!response) {
                throw new Error(response.messages)
            }
            const result = await response.json();
            if (result.statusCode == 401) {
                await Refresh_Token(socket)
                location.href = `/profil/${getMyAccount.username}`
            }
        } catch (error) {
            return
        }
    }

    const [tempProfileImage, setTempProfileImage] = useState(null)
    const [FileImage, setFileImage] = useState(null)
    const FormChangeProfile = useRef();
    const ProfileImageHandle = (e) => {
        let file = e.target.files[0];
        if (!file) {
            throw new Error("Tipe Dokumen Tidak Sesuai");
        } else {
            const alloType = ['image/jpg', 'image/png', 'image/jpeg'];
            if (alloType.includes(file.type)) {
                //Validasi. Akan Di Proses apabila kurang dari 5 MB.
                if (file.size < 5000000) {
                    const date = new Date().getTime().toString()
                    const terbaru = new File([file], `${date}`, {
                        type: file.type
                    })
                    setTempProfileImage(URL.createObjectURL(terbaru))
                    setFileImage(terbaru)
                }
            }
        }
    }

    const handleBackground = (e) => {
        if (e.target.id === "OverChange") {
            FormChangeProfile.current.style.visibility = "hidden"
        }
    }

    const StartToChat = () => {
        location.href = `/message/${getMyAccount.username}`
    }

    const [popupConfirm, setpopupconfirm] = useState(false)
    const [popupConfirm2, setpopupconfirm2] = useState(false)
    const [message, setMessage] = useState(null)
    const [SumProcess, setSumProcess] = useState(0)

    return (
        getMyAccount && GenreData ? <div className="ProfilPagesLayout" hidden={delay ? true : false}>
            <PopupNotification
                socket={socket}
                popupConfirm={popupConfirm}
                popupConfirm2={popupConfirm2}
                setMessage={setMessage}
            />
            <div className="TitleMenu">
                <h1>SadeShop.com</h1>
                <HeaderMenu
                    selected={isAccess ? 1 : ""}
                    To2={`/profil/${account.username}`}
                    To1="/products" To4="/" To3="/SettingPages"
                    SumProcess={SumProcess}
                    notifMessage={notifMessage}
                    socket={socket}
                    isAccess={isAccess}
                >
                </HeaderMenu>

            </div>
            <div className="DetailLayoutProfil">
                <div className="gambarProfil">
                    <div className="ContainerPictProfile images" style={{
                            backgroundImage: `url(https://qcgtgzcrwkdtkzzgkclh.supabase.co/storage/v1/object/public/ProfilePicture/${getMyAccount ? getMyAccount.image : ""})`,
                            backgroundPosition  : "center",
                            borderRadius : "360px"
                        }}>
                        <div className={!isAccess ? "" : "LabelOverLay"} >
                            <div>
                                <label onClick={() => { FormChangeProfile.current.style.visibility = "visible" }}><img src="/Images/settings-svgrepo-com.svg" alt="" hidden={!isAccess ? true : false} /></label>
                            </div>
                        </div>
                    </div>
                </div>
                <div onClick={handleBackground} ref={FormChangeProfile} id="OverChange" className="overlay3">
                    <div className="FormChangeProfile">
                        <h2 style={{ margin: "0px", marginBottom: "20px", textAlign: "center" }}>Change Profile Picture</h2>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                            <img src={tempProfileImage ? tempProfileImage : `https://qcgtgzcrwkdtkzzgkclh.supabase.co/storage/v1/object/public/ProfilePicture/${getMyAccount ? getMyAccount.image : ""}`} alt="" />
                        </div>
                        <form style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }} action="" onSubmit={tempProfileImage ? (e) => { UploadImageToAPI(e, FileImage) } : () => { }}>
                            <div>
                                <input onChange={ProfileImageHandle} type="file" id="file" hidden={!isAccess ? true : false} />
                            </div>
                            <div>
                                <button>Change My Pict</button>
                            </div>
                        </form>
                    </div>

                </div>
                <div className={`BioData`} >
                    <div>
                        <div ref={verify} className="buttonVerify">
                            <button onClick={() => { popupVerify.current.style.visibility = 'visible' }} hidden={!isAccess ? true : false}   >Verify Your Account</button>
                        </div>
                        <div>
                            <h1>{getMyAccount.nama} </h1>
                        </div>

                        <div>
                            <p>{getMyAccount.username} | {getMyAccount.Bio} </p>
                        </div>
                        <div hidden={getMyAccount.nama ? false : true} >
                            <button onClick={StartToChat} hidden={isAccess ? true : false}>Mulai Obrolan</button>
                        </div>
                    </div>

                </div>
            </div>

            <div ref={popupVerify} className="overlay3">
                <div className={`OverlayMap ${ProcessMap ? "OverlayMapOn" : ""}`} hidden>
                    <div className="Map">
                        <MyComponent instalUlang={null} setProcessMap={setProcessMap} seAddress={seAddress} setLoadingMap={setLoadingMap} />
                    </div>
                </div>
                <form onSubmit={VerifyAccount} action="">
                    <div className="InsertPass" hidden={!done ? true : false}>
                        <h1>Masukan Password</h1>
                        <input name="pass" type="password" />
                        <button >Verify My Account</button>
                    </div>
                    <div ref={overlayVerify} className="FormVerify" hidden={!done ? false : true} >
                        <div className="headerVerifyTitleandButton">
                            <h1>Verfication Form</h1>
                            <span onClick={() => { popupVerify.current.style.visibility = 'hidden' }}>✖</span>
                        </div>

                        <div>
                            <div>
                                <h3>Link Verifikasi Akan dikirim ke <span style={{ backgroundColor: "black", color: "white", padding: "5px" }}>{getMyAccount.email}</span></h3>
                            </div>
                            <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                                <span className="buttonMap" onClick={() => { setProcessMap(true) }} >Check My Location</span>
                            </div>

                            <div >
                                <Label Content="Kota" />
                                <input type="text" name="city" value={dataAddress.city} onChange={(e) => changeProvince(e.target.value, "city")} />
                            </div>
                            <div>
                                <Label Content="Provinsi"></Label>
                                <input type="text" name='province' value={dataAddress.state} onChange={(e) => changeProvince(e.target.value, "state")} />
                            </div>
                        </div>

                        <div>
                            <div>
                                <Label Content="Jalan"></Label>
                                <input type="text" name="road" value={dataAddress.road} onChange={(e) => changeProvince(e.target.value, "road")} />
                            </div>
                            <div>
                                <Label Content="Kode Pos"></Label>
                                <input type="text" name="kodepos" value={dataAddress.postalCode} onChange={(e) => changeProvince(e.target.value, "postcode")} />
                            </div>
                        </div>
                        <div className=" headerVerifyTitleandButton processVerify">
                            <span onClick={ProcessVerify}>Verify My Account</span>
                        </div>
                    </div>
                </form>
                <div className={`loading ${processLoading ? "loadingOn" : ""}`}>
                    <div className="OverlayLoading" hidden={ProcessChangeProfile ? false : true}>
                        {FinnalMessage ? <h2>{FinnalMessage}</h2> : <h2>Mohon Ditunggu<br></br> {Pesan}</h2>}
                        {!FinnalMessage ? <img src="/Images/Loading.gif" alt="" /> : <button onClick={FinallyDialog} >Oke</button>}
                    </div>
                    <div className="OverlayLoading" hidden={FinnalMessage2 ? false : true}>
                        <h2>Mohon Ditunggu<br></br> Pesanan Kamu Sedang Di Proses</h2>
                        <img src="/Images/Loading.gif" alt="" />
                    </div>
                </div>
            </div>

            <div className={`afterProfil ${!isAccess ? "centerProfil" : ""}`} hidden={!isAccess || !verified ? true : false}>
                <h1>PRODUCTS</h1>
                <div className="AddProductButton" hidden={!isAccess || !verified ? true : false} >
                    <button onClick={TurnOnForm}  >➕</button>
                </div>
            </div>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
                {GenreData.map((item) => (
                    <CardProduct key={item.id}>
                        <CardProduct.images source={"https://qcgtgzcrwkdtkzzgkclh.supabase.co/storage/v1/object/public/gambarProducts/" + item.URLimages} />
                        <CardProduct.HeaderContent title={item.title} seller={getMyAccount.nama} dataProduct={item} >
                            <p>
                                {item.content}
                            </p>

                        </CardProduct.HeaderContent>
                        <CardProduct.Footer price={new Intl.NumberFormat('id-ID').format(item.price[0])}
                            action={!isAccess ? () => ActionGrabProduk(item) : () => {
                                TurnOnFormEdit(
                                    item.id,
                                    item.title,
                                    item.kind,
                                    item.price,
                                    item.stok,
                                    item.content,
                                    item.URLimages,
                                    item.weight
                                )
                            }}
                            Content={!isAccess ? "ORDER" : "Setting"} />
                    </CardProduct>
                ))}
            </div>
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




            <div ref={Build} className="overlay3" >
                <div hidden={TurnAdd ? false : true} className={`FormProduk ${turnOnAddProduct ? "BuildFormProduk" : ""}`}>
                    <h1>Add Product</h1>

                    <div className="CloseForm" ><button onClick={TurnOnForm}>✖</button></div>
                </div>
                <div hidden={turnEdit ? false : true} className={`FormProduk Formkedua ${turnOnAddProduct2 ? "BuildFormProduk    " : ""}`} >
                    <h1>Edit Product</h1>
                    <div className="CloseForm" >
                        <button onClick={CloseFormEdit}>✖</button>
                    </div>
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

