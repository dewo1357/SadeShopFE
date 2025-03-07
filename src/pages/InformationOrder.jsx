/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import Button from "../Component/Element/Button/Button"
import Input from "../Component/Element/Input/Input"
import { useState } from "react"
import { getAcc, Refresh_Token } from "./manage";
import { useSocket } from "../SocketProvider";
import { API_URL } from "../../config";
const InformationOrder = () => {
    const socket = useSocket()
    const [indexButton, setIndex] = useState(0);
    const [Loading, setLoading] = useState(false);
    const [data, setData] = useState([])
    const [pictBuild, setPictBuild] = useState(false)
    const [account,SetAccount] = useState(getAcc())

    const getData = async () => {
        try {
            const response = await fetch(API_URL+"GetProcessOrder/" + category, {
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
                return Refresh_Token(socket)
            } else {
                setData(result.status !== "Failed" ? result.data : [])
                result.status === "Failed" ? setPictBuild(true) : setPictBuild(false)
                setLoading(true)
            }

        } catch (e) {
            console.log(e.message)
        }
    }

    const [category, setCategory] = useState("Process")
    const CheckCategory = (valueCategory, index) => {
        setPictBuild(false)
        setCategory(valueCategory)
        setIndex(index)
        setLoading(false)
    }

    const [processLoading,SetprocessLoading] = useState(false)
    const [ProcessCancel, SetProcessCancel] = useState(false)
    const ActToCancel = async (idTranscation) => {
        SetprocessLoading(true)
        SetProcessCancel(true)
        try {
            const response = await fetch(API_URL+"CancelCheckout/" + idTranscation, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${account.acces_token}`
                }
            })
            if (!response) {
                throw new Error("Failed To Cancel")
            }
            location.href = "/InformationOrder"
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        if (!Loading) {

            getData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Loading])


    return (
        <>
            <div className="FinishCheckout">
                <div className="TitleHeadInformationOrder">
                    <h1>Information Order</h1>
                    <h1 style={{ cursor: "pointer" }} onClick={() => { location.href = "/" }}>SadeShop.com</h1>
                </div>
                <div className="HeaderProductOrderInformation">
                    <div className="MenuOrderInformation">
                        <Button styling={indexButton == 0 ? "InformationButton" : ""} action={() => { CheckCategory("Process", 0) }} ContentButton="Pesanan Customer"></Button>
                        <Button styling={indexButton == 1 ? "InformationButton" : ""} action={() => { CheckCategory("Send", 1) }} ContentButton="Sedang Dikemas"></Button>
                        <Button styling={indexButton == 2 ? "InformationButton" : ""} action={() => { CheckCategory("Finish", 2) }} ContentButton="Sedang Dikirim"></Button>
                        <Button styling={indexButton == 3 ? "InformationButton" : ""} action={() => { CheckCategory("Cancel", 3) }} ContentButton="Cancel"></Button>
                    </div>
                    <div>
                        <Input placeholder="Search"></Input>
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }} hidden={pictBuild ? false : true}>
                <img src="/Images/search.png" alt="" width={innerWidth < 900 ? "300px" : "400px"} hidden={pictBuild?false:true} />
                </div>
                <div className="ContentProductOrderInformation">
                    {Loading ?
                        data.map((item) => (
                            <div key={item.transaction_id} className="ContanerProductList" >
                                <div className="SellerAndCancelButton">
                                    <h3>{item.Seller}</h3>
                                    <button onClick={() => ActToCancel(item.transaction_id)} hidden={item.products[0].Status !== "Process" ? true : false}>Cancel</button>
                                </div>
                                {item.products.map((items) => (
                                    <div key={items.id} className="productList Order">
                                        <div>
                                            <h3>{items.product_name}</h3>
                                        </div>
                                        <div>
                                            <h3>Rp {Intl.NumberFormat('id-ID').format(items.totalPrice)}</h3>
                                        </div>
                                    </div>
                                ))}
                                <div className="HeaderShipping">
                                    <h2>
                                        {item.Courier}
                                    </h2>
                                </div>

                                <div className="FooterOngkos">
                                    <h3>Ongkos Kirim</h3>
                                    <h3>Rp {Intl.NumberFormat("id-ID").format(item.Courier_Cost)}</h3>
                                </div>
                                <div className="FooterOngkos">
                                    <h3>Total</h3>
                                    <h3>Rp {Intl.NumberFormat("id-ID").format(item.totalPay)}</h3>
                                </div>
                            </div>


                        ))
                        : <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
                            <img src="/Images/Loading.gif" width="90px"></img>
                        </div>}
                </div>
                <div className={`loading ${processLoading ? "loadingOn" : ""}`}>
                    <div className="OverlayLoading" hidden={ProcessCancel ? false : true}>
                        <h2>Mohon Ditunggu<br></br> Permintaan Kamu Sedang Di Proses</h2>
                        <img src="/Images/Loading.gif" alt="" />
                    </div>
                </div>
            </div>
        </>
    )

}

export default InformationOrder