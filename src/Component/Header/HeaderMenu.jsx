/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Element/Button/Button"
import { getAcc, Refresh_Token } from "../../pages/manage";
import { API_URL } from "../../../config";


const HeaderMenu = (props) => {
    const { selected, To1, To2, To3, To4, To5, motionLeft, MotionMenuCart,
        setMotionLeft, ConfirmBack, setpopupconfirm2, SumProcess, socket, notifMessage, GenreData,StartToSearch } = props;
    const [BuildUpdate, setBuildUpdate] = useState(false);

    const [nMessage, setNmessage] = useState(false)
    const [ProcessToLogout, SetProcessToLogout] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const [account, setAccount] = useState(getAcc())



    useEffect(() => {
        if (socket && account !== false) {
            socket.on("ReloadMessage", async () => {
                console.log("masuk")
                setNmessage(true)
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket])

    const IsVerified = async () => {
        const account = getAcc()
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

            if (!result.verified) {
                ConfirmBack.current.style.visibility = "visible"
                setpopupconfirm2(true)
            } else {
                location.href="/YourProductOrder"
            }


        } catch (e) {
            console.log(e.message)
        }
    }

    const SureForLogout = async () => {
        setTimeout(() => {

            let username = account.username
            socket.emit('Reset', username)
            localStorage.removeItem('account');
            location.href="/"
        }, 1000)
    }

    const CancelToLogout = () => {
        SetProcessToLogout(false)
    }

    const route = async (number, tujuan) => {
        if (account !== false) {
            if (number === 4) {
                return SetProcessToLogout(true)
            }
            return location.href =tujuan
        }
        localStorage.clear()
        return location.href="/"
    }

    const toPageProductOrder = async () => {
        await IsVerified()
    }

    const toMessage = () => {
        setNmessage(false)
        location.href="/message"
    }

    const HandleToClose = (e) => {
        if (e.target.id === "PopupToLogout") {
            SetProcessToLogout(false)
        }
    }




    const navigate= useNavigate();
    return (
        <>
            <div className="TitleMenu"
                style={{
                    justifyContent: account == false ? "space-between" : "normal",
                    width: innerWidth < 900 && !StartToSearch ? "100%" : location.pathname==="/" || GenreData.length > 4 || StartToSearch  ? "1330px" : "100%",
                    paddingBottom: account == false ? "10px" : "0px", paddingTop: account == false ? "10px" : "0px",
                    backgroundColor: !account ? "transparent" : false,
                    boxShadow: !account ? "none" : "black",
                    color: !account ? "black" : false
                }}>
                <div id="ProfileHead">
                    <h1 loading="lazy" style={{ color: !account ? "black" : "none" }}>SadeShop.com</h1>
                    {!account ?
                        <div className="ButtoNoLoginForDetskop">
                            <div className="NoLogin">
                                <Button styling="btn" action={() => { navigate("/login")}} ContentButton="Login"></Button>
                            </div>
                            <div className="NoLogin">
                                <Button styling={"btn"} action={() => { navigate("/Register") }} ContentButton="Register"></Button>
                            </div>
                        </div> :
                        <div>
                            <div className={`updateButton SmartPhoneMenu ${(selected === -1) ? "selectedMenu" : ""}`} >
                                <Button styling="btn" ContentButton={nMessage || notifMessage ? <img src="/Images/chat-bubble.png" width="25"></img> : <img src="/Images/chat-bubble.png" width="25"></img>} action={toMessage}></Button>
                                <Button styling="btn" action={() => { setBuildUpdate(BuildUpdate ? false : true) }}
                                    ContentButton={nMessage || notifMessage ? <img src="/Images/bell.png" width="25"></img> : <img src="/Images/bell.png" width="25"></img>}>
                                </Button>
                            </div>
                            <div style={{
                                height: BuildUpdate ? "150px" : "0px",
                                opacity: BuildUpdate ? "1" : "0"
                            }} className={`updateOptions updateOptionsSmartPhone ${BuildUpdate ? "BuildUpdateOption" : ""}`}>
                                <Button styling="btn" ContentButton={`Order Process`} action={() => { location.href="/InformationOrder" }}></Button>
                                <Button styling="btn" ContentButton={`Product Order (${SumProcess ? SumProcess : JSON.parse(sessionStorage.getItem('SumProcess'))})`} action={toPageProductOrder}></Button>

                            </div>
                        </div>
                    }
                   
                </div>


                {/*Detskop*/ account !== false ?
                    <div className="HeaderMenu"  >
                        <div className={`updateButton ${(selected === -1) ? "selectedMenu" : ""}`} >
                            <Button styling="btn" action={() => { setBuildUpdate(BuildUpdate ? false : true) }} ContentButton={nMessage || notifMessage ? `Update 🔴` : `Update`}></Button>
                        </div>
                        <div className={`updateOptions ${BuildUpdate ? "BuildUpdateOption" : ""} ${motionLeft ? "motionOptions" : ""}`}>
                            <Button styling="btn" ContentButton={`Order Process`} action={() => { location.href="/InformationOrder" }}></Button>
                            <Button styling="btn" ContentButton={`Product Order (${SumProcess ? SumProcess : JSON.parse(sessionStorage.getItem('SumProcess'))})`} action={toPageProductOrder}></Button>
                            <Button styling="btn" ContentButton={nMessage || notifMessage ? `Messages 🔴` : `Messages`} action={toMessage}></Button>
                        </div>
                        <div className={(selected === 0) ? "selectedMenu" : ""} >
                            <Button styling="btn" action={() => { route(0, (To1) ? To1 : "") }} ContentButton="Shop"></Button>
                        </div>
                        <div className={(selected === 1) ? "selectedMenu" : ""}>
                            <Button styling="btn" action={() => { route(1, (To2) ? To2 : "") }} ContentButton="Profile"></Button>
                        </div>
                        <div className={(selected === 2) ? "selectedMenu" : ""}>
                            <Button styling="btn" action={() => { route(2, (To3) ? To3 : "") }} ContentButton="About"></Button>
                        </div>
                        <div className={(selected === 3) ? "selectedMenu" : ""} >
                            <Button styling="btn" action={() => { route(3, (To3) ? To3 : "") }} ContentButton="Setting">   </Button>
                        </div>
                        <div className={(selected === 4) ? "selectedMenu" : ""} >
                            <Button styling="btn" action={() => { route(4, (To4) ? To4 : "") }} ContentButton="Logout">   </Button>
                        </div>
                        <div className={`ButtonOpenCart ${motionLeft ? "OpenMotion" : ""}`}>
                            <button hidden={(selected === 1 ? true : false)} onClick={() => { MotionMenuCart(motionLeft, setMotionLeft) }}> <img src={"./Images/icons8-cart-64.png"} alt="" /> </button>
                        </div>
                    </div> :
                    <div className="HeaderNoLogin">
                        <div className="NoLogin">
                            <Button styling="btn" action={() => { navigate("/login")} } ContentButton="Login"></Button>
                        </div>
                        <div className="NoLogin">
                            <Button styling={"btn"} action={() => { navigate("/Register") }} ContentButton="Register"></Button>
                        </div>
                    </div>
                }
                {account !== false ? <div className="SmartPhoneMenu">
                    <div className={(selected === 0) ? "selectedMenu" : ""} >
                        <Button styling="btn" action={() => { route(0, (To1) ? To1 : "") }} ContentButton="Shop"></Button>
                    </div>
                    <div className={(selected === 1) ? "selectedMenu" : ""}>
                        <Button styling="btn" action={() => { route(1, (To2) ? To2 : "") }} ContentButton="Profile"></Button>
                    </div>
                    <div className={(selected === 2) ? "selectedMenu" : ""}>
                        <Button styling="btn" action={() => { route(5, (To5) ? To5 : "") }} ContentButton="Cart"></Button>
                    </div>
                    <div className={(selected === 3) ? "selectedMenu" : ""} hidden={account === false ? true : false}>
                        <Button styling="btn" action={() => { route(3, (To3) ? To3 : "") }} ContentButton="Setting">   </Button>
                    </div>
                    <div className={(selected === 4) ? "selectedMenu" : ""} hidden={account === false ? true : false}>
                        <Button styling="btn" action={() => { route(4, (To4) ? To4 : "") }} ContentButton="Logout">   </Button>
                    </div>
                </div> : <></>}

            </div>
            {!account ? <></> :
                <div onClick={HandleToClose} id="PopupToLogout" className={`loading ${ProcessToLogout ? "loadingOn" : ""}`}>
                    <div className={`ConfirmBackToCart Logout ${ProcessToLogout ? "ConfirmBackToCartOn" : ""}`} hidden={ProcessToLogout ? false : true}>
                        <p>
                            Apakah Anda Ingin Melanjutkan Proses Logout?
                        </p>
                        <div className="ConfirmBackToCartAction">
                            <button  style={{ backgroundColor: "red" }} onClick={CancelToLogout}>No</button>
                            <button onClick={SureForLogout}>Yes</button>
                        </div>
                    </div>
                </div>}

        </>
    )
}

export default HeaderMenu;