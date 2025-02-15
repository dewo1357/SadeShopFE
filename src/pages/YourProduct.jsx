import { useEffect } from "react";
import Button from "../Component/Element/Button/Button"
import Input from "../Component/Element/Input/Input"
import { Refresh_Token } from "./manage";
import { useState } from "react"
import { useSocket } from "../SocketProvider";
const InformationOrder = () => {
    const socket = useSocket();
    const [indexButton, setIndex] = useState(0);
    const [Loading, setLoading] = useState(false);
    const [data, setData] = useState([])
    const account = JSON.parse(localStorage.getItem("account"))

    const [pictBuild,setPictBuild] = useState(false)
    const getData = async () => {
        
        try {
            const response = await fetch("http://localhost:5000/YourProductOrder/" + category, {
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
            } else {
                console.log(result)
                setData(result.data ? result.data : [])
                setLoading(true)
                console.log(result.data)
                if(result.status==="Failed"){
                    setPictBuild(true)
                }
            }


        } catch (e) {
            console.log(e.message)
        }
    }

    const [category, setCategory] = useState("Process")
    const CheckCategory = (valueCategory, index) => {
        setLoading(false)
        setPictBuild(false)
        setCategory(valueCategory)
        setIndex(index)
    }

   

    useEffect(() => {
        if (!Loading) {
           
            getData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Loading])

    const ProcessOrder = async (id_product_transaction, setValue) => {
        const values = setValue === "Process" ? "Send" : setValue === "Send" ? "Finish" : ""
        console.log(values)

        try {
            const response = await fetch("http://localhost:5000/SettingStatus", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${account.acces_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        id_product_transaction: id_product_transaction,
                        setValue: values
                    }
                )
            })
            if (!response) {
                throw new Error("Failed")
            }
            const result = await response.json();
            if (result.statusCode === 401) {
                await Refresh_Token(socket)
            }


        } catch (e) {
            console.log(e.message)
        }
        setLoading(false)
    }


    return (
        <>
            <div className="FinishCheckout">
                <div className="TitleHeadInformationOrder">
                    <h1>Information Order</h1>
                    <h1 style={{ cursor: "pointer" }} onClick={() => { location.href = "/products" }}>SadeShop.com</h1>
                </div>
                <div className="HeaderProductOrderInformation">
                    <div className="MenuOrderInformation">
                        <Button styling={indexButton == 0 ? "InformationButton" : ""} action={() => { CheckCategory("Process", 0) }} ContentButton="Pesanan Customer"></Button>
                        <Button styling={indexButton == 1 ? "InformationButton" : ""} action={() => { CheckCategory("Send", 1) }} ContentButton="Sedang Dikemas"></Button>
                        <Button styling={indexButton == 2 ? "InformationButton" : ""} action={() => { CheckCategory("Finish", 2)}} ContentButton="Sedang Dikirim"></Button>
                        <Button styling={indexButton == 3 ? "InformationButton" : ""} action={() => { CheckCategory("Cancel", 3)}} ContentButton="Cancel"></Button>
                    </div>
                    <div>
                        <Input placeholder="Search"></Input>
                    </div>
                </div>
                
                <div style={{display:"flex",justifyContent:"center"}} hidden={pictBuild?false:true}>
                    <img src="/Images/search.png" alt="" width="400px" hidden={pictBuild?false:true} />
                </div>
                <div className="ContentProductOrderInformation" hidden={data.length===0?true:false} >
                    {Loading ?
                        data.map((item,index) => (
                            <div key={index} className="ContanerProductList" >
                                <div className="SellerAndCancelButton">
                                    <h3>{item.Customer}</h3>
                                    <h3>
                                        {item.province}, {item.city} {item.road} {item.postalCode} | {item.transaction_id}
                                    </h3>
                                </div>
                                {item.products.map((items,index) => (
                                    <div key={index} className="productList Setting">
                                        <div key={`${items.product_name}${items.id_transaction_product}`} >
                                            <h3>{items.product_name}</h3>
                                        </div>
                                        <div key={items.pcs} >
                                            <h3>{items.pcs}</h3>
                                        </div>
                                        <div key={`${items.price}${items.id_transaction_product}`} >
                                            <h3>Rp {Intl.NumberFormat('id-ID').format(items.price)}</h3>
                                        </div>
                                        <div key={items.totalPrice} >
                                            <h3>Rp {Intl.NumberFormat('id-ID').format(items.totalPrice)}</h3>
                                        </div>
                                        <div key={items.product_name}  style={{ display: "flex", justifyContent: "end" }}>
                                            <button onClick={() => ProcessOrder(items.id_transaction_product, items.Status)}

                                                hidden={items.Status === "Finish" ? true : false}>
                                                {items.Status === "Send" ? "Send" : "Process Order"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <div key={item.transaction_id}   className="HeaderShipping">
                                    <h2>
                                        {item.Courier}
                                    </h2>
                                </div>
                                <div className="Shipping">
                                    <div>
                                        <p>{item.Courier_description}</p>
                                        <p>Rp {Intl.NumberFormat('id-ID').format(item.Courier_Cost)}</p>
                                    </div>
                                    <div>
                                        <p>{item.Courier_Service}</p>
                                        <p>{item.Etd}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                        : <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
                            <img src="/Images/Loading.gif" width="90px"></img>
                        </div>}


                </div>

            </div>
        </>
    )

}

export default InformationOrder