
import { useState } from "react";

const Statesss = () => {
    const [turnOnAddProduct, SetTurnOn] = useState(false);
    const [turnOnAddProduct2, SetTurnOn2] = useState(false);
    const [totalItem, setTotalItem] = useState(0);
    
    //visibleForm FormPayment
    const [VisibleForm, SetVisibleForm] = useState(false);
    const [isVisible, setVisible] = useState(true);

    //GrabProduk
    const [GrabProduk, SetGrabProduk] = useState(null)
    const [listCart, SetListCart] = useState([])
    const [totalPrice, setTotal] = useState(0);
    const [FinsihPay, SetFinishPay] = useState({});

    //Smartphone
    const [RightIsOn, setRight] = useState(false);
    const [IsOn, setNav] = useState(false);
    const [addData, setAddData] = useState(false)
    const [Loading2, SetLoading2] = useState(true)

    return {
        turnOnAddProduct, SetTurnOn,
        turnOnAddProduct2, SetTurnOn2,
        totalItem, setTotalItem,
        VisibleForm, SetVisibleForm,
        isVisible, setVisible,
        GrabProduk, SetGrabProduk,
        listCart, SetListCart,
        totalPrice, setTotal,
        FinsihPay, SetFinishPay,
        RightIsOn, setRight,
        IsOn,setNav,
        addData, setAddData,
        Loading2, SetLoading2,
        
    }
}


export default Statesss



