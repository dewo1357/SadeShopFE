/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

/* eslint-disable react/prop-types */

import { useState, useEffect, useRef } from "react";
import { ActionToDeleteCheckoutCart, getAcc } from "../../pages/manage";
import Button from "../Element/Button/Button";
import { API_URL } from "../../../config";
import { useSocket } from "../../SocketProvider";
import { useNavigate, useLocation } from "react-router-dom";

const PopupNotification = (props) => {
    const location = useLocation();
    const { popupConfirm2 } = props
    const navigate = useNavigate()

    const ConfirmBack = useRef();
    const socket = useSocket()

    const [Acces, setAcces] = useState(false)
    const [notificationSeller, setnotificationSeller] = useState(false)
    const [popupConfirm, setpopupconfirm] = useState(false)
    const [message, setMessage] = useState(null)

    const sendInformationAccount = () => {
        socket.emit('Send', {
            data: getAcc(),
        })
        setnotificationSeller(false)
        ConfirmBack.current.style.visibility = 'hidden'
        setAcces(false)
    }


    const [PassOn, setPassOn] = useState(false)
    const [Loading, setLoading] = useState(false)
    const [Notif, notifMessage] = useState(null)
    const [finish, SetFinish] = useState(false)
    const [account, setAccount] = useState(getAcc())
    const [NoMatchPass,SetNoMatchPass] = useState(false)



    useEffect(() => {
        try {
            if (account.new_user === 'true') {
                ConfirmBack.current.style.visibility = "visible";
                setPassOn(true)
            }
        } catch (err) {
            if (account === 'undefined') {
                navigate("/")
            }

        }

    }, [account])

    const [CheckoutData, setCheckoutData] = useState(JSON.parse(localStorage.getItem('CheckoutData')) ? true : false)
    useEffect(() => {
        if (CheckoutData && location.pathname !== "/checkout") {
            ConfirmBack.current.style.visibility = "visible";
            setTimeout(() => {
                setpopupconfirm(true)
            })
        }
    }, [CheckoutData])

    useEffect(() => {
        if (account !== false) {

            if (socket) {
                try {
                    if (account.UserOnServer) {
                        socket.emit("Register", {
                            username: account.username,
                            id: account.id
                        })
                        if (account.isRegist !== true) {
                            const data = { ...account, isRegist: true }
                            localStorage.setItem('account', JSON.stringify(data))
                        }
                    } else {
                        socket.emit('SendId', account.username)
                    }
                } catch (err) {
                    console.log(err.message)
                }


                socket.on("AskAcces", (message) => {
                    setAcces(true)
                    if (ConfirmBack.current) {
                        ConfirmBack.current.style.visibility = "visible"
                    }
                })

                //socket jika akses diterima
                socket.on("Receive", (data) => {
                    setTimeout(() => {
                        localStorage.setItem('account', JSON.stringify(data))//mempebarui informasi account 
                        //mendaftarkan ke server
                        socket.emit("Register", {
                            username: data.username,
                            id: data.id
                        })
                    }, 1000)

                })

                //socket jika ditolak akses
                socket.on('ActTolakAkses', (message) => {
                    setTimeout(() => {
                        localStorage.clear()
                        navigate("/")
                    }, 1000)
                })

                socket.on('Notification', (Message) => {
                    setMessage(Message)
                    setnotificationSeller(true)
                    console.log("masuk")
                    if (ConfirmBack.current) {
                        ConfirmBack.current.style.visibility = "visible"
                    }
                })


                console.log(socket)
            }
        }
    }, [socket, account])


    const ActionToChekout = () => {
        if (ConfirmBack.current) {
            ConfirmBack.current.style.visibility = "hidden"
        }
        navigate("/checkout")
    }

    const Abaikan = () => {
        if (ConfirmBack.current) {
            ConfirmBack.current.style.visibility = "hidden"
        }
        setnotificationSeller(false)
    }

    const close = () => {
        if (ConfirmBack.current) {
            ConfirmBack.current.style.visibility = "hidden"
        }
        socket.emit('TolakAkses', account.username)
        setAcces(false)
    }

    const SetPass = async (event) => {
        event.preventDefault();
        const newPassword = event.target.Pass1.value
        const newPassword2 = event.target.Pass2.value
        if (newPassword === newPassword2) {
            setPassOn(false)
            setLoading(true)
            notifMessage("Mohon Tunggu..")
            try {
                const response = await fetch(API_URL + "ChangePassForNewUser", {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${account.acces_token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        newPassword: event.target.Pass1.value,
                        newPassword2: event.target.Pass2.value
                    })
                })
                if (!response) {
                    throw new Error("Failed")
                }
                if (response.status === 200) {
                    const result = await response.json()
                    let dataAccount = account
                    socket.emit("Register", {
                        username: account.username,
                        id: account.id
                    })
                    dataAccount = { ...account, isRegist: true, new_user: false }
                    localStorage.setItem('account', JSON.stringify(dataAccount))
                    notifMessage(result.Message)
                    SetFinish(true)
                }
            } catch (err) {
                console.log(err.message)
            }
        }else{
            SetNoMatchPass(true)
        }
    }


    const Close = () => {
        ConfirmBack.current.style.visibility = 'hidden'
        setLoading(false)
        SetFinish(false)
        notifMessage(null)
    }


    const Telusuri = () => {
        console.log("Okee")
        navigate("/YourProductOrder")
    }

    if (!account) {
        return (
            <></>
        )
    } else {
        return (
            <div>
                <div ref={ConfirmBack} style={{ visibility: "hidden" }} className="overlay3">
                    <div className={`SellerNotification SetPass ${PassOn ? "SetPassOn" : ""}`} hidden={PassOn ? false : true}>
                        <form action="" onSubmit={SetPass}>
                            <div>
                                <h1>Daftarkan Kata Sandi Anda</h1>
                                <p style={{color : "red",fontSize:"10px"}} hidden={NoMatchPass?false:true}>Kata Sandi Tidak Sama!</p>
                                <div className="ComponentSetPass">
                                    <input name="Pass1" type="password" placeholder="Enter Your Password" />
                                </div>

                                <div className="ComponentSetPass">
                                    <input name="Pass2" type="password" placeholder="Enter Confirm Password" />
                                </div>
                                <div className="ComponentSetPass">
                                    <Button ContentButton="Simpan"></Button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className={`loading ${Loading ? "loadingOn" : ""}`}>
                        <div className="OverlayLoading">
                            <h2>{Notif}</h2>
                            <div>
                                {
                                    !finish ?
                                        <img src="/Images/Loading.gif" alt="" />
                                        : <Button styling="btn" action={Close} ContentButton={"Oke"}></Button>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={`SellerNotification Account ${Acces ? "AccountOn" : ""}`} hidden={Acces ? false : true}>
                        <h1>Seseorang Sedang Mencoba Akses Account Kamu!</h1>
                        <img src="/Images/7100664.jpg" alt="" width="200" />
                        <h3>Apakah Itu Kamu?</h3>

                        <div className="ConfirmBackToCartAction">

                            <Button styling="btn" action={close} ContentButton={"Tolak"}></Button>
                            <Button styling="btn" action={sendInformationAccount} ContentButton={"Iya, Itu Adalah Saya"}></Button>

                        </div>
                    </div>
                    <div className={`SellerNotification ${notificationSeller ? "SellerNotificationOn" : ""}`} hidden={notificationSeller ? false : true}>
                        <h1>Pesanan Product Kamu Telah Tiba!</h1>
                        <img src="/Images/7100664.jpg" alt="" width="200" />
                        <h3>Pergi menuju keranjang pesanan untuk melanjutkan pesanan Customer</h3>

                        <div className="ConfirmBackToCartAction">
                            <Button styling="btn" action={Abaikan} ContentButton={"Abaikan"}></Button>
                            <Button styling="btn" action={Telusuri} ContentButton={"Telusuri"}></Button>
                        </div>
                    </div>
                    <div className={`ConfirmBackToCart ${popupConfirm ? "ConfirmBackToCartOn" : ""}`} hidden={popupConfirm ? false : true}>
                        <h2  >PERINGATAN</h2>
                        <h2>
                            Terdapat Process Checkout
                        </h2>
                        <p>
                            Apakah Anda Ingin Melanjutkan Proses Checkout?. <br /> Jika Tidak, Maka Data Checkout Sebelumnya Akan Dihapus Secara Permanen.
                        </p>
                        <div className="ConfirmBackToCartAction">
                            <Button styling="btn Cancel" action={() => { ActionToDeleteCheckoutCart("") }} ContentButton={"Delete"}></Button>
                            <Button styling="btn" action={ActionToChekout} ContentButton={"Lanjutkan Process"}></Button>
                        </div>
                    </div>
                    <div className={`ConfirmBackToCart ${popupConfirm2 ? "ConfirmBackToCartOn" : ""}`} hidden={popupConfirm2 ? false : true}>
                        <h2>Maaf, Anda Belum Melakukan Verifikasi</h2>
                        <p>
                            Apakah Anda Ingin Melanjutkan Proses Verifikasi?. <br /> Jika Iya, Maka Telusuri Halaman Profile. Tepat Diatas Teks Nama Profile Anda. <br /> Terima Kasih.
                        </p>
                        <div className="VerificationConfirm">
                            <Button styling="btn" action={() => { ConfirmBack.current.style.visibility = "hidden"; }} ContentButton={"Oke"}></Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default PopupNotification;
