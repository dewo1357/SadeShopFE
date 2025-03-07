import { useState, useEffect,useRef } from 'react';
import Input from '../Element/Input/Input';
import Label from '../Element/Label/Label';
import Button from '../Element/Button/Button';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../../config';




const FormRegister = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('account') !== null) {
            navigate("/products")
        }
    }, [navigate])
    const [hidden_, setHidden] = useState(true);
    const [hidden_2, setHidden2] = useState(true);


    const handleLogin = (event) => {
        event.preventDefault();
        notificationLogin.current.style.visibility = "visible"
        const username = event.target.username.value;
        const email = event.target.email.value;
        const nama = event.target.nama.value;
        const kata_sandi = event.target.KataSandi1.value;
        const verif_kata_sandi = event.target.KataSandi2.value;

        const account = {
            username: username,
            email: email,
            nama: nama,
            kata_sandi: kata_sandi,
            kata_sandi2: verif_kata_sandi,
            image: "user.png"
        }
        const AddAccount = async () => {
            try {
                const response = await fetch(API_URL + "AddAccount", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(account)
                })
                console.log(response.status)

                if (!response) {
                    console.log(response.message)
                    throw new Error("Account Gagal Didaftarkan")
                } else if (response.status === 401) {
                    setHidden(false);
                } else if (response.status === 500) {
                    setHidden2(false);
                } else {
                    return navigate('/')
                }
                notificationLogin.current.style.visibility = "hidden"
            } catch (err) {
                console.log(err.message)

            }
        }
        AddAccount();
    }
      const notificationLogin = useRef();

    return (
        <>
            <form action="" onSubmit={handleLogin}>
                <div>
                    <Label Content="Nama Lengkap" ></Label>
                    <Input type="Input" placeholder="Nama Lengkap" name="nama"></Input>
                </div>
                <div>
                    <Label Content="Username" ></Label>
                    <Input type="Input" placeholder="Masukan Username" name="username"></Input>
                    <span className="Notification" hidden={(!hidden_2) ? false : true}>Username Tidak Valid ❗</span>
                </div>
                <div>
                    <Label Content="Email" ></Label>
                    <Input type="email" placeholder="Masukan Username" name="email"></Input>
                </div>
                <div>
                    <Label Content="Kata Sandi" ></Label>
                    <Input type="password" placeholder="****" name="KataSandi1"></Input>
                </div>
                <div>
                    <Label Content="Kata Sandi Verifikasi" ></Label>
                    <Input type="password" placeholder="****" name="KataSandi2"></Input>
                    <span className="Notification" hidden={(!hidden_) ? false : true}>Tidak Sama ❗</span>
                </div>
                <Button ContentButton="Register"  ></Button>
            </form>
            <div ref={notificationLogin} className='overlay3'>
                <div className="OverlayLoading">
                    <h2>Mohon Ditunggu<br></br>Sedang Proses Daftar</h2>
                    <img src="/Images/Loading.gif" alt="" />
                </div>
            </div>

        </>
    )
}



export default FormRegister;