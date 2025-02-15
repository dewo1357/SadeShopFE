import Input from '../Element/Input/Input';
import Label from '../Element/Label/Label';
import Button from '../Element/Button/Button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useSocket } from '../../SocketProvider';



const FormLogin = () => {
    const socket = useSocket();
    const navigate = useNavigate();
    const param = new URLSearchParams(window.location.search)
    useEffect(()=>{
        if(param.get('acces_token')){
            const DataAccount = {
                'acces_token' : param.get('acces_token'),
                'refresh_token' : param.get('refresh_token'),
                'username' : param.get('username'),
                'new_user' : param.get('new_user')
            }
            localStorage.setItem('account',JSON.stringify(DataAccount))
            location.href="/products"

        }else if(param.get('using_other_device')){
            notificationLogin.current.style.visibility = "visible"
            setNotification(true)
            setUsername(param.get('username'))
        }
    },[])

    useEffect(() => {
        if (socket) {
            socket.on("Receive", (data) => {
                SetMessage("Akses Diterima")
                setTimeout(() => {
                    localStorage.setItem('account', JSON.stringify(data))
                    location.href = "/products"
                }, 1000)

            })

            //socket jika ditolak akses
            socket.on('ActTolakAkses', (message) => {
                setTimeout(() => {
                    setNotificationMessage(message)
                    setNotification(true)
                    setAcces(false)

                }, 1000)
            })

        }
        if (localStorage.getItem('account') !== null) {
            navigate("/products")
        }
    }, [navigate, socket])
    const account = JSON.parse(localStorage.getItem('ListAccount'))
    console.log(account)
    const [hidden_, setHidden] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [token, SetToken] = useState(null)

    const [notication, setNotification] = useState(false)
    const notificationLogin = useRef();
    const [getUsername, setUsername] = useState(null)
    const validate_account = async (account) => {
        try {
            const response = await fetch("http://localhost:5000/GetDataAccount", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(account)
            })
            if (!response) {
                throw new Error("GAGAL")
            }
            const result = await response.json()
            if (response.status === 200) {
                localStorage.setItem('account', JSON.stringify(result))
                SetToken(result.acces_token)
                navigate('/products')
            } else if (response.status === 500) {
                notificationLogin.current.style.visibility = "visible"
                setNotification(true)
            } else {
                setHidden(true)
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    const [notificationMessage, setNotificationMessage] = useState("Seseorang Sedang Memakai Account Kamu")
    const [message, SetMessage] = useState("Minta Akses Sedang Di Proses")

    const validate = (event) => {
        event.preventDefault();
        const account = {
            username: event.target.username.value,
            kata_sandi: event.target.KataSandi.value
        }
        setUsername(account.username)
        validate_account(account);
    }

    const closeNotification = () => {
        setNotificationMessage("Seseorang Sedang Memakai Account Kamu")
        setNotification(false)
        notificationLogin.current.style.visibility = "hidden"
    }

    const [Acces, setAcces] = useState(false);
    const MintaAkses = () => {
        setNotification(false)
        setAcces(true)
        socket.emit('SendId', getUsername)
        console.log(getUsername)
    }
    return (
        <>

            <div>
                <span className="Notification" hidden={(hidden_) ? false : true}>Username & Kata Sandi Salah!</span>
                <form action="" onSubmit={validate} method="POST">
                    <div>
                        <Label Content="Username" ></Label>
                        <Input type="Input" placeholder="Masukan Username" name="username"></Input>
                    </div>
                    <div>
                        <Label Content="Kata Sandi" ></Label>
                        <Input type="password" placeholder="****" name="KataSandi"></Input>
                    </div>
                    <Button ContentButton="Login"></Button>
                    <div className="Auth">
                        <span onClick={() => {location.href="http://localhost:5000/AuthenticationGoogle"}}>Login Gmail</span>
                    </div>
                </form>

            </div>
            <div ref={notificationLogin} className='overlay3'>
                <div className={`notificationUserLogin ${notication ? "notificationUserLoginOn" : ""}`} hidden={notication ? false : true}>
                    <h1>
                        {notificationMessage}
                    </h1>
                    <img src="/Images/sad-face_3866923.png" width="150" alt="" />
                    <div className="actionUserLogin">

                        <button onClick={closeNotification}>OK</button>
                        <button onClick={MintaAkses}>Minta Akses</button>
                    </div>
                </div>
                <div className={`notificationUserLogin ${Acces ? "notificationUserLoginOn" : ""}`} hidden={Acces ? false : true}>
                    <h1>
                        {message}
                    </h1>
                    <img src="/Images/Loading.gif" width="50" alt="" />
                    <h2>Click apabila Pengguna Belum Menerima Notifikasi Untuk Meminta Akses</h2>
                    <button onClick={MintaAkses}>Minta Akses Ulang</button>
                </div>
            </div>


        </>
    )
}

export default FormLogin;