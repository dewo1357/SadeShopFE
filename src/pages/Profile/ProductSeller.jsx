/* eslint-disable react/prop-types */
import CardProduct from "../../Component/Card_Cart/CardLProduct"
import { useNavigate } from "react-router-dom"
import { Close } from "../manage"
import Statesss from "../States"

const ProductSeller = (props) => {
    const {GenreData,getMyAccount,isAccess,popup2} = props
    const {SetGrabProduk} = Statesss()
    const navigate = useNavigate();

    const ActionGrabProduk = (data) => {
        Close(true, popup2)
        SetGrabProduk(data);
    }
    
    const TurnOnFormEdit = (id, Title, Kind, Prices, Stok_brg, script, gambar, bobot) => {
        const ProductToEdit = {
            id: id,
            Name: Title,
            Price: Prices,
            Kind: Kind,
            Stok: Stok_brg,
            Content: script,
            image: gambar,
            bobot: bobot
        }
        sessionStorage.setItem('ProductEdit', JSON.stringify(ProductToEdit))
        navigate("/SetProduct")
    }
    return (
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
            {GenreData.map((item) => (
                <CardProduct key={item.id}>
                    <CardProduct.images source={"https://qcgtgzcrwkdtkzzgkclh.supabase.co/storage/v1/object/public/gambarProducts/" + item.URLimages} />
                    <CardProduct.HeaderContent title={item.title} seller={getMyAccount.nama} dataProduct={item} >
                        <p>
                            {item.content}
                        </p>

                    </CardProduct.HeaderContent>
                    <CardProduct.Footer price={new Intl.NumberFormat('id-ID').format(item.price[0])}
                        action={!isAccess ? () => ActionGrabProduk(item) : () => {
                            TurnOnFormEdit(
                                item.id,
                                item.title,
                                item.kind,
                                item.price,
                                item.stok,
                                item.content,
                                item.URLimages,
                                item.weight
                            )
                        }}
                        Content={!isAccess ? "ORDER" : "Setting"} />
                </CardProduct>
            ))}
        </div>
    )
}

export default ProductSeller