/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Button from "./Element/Button/Button"
import { Refresh_Token } from "../pages/manage";
import { API_URL } from "../../config";


const HeaderMenu = (props) => {
    const { selected, To1, To2, To3, To4, motionLeft, MotionMenuCart,
        setMotionLeft, ConfirmBack, setpopupconfirm2, SumProcess, socket, notifMessage } = props;
    const [BuildUpdate, setBuildUpdate] = useState(false);


    const [nMessage, setNmessage] = useState(false)
    const [ProcessToLogout, SetProcessToLogout] = useState(false)



    useEffect(() => {
        if (socket) {
            socket.on("ReloadMessage", async () => {
                console.log("masuk")
                setNmessage(true)
            })
        }

    }, [socket])

    const IsVerified = async () => {
        const account = JSON.parse(localStorage.getItem("account"))
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
                await Refresh_Token("YourProductOrder")
            }
            console.log(result)
            if (!result.verified) {
                ConfirmBack.current.style.visibility = "visible"
                setpopupconfirm2(true)
            } else {
                location.href = "/YourProductOrder"
            }


        } catch (e) {
            console.log(e.message)
        }
    }

    const SureForLogout = async () => {
        setTimeout(() => {
            const account = JSON.parse(localStorage.getItem('account'))
            let username = account.username
            socket.emit('Reset', username)
            localStorage.removeItem('account');
            location.href = "/"
        }, 1000)
    }

    const CancelToLogout = () => {
        SetProcessToLogout(false)
    }

    const route = async (number, tujuan) => {
        if (number === 4) {
            return SetProcessToLogout(true)
        }
        location.href = tujuan
    }

    const toPageProductOrder = async () => {
        await IsVerified()
    }

    const toMessage = () => {
        setNmessage(false)
        location.href = "/message"
    }

    const HandleToClose = (e) => {
        if (e.target.id === "PopupToLogout") {
            SetProcessToLogout(false)
        }
    }

    return (
        <>
            <div className="HeaderMenu">
                <div className={`updateButton ${(selected === -1) ? "se" : ""}`} >
                    <Button action={() => { setBuildUpdate(BuildUpdate ? false : true) }} ContentButton={nMessage || notifMessage ? `Update 🔴` : `Update`}></Button>
                </div>
                <div className={`updateOptions ${BuildUpdate ? "BuildUpdateOption" : ""} ${motionLeft ? "motionOptions" : ""}`}>
                    <Button ContentButton={`Order Process`} action={() => { location.href = "/InformationOrder" }}></Button>
                    <Button ContentButton={`Product Order (${SumProcess ? SumProcess : JSON.parse(sessionStorage.getItem('SumProcess'))})`} action={toPageProductOrder}></Button>
                    <Button ContentButton={nMessage || notifMessage ? `Messages 🔴` : `Messages`} action={toMessage}></Button>
                </div>
                <div className={(selected === 0) ? "se" : ""} >
                    <Button action={() => { route(0, (To1) ? To1 : "") }} ContentButton="Shop"></Button>
                </div>
                <div className={(selected === 1) ? "se" : ""}>
                    <Button action={() => { route(1, (To2) ? To2 : "") }} ContentButton="Profile"></Button>
                </div>
                <div className={(selected === 2) ? "se" : ""}>
                    <Button action={() => { route(2, (To3) ? To3 : "") }} ContentButton="About"></Button>
                </div>
                <div className={(selected === 3) ? "se" : ""}>
                    <Button action={() => { route(3, (To3) ? To3 : "") }} ContentButton="Setting">   </Button>
                </div>
                <div style={{display:"flex",justifyContent:motionLeft?"space-around":"center",gap:motionLeft?"50px":"190px"}} hidden={motionLeft?false:true}>
                    <div className={(selected === 4) ? "se" : ""}>
                        <Button action={() => { route(4, (To4) ? To4 : "") }} ContentButton="Logout">   </Button>
                    </div>
                    <div className={`ButtonOpenCart ${motionLeft ? "OpenMotion" : ""}`}>
                        <button hidden={(selected === 1 ? true : false)} onClick={() => { MotionMenuCart(motionLeft, setMotionLeft) }}> <img src={"./Images/icons8-cart-64.png"} alt="" /> </button>
                    </div>
                </div>
            </div>


            <div onClick={HandleToClose} id="PopupToLogout" className={`loading ${ProcessToLogout ? "loadingOn" : ""}`}>
                <div className={`ConfirmBackToCart Logout ${ProcessToLogout ? "ConfirmBackToCartOn" : ""}`} hidden={ProcessToLogout ? false : true}>
                    <p>
                        Apakah Anda Ingin Melanjutkan Proses Logout?
                    </p>
                    <div className="ConfirmBackToCartAction">
                        <button style={{ backgroundColor: "red" }} onClick={CancelToLogout}>No</button>
                        <button onClick={SureForLogout}>Yes</button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default HeaderMenu;