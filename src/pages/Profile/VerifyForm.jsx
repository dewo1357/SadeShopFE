import { useEffect, useState, useRef } from "react";
import Label from "../../Component/Element/Label/Label";
import { Refresh_Token } from "../manage";
import { API_URL } from "../../../config";
import MyComponent from "../MyComponent";

/* eslint-disable react/prop-types */
const VerifyForm = (props) => {
    const { socket, getMyAccount, account, setPesan, SetProcessLoading,
        popupVerify, setFinnalMessage, processLoading, SetProcessChangeProfile
    } = props



    const [done, setDone] = useState(false)
    const overlayVerify = useRef();
    const ProcessVerify = () => {
        setDone(true)
    }

   


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

    const [ProcessMap, setProcessMap] = useState(false);
    const [LoadingMap, setLoadingMap] = useState(false)
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

    useEffect(() => {
        if (LoadingMap) {
            setLoadingMap(false)
            setDataAaddress({
                state: address.address.state,
                city: address.address.city,
                road: address.address.road,
                postalCode: address.address.postcode
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [LoadingMap])

    const VerifyAccount = async (e) => {
        e.preventDefault();
        popupVerify.current.style.visibility = 'hidden'
        setDone(false)
        SetProcessLoading(true)
        console.log(processLoading)
        setPesan("Verifikasi Account Kamu Sedang Di Proses")
        SetProcessChangeProfile(true)
        const acc = JSON.stringify({
            email: getMyAccount.Email,
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
            if (!response) {
                throw new Error("Failed")
            }
            const result = await response.json();

            if (result.statusCode === 401) {
                await Refresh_Token(socket)
                getMyAccount ?
                    location.href = `/profil/${getMyAccount.username}` :
                    location.href = "/login"
            }
            setFinnalMessage(result.message)
            // eslint-disable-next-line no-unused-vars
        } catch (e) {
            return
        }
    }


    return (
        <>
            <div ref={popupVerify} className="overlay3 ">
                <div className={`OverlayMap ${ProcessMap ? "OverlayMapOn" : ""}`} hidden>
                    <div className="Map">
                        <MyComponent instalUlang={null} setProcessMap={setProcessMap} seAddress={seAddress} setLoadingMap={setLoadingMap} />
                    </div>
                </div>
                <form onSubmit={VerifyAccount} action="">
                    <div className="InsertPass verify" hidden={!done ? true : false}>
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
                                <h3>Link Verifikasi Akan dikirim ke <span style={{ backgroundColor: "black", color: "white", padding: "5px" }}>{getMyAccount.Email}</span></h3>
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
            </div>
            
        </>
    )
}

export default VerifyForm