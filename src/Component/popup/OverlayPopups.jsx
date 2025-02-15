/* eslint-disable react/prop-types */
import { useState } from "react";
import ListCartFinish from "../Card_Cart/ListCartFinish"
import PersonalDetail from "../Card_Cart/PersonalDetail"
import Button from "../Element/Button/Button";


const OverlayPopups = (props) => {
    //perpindahan Information & Pesanan Item
    const [infoAndItem, Setinfo] = useState(false);

    const { listCart, DataFinish, isvisible, DeleteCart, ActionButton } = props;
    console.log(listCart)
    let index = 0;
    return (
        <div className="Information" hidden={isvisible}>
            <h1>
                Process Finished
            </h1>
            <div className="optionFinishButton">
                <div className={`${infoAndItem ? "" : "selected"} `}>
                    <Button ContentButton="Detail Produk" action={() => { Setinfo(false) }}></Button>

                </div>
                <div className={`${infoAndItem ? "selected" : ""} `}>
                    <Button ContentButton="Information" action={() => { Setinfo(true) }}></Button>
                </div>
            </div>
            <div hidden={infoAndItem ? true : false}>
                <div className="LayoutListCart finishLayoutList" >
                    {listCart.map((items) => (
                        <ListCartFinish key={index++} brand={items.title} pcs={items.pcs}
                            price={new Intl.NumberFormat('id-ID').format(items.price)}
                            total={new Intl.NumberFormat('id-ID').format(items.totalPrice)}
                            action={() => { DeleteCart(items.title) }} />
                    ))}
                </div>
                <div className="TotalAmount">
                    <h1 >Rp {Intl.NumberFormat('id-ID').format(DataFinish.amount)}</h1>
                </div>


            </div>
            <div className="PersonalDetail" hidden={infoAndItem ? false : true}>
                <div>
                    <PersonalDetail key={DataFinish.nama} title="Nama" data={DataFinish.Name} />
                    <PersonalDetail key={DataFinish.nama} title="Credit Card" data={DataFinish.CardNumber} />
                    <PersonalDetail key={DataFinish.Username} title="Username" data={DataFinish.Username} />
                    <PersonalDetail key={DataFinish.Email} title="Email" data={DataFinish.Email} />
                    <PersonalDetail key={DataFinish.Address} title="Address" data={DataFinish.Address} />
                </div>
                <div className="TotalAmount">
                    <h1 >Rp {Intl.NumberFormat('id-ID').format(DataFinish.amount)}</h1>
                </div>


            </div>
            <button onClick={ActionButton}>Done</button>
        </div>
    )
}

export default OverlayPopups  