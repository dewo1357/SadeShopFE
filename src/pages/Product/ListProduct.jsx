/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import CardProduct from "../../Component/Card_Cart/CardLProduct"
import { useState } from "react"
import { getAcc, Close } from "../manage"

const ListProduct = (props) => {

    const { motionLeft, Loading, GenreData, popup2, SetGrabProduk } = props
    const [account, SetAccount,] = useState(getAcc())

    console.log(SetGrabProduk)
    const ActionGrabProduk = (data) => {
        if (account !== false) {
            console.log(data)
            Close(true, popup2)
            SetGrabProduk(data);
        } else {
            location.href = "/login"
        }
    }

    return (
        <>
            <div hidden={motionLeft ? false : true} className={` ${motionLeft && innerWidth > 900 ? "ProductPages motion_on" : "ProductPages"}`}>
                {!Loading ? GenreData.map((item) => (
                    <CardProduct key={item.id} account={account} >
                        <CardProduct.images source={"https://qcgtgzcrwkdtkzzgkclh.supabase.co/storage/v1/object/public/gambarProducts/" + item.URLimages} />
                        <CardProduct.HeaderContent title={item.title} seller={item.name.nama} dataProduct={item} account={account}>
                            <p>
                                {item.content}
                            </p>
                        </CardProduct.HeaderContent>
                        {item.Account.username !== account.username ?
                            <CardProduct.Footer price={new Intl.NumberFormat('id-ID').format(item.price[0])} action={() => ActionGrabProduk(item)} Content="ORDER" />
                            : <CardProduct.Footer price={new Intl.NumberFormat('id-ID').format(item.price[0])} action={() => { location.href = `/profil/${item.Account.username}` }} Content="CHECK" />}
                    </CardProduct>
                )) : 'Loading'}
            </div>
        </>
    )
}

export default ListProduct