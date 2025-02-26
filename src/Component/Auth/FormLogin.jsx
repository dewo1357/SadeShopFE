import Input from '../Element/Input/Input';
import Label from '../Element/Label/Label';
import Button from '../Element/Button/Button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useSocket } from '../../SocketProvider';
import { API_URL } from '../../../config';



const FormLogin = () => {
    const socket = useSocket();
    const navigate = useNavigate();
    const param = new URLSearchParams(window.location.search)
    console.log(API_URL)
    useEffect(() => {
        if (param.get('acces_token')) {
            const DataAccount = {
                'acces_token': param.get('acces_token'),
                'refresh_token': param.get('refresh_token'),
                'username': param.get('username'),
                'new_user': param.get('new_user')
            }
            localStorage.setItem('account', JSON.stringify(DataAccount))
            location.href = "/"

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (localStorage.getItem('account') !== null) {
            navigate("/")
        }
    }, [navigate, socket])
    const account = JSON.parse(localStorage.getItem('ListAccount'))
    console.log(account)
    const [hidden_, setHidden] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [token, SetToken] = useState(null)


    const notificationLogin = useRef();
    const validate_account = async (account) => {
        notificationLogin.current.style.visibility = "visible"
        setProcessLogin(true)
        try {
            const response = await fetch(API_URL + "GetDataAccount", {
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
                return navigate('/')
            }
            setHidden(true)
            notificationLogin.current.style.visibility = "hidden"
        } catch (err) {
            console.log(err.message)
        }
    }

    // eslint-disable-next-line no-unused-vars
    const [ProcessLogin, setProcessLogin] = useState(false)

    const validate = (event) => {
        event.preventDefault();
        const account = {
            username: event.target.username.value,
            kata_sandi: event.target.KataSandi.value
        }
        validate_account(account);
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
                    <div className="Auth" onClick={() => { location.href = API_URL + "AuthenticationGoogle" }} >
                        <img src="/Images/Google_Icon.png" alt="" />
                        <span>Login Gmail</span>
                    </div>
                </form>

            </div>
            <div ref={notificationLogin} className='overlay3'>
                <div className="OverlayLoading">
                    <h2>Mohon Ditunggu<br></br>Sedang Proses Masuk</h2>
                    <img src="/Images/Loading.gif" alt="" />
                </div>
            </div>


        </>
    )
}

export default FormLogin;