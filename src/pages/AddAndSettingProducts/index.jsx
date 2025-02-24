
import Button from "../../Component/Element/Button/Button"
import PopupNotification from "../../Component/popup/PopupNotifCation"
import Form from "./Form"
import { useParams } from "react-router-dom"
import { useState, useRef } from "react"
import { getAcc } from "../manage"


const AddDataProductForSmartPhone = () => {
    const addProduct = useParams();
    // eslint-disable-next-line no-unused-vars
    const [account, setAccount] = useState(getAcc())
    const Product = JSON.parse(sessionStorage.getItem('ProductEdit'));

    //Popup Handling
    const Build = useRef();
    return (
        <>
            <div className="HeaderAddProductForSmartphone">
                <div>
                    <Button action={() => { location.href = "/profil/" + account.username }} styling="btn" ContentButton="Back"></Button>
                </div>
                <h1>{Product ? "Edit Data" : "Add Data"}</h1>
            </div>
            <Form
                account={account}
                addProduct={addProduct}
                Product={Product}
                Build={Build}
            />
           
            <PopupNotification />
        </>
    )
}

export default AddDataProductForSmartPhone