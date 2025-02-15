/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom";
import ListCart from "../Card_Cart/ListCart";
import Button from "../Element/Button/Button";
import Statesss from "../../pages/States";

import { Active_Nav, RightOn } from "../../pages/manage"
import { useEffect } from "react";
const SmartPhoneCartAndMenu = (props) => {
    const { listCart, account, DeleteCart,
        totalItem, totalPrice, visit,
        setTotal, setTotalItem, renderCart, selected, To1, To2, To3, To4 } = props
    const {
        RightIsOn, setRight,
        IsOn, setNav, SetListCart } = Statesss();

  

    //activeNavBar



    //Menu Nav Bar Smarphone

    const navigate = useNavigate();
    useEffect(() => {
      
    }, [IsOn])
    const route = (number, tujuan) => {

        if (number === 4) {
            localStorage.removeItem('account');
        }
        navigate(tujuan);
    }

    return (
        <>

            <button className={`Burger ${IsOn ? "motion_right" : ""}`} onClick={() => Active_Nav(IsOn, setNav)}>{IsOn ? "❌" : <img src={"./Images/icons8-cart-64.png"} width="40px" ></img>}</button>
            <button className={`Burger MenuBurger ${RightIsOn ? "motion_left" : ""}`} onClick={() => RightOn(RightIsOn, setRight)}>{RightIsOn ? "❌" : <img src={"./Images/white-menu-icon-25.jpg"} width="40px" ></img>}</button>


            <button
                className={"Kedua"}
                hidden={(selected === 1) ? true : false}
                onClick={() => Active_Nav(IsOn, setNav)}> <img hidden={(selected === 1) ? true : false} src={"./Images/icons8-cart-64.png"} alt="" />
            </button>
            <div className={`NavCart ${IsOn ? "displayOn" : ""}`}>
                <h1>Cart</h1>

                <div className="LayoutListCart nav" >
                    {listCart.map((items) => (
                        <ListCart key={items.id} brand={items.title} pcs={items.pcs}
                            price={new Intl.NumberFormat('id-ID').format(items.price)}
                            total={new Intl.NumberFormat('id-ID').format(items.total)}
                            action={() => {
                                DeleteCart(items.idCart, setTotal, setTotalItem, totalPrice, totalItem,
                                    () => { renderCart(account, SetListCart, setTotalItem, setTotal) })
                            }
                            } />
                    ))}
                </div>
                <div className="ButtonToSeeCart" >
                    <Button ContentButton="Check Your Cart" action={() => { location.href = "/cart" }}></Button>
                </div>
            </div>
            <button className="Menu_Kedua" onClick={() => RightOn(RightIsOn, setRight)} ><img src={visit ? '../Images/menu-bar.png' : './Images/menu-bar.png'} alt="" /></button>
            <div className={`NavCart Right ${RightIsOn ? "displayOn_Left" : ""}`}>
                <div className="RightMenu">
                    <h1>Menu</h1>
                    <div className={selected === 1 ? "se" : ""} >
                        <Button action={() => { route(1, (To1) ? To1 : "") }} ContentButton="Shop"></Button>
                    </div>
                    <div className={selected === 2 ? "se" : ""}>
                        <Button action={() => { route(2, (To2) ? To2 : "") }} ContentButton="Profile"></Button>
                    </div>
                    <div className={selected === 3 ? "se" : ""}>
                        <Button action={() => { route(3, (To3) ? To3 : "") }} ContentButton="About"></Button>
                    </div>
                    <div className={selected === 4 ? "se" : ""}>
                        <Button action={() => { route(4, (To4) ? To4 : "") }} ContentButton="Logout"></Button>
                    </div>
                </div>

            </div>

        </>
    )
}

export default SmartPhoneCartAndMenu