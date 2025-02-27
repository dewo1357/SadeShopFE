/* eslint-disable react/prop-types */
import ListCart from "../../Component/Card_Cart/ListCart"

import Button from "../../Component/Element/Button/Button";
import { MotionMenuCart} from "../manage";
const Cart = (props) => {
   
    const { motionLeft, setMotionLeft, account,listCart } = props

    return (
        <>
            {!account || innerWidth < 900 ? <></> :
                <div className={`CartContainer ${motionLeft ? "motion_Cart" : ""}`}>
                    <div hidden={motionLeft ? false : true}
                        style={{
                            display: "flex", marginTop: "0",
                            alignItems: "center", justifyContent: "space-around"
                        }}>
                        <h1 style={{
                            textAlign: "left", marginLeft: "1", transition: "1000ms",
                            width: motionLeft ? "280px" : "0px", margin: "5px"
                        }} hidden={motionLeft ? false : true}>CART</h1>
                        <button hidden={motionLeft ? false : true}
                            style={{
                                height: "40px", backgroundColor: "transparent",
                                display: motionLeft ? "flex" : "none", justifyContent: "center", border: "0px"
                            }}
                            onClick={() => { MotionMenuCart(motionLeft, setMotionLeft) }}>
                            <img hidden={motionLeft ? false : true} src="/Images/icons8-cancel-64.png" width="40"></img>
                        </button>
                    </div>
                    <div className="LayoutListCart" hidden={motionLeft ? false : true}>
                        {listCart.map((items, index) => (
                            <ListCart key={`${index}`} brand={items.title} pcs={items.pcs}
                                price={new Intl.NumberFormat('id-ID').format(items.price)}
                                total={new Intl.NumberFormat('id-ID').format(items.totalPrice)} />
                        ))}
                    </div>
                    <div className="ButtonToSeeCart" hidden={motionLeft ? false : true}>
                        <Button styling="btn" ContentButton="Check Your Cart" action={() => { location.href = "/cart" }}></Button>
                    </div>
                </div>}
        </>
    )
}

export default Cart