/* eslint-disable react-refresh/only-export-components */
import { API_URL } from "../../config";

const PostDataProduk = async (data) => {
    try {
        const account = getAcc()
        const response = await fetch(API_URL + "AddProduct", {
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
    const account = getAcc()
    const files = new FormData()
    files.append('files', file);
    try {
        const response = await fetch(API_URL + "UploadImage", {
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

const EditMyProduk = async (idProduk, data, setFinnalMessage2 = false) => {
    const account = getAcc()
    try {
        const endpoint = API_URL + `EditProduct/${idProduk}`
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
        if (setFinnalMessage2) {
            setFinnalMessage2(false)
        }
    } catch (error) {
        console.log(error.message)
    }

}


const process = async (e, SetLoading2, SetProcessLoading) => {
    SetProcessLoading(true)
    const account = getAcc()
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
        const response = await fetch(API_URL + "CheckOut", {
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
        location.href = "/"
    }, 100)


}

const MotionMenuCart = (motionLeft, setMotionLeft) => {
    setTimeout(() => {
        setMotionLeft(motionLeft ? false : true)
    }, 100)

}

const DeleteCart = async (x, setTotal, setTotalItem, totalPrice, totalItem, SetLoading2) => {
    const account = getAcc()
    console.log(account.acces_token)
    try {
        const endpoint = API_URL + `hapusKeranjang/${x}`
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

const SearchCard = (event, GenreData, setGenre, SetStartToSearch) => {
    event.preventDefault();

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
        SetStartToSearch(false)
    } else {
        if (listdataSearch.length !== 0) {
            SetStartToSearch(true)
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


const Refresh_Token = async (socket = false) => {
    let account = getAcc()
    const response = await fetch(API_URL + 'Get_Acces', {
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
        localStorage.removeItem("account")
        location.href = "/"
        return 404
    }
    console.log(socket)
    if (socket !== false) {
        socket.on('Reset', account.username)
        socket.on('Register', account.username)
        console.log("server diperbarui")
    }
    console.log(result)
    const acces_token = result.acces_token
    const username = result.username
    account = { ...account, username, acces_token }
    localStorage.setItem('account', JSON.stringify(account))

    //reset Chace
    sessionStorage.removeItem('ProductMaster')
}

const GetData = async () => {

    try {
        const response = await fetch(API_URL + 'MasterData', {
            method: 'GET',

        });
        if (!response) {
            throw new Error("Gagal Mengambil Data")
        }
        const data = await response.json();
        return JSON.parse(data.data)
    }
    catch (e) {
        console.log(e.message);
    }
}

const GetdataProdukUser = async (username) => {
    try {
        const endpoint = API_URL + `GetProductSeller`;
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



const Get_Cart = async (SetListCart, setSumProcess, setNotifMessage, socket, SetLoading2) => {
    const account = getAcc();
    try {
        const endpoint = API_URL + `GetCart`
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${account.acces_token}` }
        });
        if (!response) {
            throw new Error("GAGAL MENDAPATKAN CART")
        }

        let result = await response.json()
        if (result.statusCode === 401) {
            return await Refresh_Token(socket)
        }
        console.log(result)
        SetListCart(result.data)
        setSumProcess(result.SumProcessProduct)
        setNotifMessage(result.notifMessage)
        sessionStorage.setItem('SumProcess', JSON.stringify(result.SumProcessProduct))
        SetLoading2(false)
    } catch (err) {
        console.log(err.message)
        location.href = "/"
    }
}

const ActionToDeleteCheckoutCart = async (from = "cart") => {
    const account = getAcc()
    try {
        const response = await fetch(API_URL + "ActionToDeleteCheckout", {
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

const getAcc = () => {
    try {
        const acc = JSON.parse(localStorage.getItem('account'))
        if (acc) {
            return acc
        }
        return false
    } catch (err) {
        localStorage.removeItem('account')
        console.log(err.message)
        return false
    }
}

const checkId = async (username, socket) => {
    const account = getAcc()
    try {
        const endpoint = API_URL + `GetDataAccountByUsername/${username}`
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
            await Refresh_Token(socket)
            location.href = "/login"
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
    checkId, PostDataProduk, UploadImageToAPI, EditMyProduk, getAcc
}