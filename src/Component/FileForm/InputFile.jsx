/* eslint-disable no-unused-vars */

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { v4 } from "uuid";
import Input from "../Element/Input/Input";
import Label from "../Element/Label/Label";
import Button from "../Element/Button/Button";
import { useEffect } from "react";
import { useRef } from "react";
import { API_URL } from "../../../config";
import { UploadImageToAPI, PostDataProduk, EditMyProduk, getAcc } from "../../pages/manage";


const InputFile = (props) => {
    const { Title, Filess, Price, Kind, Stok, Description, ContentButton,
        addProduct, idProduk, changeTitle, changeDescription, action_to_close,
        setPrice, setKind, setStok, setAddData, Changebobot, bobot, setFinnalMessage2, SetProcessLoading } = props;

    const [imageFile, SetImageFile] = useState(null);
    const [img, setImg] = useState(null);
    const [Errorimg, setErrorImg] = useState(false);
    const [Errormessages, SetErrorMessages] = useState(false);


    const [account,SetAccount] = useState(getAcc())


    const [ListCategory, SetListCategory] = useState(['Price']);
    const [PriceList, SetPriceList] = useState(['Category']);
    const [StokList, SetStokList] = useState(['Stok']);
    const [indexCategory, SetIndexCategory] = useState(0);
    const [indexPrice, SetIndexPrice] = useState(0);


    //temp to edit dataaaaa
    const [TempKindArray, SetKindArray] = useState(Kind)
    const [tempArray, setTempArray] = useState(Price)
    const [StokArray, setStokArray] = useState(Stok)
    



    useEffect(() => {
        setTempArray(Price ? Price : [])
        SetKindArray(Kind ? Kind : [])
        setStokArray(Stok ? Stok : [])

        SetIndexCategory(Price ? Price.length : 0)
        SetIndexPrice(Price ? Price.length : 0)

        SetListCategory(Price ? Price.map((item, index) => (`Category${index + 1}`)) : ['Category'])
        SetPriceList(Price ? Price.map((item, index) => (`Price${index + 1}`)) : ['Price'])
        SetStokList(Price ? Price.map((item, index) => (`Stok${index + 1}`)) : ['Stok'])
    }, [Price], [Kind], [Stok])


    useEffect(() => {

    })



    ///Onchange
    const Changevalue = (index, value, source, SetSource, setTemp) => {
        const data = [...source]
        data[index] = value
        setTemp(data)
        SetSource(data)
    }

    //Add Image & Add Produk=====================================================================
    const [files, SetFile] = useState(null)


    const AddImage = async (e) => {
        e.preventDefault()
        SetProcessLoading(true)
        setFinnalMessage2(true)
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
        SetProcessLoading(false)
        await UploadImageToAPI(files);
        setAddData(false)
        Reset(e)
    }

    //Edit Produk=====================================================================


    const ChangeProduk = async (e) => {
        e.preventDefault();
        SetProcessLoading(true)
        setFinnalMessage2(true)
        const data = {
            images: imageFile ? imageFile : Filess,
            kind: ListCategory ? ListCategory.map((item) => e.target[item].value.toString()) : e.target.Category.value,
            price: PriceList ? PriceList.map((item) => e.target[item].value) : e.target.Price.value,
            stok: StokList ? StokList.map((item) => e.target[item].value) : e.target.Stok.value,
            title: e.target.NameProduk.value,
            content: e.target.Descripton.value,
            weight: e.target.Weight.value
        }

        await EditMyProduk(e.target.id.value, data, setFinnalMessage2);
        setAddData(false);
        if (imageFile) {
            await UploadImageToAPI(files)
        }
        Reset(e);
        SetProcessLoading(false);
    }

    const Reset = () => {
        setImg(null);
        SetImageFile(null);
        action_to_close();
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

            } catch (err) {
                console.log(err.message)
            }
        }
        Deleteproduct();
        sessionStorage.removeItem("KumpulanProduk");
        sessionStorage.removeItem("sessionProfilProduk")

        setAddData(false);
        action_to_close();
        SetPopupDelete(false);
        Build.current.style.visibility = 'hidden';
    }

    //Handling InputFile Gambar
    const HandleInput = (e) => {
        let file = e.target.files[0];
        if (!file) {
            throw new Error("Tipe Dokumen Tidak Sesuai");
        } else {
            const alloType = ['image/jpg', 'image/png', 'image/jpeg'];
            if (alloType.includes(file.type)) {
                //Validasi. Akan Di Proses apabila kurang dari 5 MB.
                if (file.size < 5000000) {
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


    //Popup Handling
    const Build = useRef();
    const Build2 = useRef();
    const [PopupDelete, SetPopupDelete] = useState(false)
    const PopupDeleteProduk = () => {
        SetPopupDelete(!PopupDelete ? true : false)
        Build.current.style.visibility = !PopupDelete ? 'visible' : 'hidden';
        setTimeout(() => {
            Build2.current.style.opacity = !PopupDelete ? 1 : 0;
        }, 100)
    }

    //Add Category,Price,And Stok
    const addListCategory = (e) => {
        e.preventDefault();
        SetListCategory([...ListCategory, 'category' + indexCategory])
        SetPriceList([...PriceList, 'price' + indexPrice])
        SetStokList([...StokList, 'Stok' + indexPrice])

        SetIndexCategory(indexCategory + 1)
        SetIndexPrice(indexPrice + 1)

        setPrice(Price ? [...Price, null] : null)
        setKind(Kind ? [...Kind, null] : null)
        setStok(Stok ? [...Stok, null] : null)

    }

    //Hapus Category,Price,And Stok
    const DeleteCategory = (index) => {
        const price_list = [...Price]
        const kind_list = [...Kind]

        price_list.splice(index, 1)
        kind_list.splice(index, 1)

        setTempArray(price_list)
        SetKindArray(kind_list)
        setPrice(price_list)
        setKind(kind_list)
    }

    return (
        <div>

            <form action="" onSubmit={addProduct ? AddImage : ChangeProduk}>
                <Label Content="Nama " />
                <Input type="text" value={addProduct ? v4().toString() : idProduk} name="id" isHidden={true} ></Input>
                <Input type="text" placeholder="Produk Name" name="NameProduk" value={Title} onChange={changeTitle} />
                <div className="ProdukImage">
                    <div>
                        <Label Content="Images" />
                        <div>
                            <div hidden={Errorimg ? false : true} style={{ color: 'red', marginBottom: "0px" }}>
                                <p style={{ fontSize: "10px", marginBottom: "0px" }}> {Errormessages ? "Ukuran Photo Terlalu Besar❗" : "Tipe Dokumen Tidak Sesuai❗"} </p>
                            </div>
                            <label className="UploadImage" htmlFor={addProduct ? "image" : "EditFile"}>
                                <img style={{ objectFit: "cover" }} src={addProduct ? img : img ? img : "https://qcgtgzcrwkdtkzzgkclh.supabase.co/storage/v1/object/public/gambarProducts/" + Filess} width={"100px"}></img>
                            </label>
                            <input type="file" onChange={HandleInput} id={addProduct ? "image" : "EditFile"} hidden />
                        </div>
                    </div>
                    <div className="CategoryAndPriceLayout">
                        <div className="CategoryAndPrice" >
                            <div>
                                <span>Category</span>
                                {ListCategory.map((item, index) => (
                                    <div key={index}>
                                        <Input type="text" placeholder="Category" max={15} value={addProduct ? null : TempKindArray[index]} name={item}
                                            onChange={!addProduct ? (e) => Changevalue(index, e.target.value, Kind, setKind, SetKindArray) : () => { }}     ></Input>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <span>Price</span>
                                {PriceList.map((items, index) => (
                                    <div key={index}>
                                        <Input type="number" placeholder="Price" value={addProduct === false ? tempArray[index] : null} name={items}
                                            onChange={!addProduct ? (e) => Changevalue(index, e.target.value, Price, setPrice, setTempArray) : () => { }}></Input>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <span>Stok</span>
                                {StokList.map((items, index) => (
                                    <div key={index}>
                                        <Input type="number" placeholder="Stok" value={addProduct === false ? StokArray[index] : null} name={items}
                                            onChange={!addProduct ? (e) => Changevalue(index, e.target.value, Stok, setStok, setStokArray) : () => { }}></Input>
                                    </div>
                                ))}
                            </div>
                            <div hidden={addProduct ? true : false}>
                                <Label Content="Delete">Delete</Label>
                                {ListCategory.map((item, index) => (
                                    <div className="ButtonDelete" key={item} onClick={() => DeleteCategory(index)}><span > ❌ </span></div>
                                ))}
                            </div>
                        </div>
                        <span className="buttonspan" onClick={addListCategory}><a style={{ cursor: "pointer" }} >ADD</a></span>
                    </div>
                </div>
                <div className="Description">
                    <Label Content="Weight/gr" />
                    <input type="number" id="" name="Weight" value={bobot} onChange={Changebobot}   ></input>
                </div>
                <div className="Description">
                    <Label Content="Description" />
                    <textarea id="" name="Descripton" value={Description} onChange={changeDescription}  ></textarea>
                </div>
                <div className={addProduct ? '' : "actionButton"}>
                    <span onClick={PopupDeleteProduk} hidden={addProduct ? true : false}>Delete Produk</span>
                    <Button ContentButton={ContentButton}></Button>
                </div>
            </form>
            <div ref={Build} style={{ zIndex: '1' }} className="popup">
                <div ref={Build2} style={{ zIndex: '1' }} className="ConfirmationDelete">
                    <h1>Apakah Anda Yakin?</h1>
                    <h2>⚠</h2>
                    <div style={{ display: 'flex', justifyContent:"space-between", marginTop: "12%" }}>
                        <div className="Cancel">
                            <Button styling="btn" ContentButton="Batal" action={PopupDeleteProduk} ></Button>
                        </div>
                        <Button styling="btn" ContentButton="Yakin" action={() => { ActionToDeleteProduct(idProduk) }} ></Button>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default InputFile;