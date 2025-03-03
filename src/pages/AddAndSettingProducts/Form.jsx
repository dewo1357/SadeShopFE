/* eslint-disable react/prop-types */
import Label from "../../Component/Element/Label/Label"
import Input from "../../Component/Element/Input/Input"
import Button from "../../Component/Element/Button/Button"
import { useState,useRef } from "react"
import { v4 } from "uuid"
import { useEffect } from "react"
import { UploadImageToAPI, PostDataProduk, EditMyProduk } from "../manage"
import { API_URL } from "../../../config"

const Form = (props) => {
    const { account, Product, Build, addProduct } = props
    //Handling InputFile Gambar
    const [files, SetFile] = useState(null)
    const [imageFile, SetImageFile] = useState(null);
    const [img, setImg] = useState(null);
    const [Errorimg, setErrorImg] = useState(false);
    const [Errormessages, SetErrorMessages] = useState(false);


    const [ListCategory, SetListCategory] = useState(['Category']);
    const [PriceList, SetPriceList] = useState(['Price']);
    const [StokList, SetStokList] = useState(['Stok']);
    const [indexCategory, SetIndexCategory] = useState(0);

    const [Kind, setKind] = useState(false)
    const [Price, setPrice] = useState(false)
    const [Stok, setStok] = useState(false)
    const [Filess, setFiless] = useState(null)
    const [Title, setTitle] = useState(null)
    const [Description, SetDescription] = useState(null)
    const [Bobot, setBobot] = useState(null)



    //temp to edit dataaaaa
    const [TempKindArray, SetKindArray] = useState([])
    const [tempArray, setTempArray] = useState([])
    const [StokArray, setStokArray] = useState([])

    const Build2 = useRef();
    const [PopupDelete, SetPopupDelete] = useState(false)

    const [Proses, SetProses] = useState(false)


    const PopupDeleteProduk = () => {
        SetPopupDelete(!PopupDelete ? true : false)
        Build.current.style.visibility = !PopupDelete ? 'visible' : 'hidden';
        setTimeout(() => {
            Build2.current.style.opacity = !PopupDelete ? 1 : 0;
        }, 100)
    }

    const ActionToDeleteProduct = (id) => {
        const Deleteproduct = async () => {
            try {
                const endpoint = API_URL + `DELETEProduct/${id}`
                const response = await fetch(endpoint, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${account.acces_token}`
                    }
                });
                if (!response) {
                    throw new Error("Gagal Menghapus Data")
                }
                console.log(response)
                location.href = "/profil/" + account.username

            } catch (err) {
                console.log(err.message)
            }
        }
        Deleteproduct();
        sessionStorage.removeItem("KumpulanProduk");
        sessionStorage.removeItem("sessionProfilProduk")
        SetPopupDelete(false);
        Build.current.style.visibility = 'hidden';
    }



    const ChangeValue = (Category, value) => {
        if (Category === "Name") {
            setTitle(value)
        } else if (Category === "Description") {
            SetDescription(value)
        } else {
            setBobot(value)
        }
    }

    const Changevalue = (index, value, source, SetSource, setTemp) => {
        const data = [...source]
        data[index] = value
        setTemp(data)
        SetSource(data)
    }

    console.log(ListCategory)
    const addListCategory = (e) => {
        e.preventDefault();
        console.log(ListCategory)
        SetListCategory([...ListCategory, 'category' + indexCategory])
        SetPriceList([...PriceList, 'price' + indexCategory])
        SetStokList([...StokList, 'Stok' + indexCategory])
        console.log(ListCategory)

        SetIndexCategory(indexCategory + 1)
    }

    const HandleInput = (e) => {
        let file = e.target.files[0];
        if (!file) {
            throw new Error("Tipe Dokumen Tidak Sesuai");
        } else {
            const alloType = ['image/jpg', 'image/png', 'image/jpeg'];
            if (alloType.includes(file.type)) {
                //Validasi. Akan Di Proses apabila kurang dari 5 MB.
                if (file.size < 300000) {
                    const renamed = v4().toString();
                    const date = new Date().getTime().toString()
                    const terbaru = new File([file], `${renamed}_${date}`, {
                        type: file.type
                    })
                    console.log("masuk")

                    const data = new FormData()
                    data.append('fileImage', terbaru);
                    SetFile(terbaru);

                    setImg(URL.createObjectURL(terbaru));

                    SetImageFile(data.get('fileImage').name);
                    setErrorImg(false);
                } else {
                    SetErrorMessages(true)
                    setErrorImg(true);
                }

            } else {
                SetErrorMessages(false)
                setErrorImg(true);
            }
        }
    }

    const AddImage = async (e) => {
        e.preventDefault()
        Build.current.style.visibility = 'visible'
        SetProses(true)
        const data = {
            idProduct: e.target.id.value,
            images: imageFile ? imageFile : "/Images/2.jpg",
            title: e.target.NameProduk.value,
            kind: ListCategory ? ListCategory.map((item) => e.target[item].value) : e.target.Category.value,
            price: PriceList ? PriceList.map((item) => e.target[item].value) : e.target.Price.value,
            stok: StokList ? StokList.map((item) => e.target[item].value) : e.target.Price.value,
            content: e.target.Descripton.value,
            weight: e.target.Weight.value
        }
        await PostDataProduk(data);
        await UploadImageToAPI(files);
        location.href = "/profil/" + account.username
        alert("Berhasil Menambahkan Data")
    }

    const ChangeProduk = async (e) => {
        e.preventDefault();
        Build.current.style.visibility = 'visible'
        SetProses(true)
        const data = {
            images: imageFile ? imageFile : Filess,
            kind: ListCategory ? ListCategory.map((item) => e.target[item].value.toString()) : e.target.Category.value,
            price: PriceList ? PriceList.map((item) => e.target[item].value) : e.target.Price.value,
            stok: StokList ? StokList.map((item) => e.target[item].value) : e.target.Stok.value,
            title: e.target.NameProduk.value,
            content: e.target.Descripton.value,
            weight: e.target.Weight.value
        }

        await EditMyProduk(e.target.id.value, data);
        if (imageFile) {
            await UploadImageToAPI(files)
        }
        location.href = "/profil/" + account.username
    }

    const DeleteCategory = (index) => {
        console.log(index)
        const price_list = [...Price]
        const kind_list = [...Kind]
        const stok_list = [...Stok]

        price_list.splice(index, 1)
        kind_list.splice(index, 1)
        stok_list.splice(index, 1)

        setTempArray(price_list)
        SetKindArray(kind_list)
        setStokArray(stok_list)

        const PriceCategory = [...ListCategory]
        const KindCategory = [...PriceList]
        const StokCategory = [...StokList]

        PriceCategory.splice(index, 1)
        KindCategory.splice(index, 1)
        StokCategory.splice(index, 1)

        SetListCategory(PriceCategory)
        SetPriceList(KindCategory)
        SetStokList(StokCategory)

        console.log(ListCategory)
    }

    useEffect(() => {
        const param = new URLSearchParams(window.location.search)
        if (Product) {
            if (param.get('AddData')) {
                console.log(param.get('AddData'))
                sessionStorage.removeItem('ProductEdit')
            } else {
                console.log(Product)
                setFiless(Product.image ? Product.image : false)

                setTitle(Product.Name)
                SetDescription(Product.Content)
                setBobot(Product.bobot)

                setTempArray(Product.Price)
                SetKindArray(Product.Kind)
                setStokArray(Product.Stok)

                setPrice(Product.Price)
                setKind(Product.Kind)
                setStok(Product.Stok)

                SetIndexCategory(Product.Price.length)

                SetListCategory(Product.Price.map((item, index) => (`Category${index++}`)))
                SetPriceList(Product.Price.map((item, index) => (`Price${index++}`)))
                SetStokList(Product.Price.map((item, index) => (`Stok${index++}`)))

                console.log(ListCategory)

            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <>
            <div className="FormAddProdukSmartPhone  ">
                <form action="" onSubmit={!Product ? AddImage : ChangeProduk}>

                    <div className="ProdukImage">
                        <div>
                            <Label Content="Images" />
                            <div>
                                <div hidden={Errorimg ? false : true} style={{ color: 'red', marginBottom: "0px" }}>
                                    <p style={{ fontSize: "10px", marginBottom: "0px" }}> {Errormessages ? "Ukuran Photo Terlalu Besar❗" : "Tipe Dokumen Tidak Sesuai❗"} </p>
                                </div>
                                <label className="UploadImage" htmlFor={addProduct ? "image" : "EditFile"}>
                                    <img style={{ objectFit: "cover" }} src={!Product ? img : img ? img : "https://qcgtgzcrwkdtkzzgkclh.supabase.co/storage/v1/object/public/gambarProducts/" + Filess} width={"100px"}></img>
                                </label>
                                <input type="file" onChange={HandleInput} id={addProduct ? "image" : "EditFile"} hidden />
                            </div>
                        </div>
                        <div className="CategoryAndPriceLayout">
                            <Label Content="Nama " />
                            <Input type="text" value={Product ? Product.id : v4().toString()} name="id" isHidden={true} ></Input>
                            <Input type="text" placeholder="Produk Name" onChange={(e) => { ChangeValue("Name", e.target.value) }} value={Title} name="NameProduk" />
                            <h2>Category</h2>
                            <div className="CategoryAndPrice v2" >
                                <div>
                                    {ListCategory.map((item, index) => (
                                        <div key={index}>
                                            <Input type="text" placeholder="Category" max={15} value={!Product ? null : TempKindArray[index]} name={item}
                                                onChange={Product ? (e) => Changevalue(index, e.target.value, Kind, setKind, SetKindArray) : () => { }}     ></Input>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    {PriceList.map((items, index) => (
                                        <div key={index}>
                                            <Input type="number" placeholder="Price" value={!Product === false ? tempArray[index] : null} name={items}
                                                onChange={Product ? (e) => Changevalue(index, e.target.value, Price, setPrice, setTempArray) : () => { }}></Input>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    {StokList.map((items, index) => (
                                        <div key={index}>
                                            <Input type="number" placeholder="Stok" value={!Product === false ? StokArray[index] : null} name={items}
                                                onChange={Product ? (e) => Changevalue(index, e.target.value, Stok, setStok, setStokArray) : () => { }}></Input>
                                        </div>
                                    ))}
                                </div>
                                <div hidden={!Product ? true : false}>
                                    {ListCategory.map((item, index) => (
                                        <div className="ButtonDelete" key={item} onClick={() => DeleteCategory(index)}>
                                            <span > ❌ </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <span className="buttonspan" onClick={addListCategory}><a style={{ cursor: "pointer" }} >ADD</a></span>
                        </div>
                    </div>
                    <div className="Description">
                        <Label Content="Weight/gr" />
                        <input type="number" value={Bobot} onChange={(e) => { ChangeValue("bobot", e.target.value) }} id="" name="Weight"   ></input>
                    </div>
                    <div className="Description">
                        <Label Content="Description" />
                        <textarea id="" value={Description} onChange={(e) => { ChangeValue("Description", e.target.value) }} name="Descripton"   ></textarea>
                    </div>
                    <div className={!Product ? '' : "actionButton"}>
                        <span onClick={PopupDeleteProduk} hidden={!Product ? true : false}>Delete Produk</span>
                        <Button styling="btn" ContentButton={Product ? "Edit Product" : "Add Product"}></Button>
                    </div>
                </form>
            </div>
            <div ref={Build} style={{ zIndex: '1' }} className="popup">
                <div ref={Build2} style={{ zIndex: '1' }} className="ConfirmationDelete">
                    <h1>Apakah Anda Yakin?</h1>
                    <h2>⚠</h2>
                    <div style={{ display: 'flex', justifyContent: "space-between", marginTop: "12%" }}>
                        <div className="Cancel">
                            <Button styling="btn" ContentButton="Batal" action={PopupDeleteProduk} ></Button>
                        </div>
                        <Button styling="btn" ContentButton="Yakin" action={() => { ActionToDeleteProduct(Product.id) }} ></Button>
                    </div>
                </div>
                <div className="OverlayLoading" hidden={Proses ? false : true}>
                    <h2>Mohon Ditunggu<br></br> Pesanan Kamu Sedang Di Proses</h2>
                    <img src="/Images/Loading.gif" alt="" />
                </div>
            </div>
        </>

    )
}

export default Form