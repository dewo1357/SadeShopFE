/* eslint-disable react-refresh/only-export-components */
import { API_URL } from "../../config";

const PostDataProduk = async (data) => {
    const account = JSON.parse(localStorage.getItem('account'))
    try {
        const response = await fetch(API_URL+"AddProduct", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${account.acces_token}`
            },
            body: JSON.stringify(data)
        })


        if (!response) {
            throw new Error(response.messages)
        }
    } catch (error) {
        throw new Error(error.messages)
    }

}

const UploadImageToAPI = async (file) => {
    const account = JSON.parse(localStorage.getItem('account'))
    const files = new FormData()
    files.append('files', file);
    try {
        const response = await fetch(API_URL+"UploadImage", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${account.acces_token}`,
            },
            body: files,
        })


        if (!response) {
            throw new Error(response.messages)
        }
        

    } catch (error) {
        throw new Error(error.messages)
    }

}

const EditMyProduk = async (idProduk, data,setFinnalMessage2=false) => {
    const account = JSON.parse(localStorage.getItem('account'))
    try {
        const endpoint = API_URL+`EditProduct/${idProduk}`
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${account.acces_token}`
            },
            body: JSON.stringify(data),
        })
        if (!response) {
            throw new Error("Gagal Mengedit Data")
        }
        if(setFinnalMessage2){
            setFinnalMessage2(false)
        }
    } catch (error) {
        console.log(error.message)
    }

}


const process = async (e, SetLoading2, SetProcessLoading) => {
    SetProcessLoading(true)
    const account = JSON.parse(localStorage.getItem("account"))
    e.preventDefault();
    const nama = e.target.nama.value;
    const courier = e.target.courier.value;
    const jenis = e.target.jenis.value;
    const province = e.target.province.value;
    const city = e.target.city.value;
    const kecamatan = e.target.road.value;
    const kodepos = e.target.kodepos.value;


    const payment_process = {
        Name: nama,
        courier: courier,
        jenis: jenis,
        province: province,
        city: city,
        kecamatan: kecamatan,
        kodepos: kodepos,
    };

    try {
        const response = await fetch(API_URL+"CheckOut", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${account.acces_token}`
            },
            body: JSON.stringify(payment_process)
        })
        if (!response) {
            throw new Error("FAILED")
        }
        const result = await response.json()
        if (result.statusCode === 401) {
            await Refresh_Token()
            location.href = "/cart"
        } else {
            location.href = "/checkout"
            SetLoading2(true)
            localStorage.setItem('CheckoutData', JSON.stringify(result.data))
        }

    } catch (err) {
        console.log(err.message)
    }
}
const active = (isOrder, ListCartLength, popup, setVisible, popup2) => {
    if (ListCartLength !== 0) {
        popup.current.style.visibility = 'visible';
        setTimeout(() => {
            setVisible(false);
        }, 1000)
    } else {
        popup2.current.style.visibility = isOrder ? 'visible' : 'hidden';
    }
}

const FinishAndClosePoopup = async (popup, listCart, setVisible, SetVisibleForm, SetListCart, SetFinishPay, setTotal, setTotalItem) => {
    setTimeout(async () => {
        popup.current.style.visibility = 'hidden';

        const produk_temp = await GetData();//ambil Data dari API

        const Cart_temp = JSON.parse(localStorage.getItem('Cart'));
        console.log(produk_temp)

        //proses sinkronisasi antara cart user dan stok penjual akan berkurang
        /*
        produk_temp.map((item, index) => {
            listCart.map((item2) => {
                if (item.id === item2.id) {
                    const terbaru = item
                    const index_cart = Cart_temp.findIndex((item_cart) => item_cart.id === item.id)
                    const index_cart_idUser = Cart_temp.findIndex((item_cart) => item_cart.user === item2.user)
                    if (index_cart !== -1 && Cart_temp[index_cart].user !== account.username) {
                        Cart_temp[index_cart].pcs = Cart_temp[index_cart].pcs - item2.pcs
                        if (Cart_temp[index_cart].pcs <= 0) {
                            Cart_temp.splice(index_cart, 1)
                        }
                    }
                    Cart_temp.splice(index_cart_idUser, 1)
                    terbaru.stok[item2.indexCategory] = terbaru.stok[item2.indexCategory] - item2.pcs
                    produk_temp[index] = terbaru
                }
            })

        })
        */

        setVisible(true);
        SetVisibleForm(false);
        SetListCart([]);
        SetFinishPay({});
        setTotal(0);
        setTotalItem(0);
        console.log('oke')

        localStorage.setItem('Cart', JSON.stringify(Cart_temp))
        location.href = "/products"
    }, 100)


}

const MotionMenuCart = (motionLeft, setMotionLeft) => {
    setMotionLeft(motionLeft ?false:true)
       
}

const DeleteCart = async (x, setTotal, setTotalItem, totalPrice, totalItem, SetLoading2) => {
    const account = JSON.parse(localStorage.getItem('account'))
    console.log(account.acces_token)
    try {
        const endpoint = API_URL+`hapusKeranjang/${x}`
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${account.acces_token}`
            }
        })
        if (!response) {
            throw new Error("Gagal Menghapus Data")
        }
        const result = await response.json()
        console.log(result)
        console.log(x)
        SetLoading2(true);

    } catch (e) {
        console.log(e.messages)
    }

}

const SearchCard = (event, GenreData, setGenre) => {
    event.preventDefault;
    const listdataSearch = []
    const x = event.target.value;
    const data = GenreData.slice();

    data.map((item) => {
        if (item.title.includes(x) || item.title.toUpperCase === x.toUpperCase()) {
            listdataSearch.push(item)
        }
    })

    console.log(x)
    if (x === '') {
        setGenre(JSON.parse(sessionStorage.getItem('ProductMaster')))
    } else {
        if (listdataSearch.length !== 0) {
            return setGenre(listdataSearch)
        } else {
            return setGenre(GenreData)
        }
    }
}

const Close = (isOrder, popup2) => {
    popup2.current.style.visibility = isOrder ? 'visible' : 'hidden';
}

const ClosePopup = (e, popup, setVisible, SetVisibleForm) => {
    e.preventDefault();
    popup.current.style.visibility = 'hidden';
    setVisible(true);
    SetVisibleForm(false);
}


const RightOn = (RightIsOn, setRight) => {
    (RightIsOn) ? setRight(false) :
        setTimeout(() => { setRight(true) }, 100)
}

const Active_Nav = (IsOn, setNav) => {
    (IsOn) ? setNav(false)
        : setTimeout(() => { setNav(true) }, 100)
}


const Refresh_Token = async (socket) => {
  
    let account = JSON.parse(localStorage.getItem('account'))
    try {
        const response = await fetch(API_URL+'Get_Acces', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refreshToken: account.refresh_token
            })
        })
        if (!response) {
            throw new Error("Failed")
        }
        const result = await response.json()
        if (response.status === 404) {
            return 404
        }
        console.log(result)
        const acces_token = result.acces_token
        const username = result.username
        account = { ...account, username, acces_token }
        localStorage.setItem('account', JSON.stringify(account))
        socket.emit('Reset',account.username)
        socket.emit('Regist',account.username)

        //reset Chace
        sessionStorage.removeItem('DataAccount')
        sessionStorage.removeItem('ProductUser')
        sessionStorage.removeItem('access')
        sessionStorage.removeItem('ProductMaster')
    } catch (err) {
        console.log(err.message)
    }
}

const GetData = async (username,socket) => {
    try {
        const response = await fetch(API_URL+'MasterData', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${username}`
            }
        });
        if (!response) {
            throw new Error("Gagal Mengambil Data")
        }
        const data = await response.json();
        if (data.statusCode === 401) {
            const get_acces = await Refresh_Token(socket);
            if (get_acces == 404) {
                localStorage.removeItem('account')
                return location.href = "/"
            }
            location.href = "/products"
            return false
        } else {
            return JSON.parse(data.data)
        }
    }
    catch (e) {
        console.log(e.message);
    }
}

const GetdataProdukUser = async (username) => {
    try {
        const endpoint = API_URL+`GetProductSeller`;
        const response = await fetch(endpoint, {
            headers: {
                'Authorization': `Bearer ${username}`
            }
        });
        if (!response) {
            throw new Error("Gagal Mendapatkan DATA");
        }
        const result = await response.json();
        console.log(result)
        return result


    } catch (error) {
        console.log(error.messages)
    }


}



const Get_Cart = async (SetListCart, setSumProcess, setNotifMessage, username) => {
    console.log(username.acces_token)
    try {
        const endpoint = API_URL+`GetCart`
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${username.acces_token}` }
        });
        if (!response) {
            throw new Error("GAGAL MENDAPATKAN CART")
        }
        let result = await response.json()
        if (result.data) {
            console.log(result)
            SetListCart(result.data)
            setSumProcess(result.SumProcessProduct)
            setNotifMessage(result.notifMessage)
            sessionStorage.setItem('SumProcess', JSON.stringify(result.SumProcessProduct))
        }

    } catch (err) {
        console.log(err.message)
    }
}

const ActionToDeleteCheckoutCart = async (from = "cart") => {
    const account = JSON.parse(localStorage.getItem("account"))
    try {
        const response = await fetch(API_URL+"ActionToDeleteCheckout", {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${account.acces_token}`
            }
        })
        if (!response) {
            throw new Error("Failed To Delete")
        }
        localStorage.removeItem("CheckoutData")
        if (from != "cart") {
            localStorage.removeItem("CheckoutData")
            return location.href = `/${from}`

        }
        localStorage.removeItem("CheckoutData")
        return location.href = "/cart"


    } catch (err) {
        console.log(err.message)
    }
}

const checkId = async (username) => {
    console.log(username)
    const account = JSON.parse(localStorage.getItem('account'))
    try {
        const endpoint = API_URL+`GetDataAccountByUsername/${username}`
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${account.acces_token}`
            }
        });
        if (!response) {
            throw new Error("Gagal Mendapatkan Data Account")
        }
        const result = await response.json();
        if (result.statusCode === 401) {
            await Refresh_Token()
            location.href = "/products"
        }

        return result

    } catch (err) {
        console.log(err)
        return false
    }
}

export {
    active, MotionMenuCart, DeleteCart, SearchCard, Close,
    ClosePopup, FinishAndClosePoopup, process,
    RightOn, Active_Nav, GetData, GetdataProdukUser,
    Get_Cart, Refresh_Token, ActionToDeleteCheckoutCart, 
    checkId,PostDataProduk,UploadImageToAPI,EditMyProduk
}