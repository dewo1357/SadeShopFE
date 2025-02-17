import { useState, useRef } from "react"
import Button from "../Component/Element/Button/Button"
import Input from "../Component/Element/Input/Input"
import { useSocket } from "../SocketProvider"
import { Refresh_Token } from "./manage"
import { API_URL } from "../../config"

const SettingPages = () => {
    const socket = useSocket();

    const account = JSON.parse(localStorage.getItem('account'))
    const [active, setActive] = useState(Array(4).fill(false))
    const [checkIndex, setCheckIndex] = useState(null)
    const Confirm = useRef();

    //Menampung Nilai yang ingin dirubah
    const [value, setValue] = useState(null)

    //menampung Nilai Category apa yang dirubah. karena pada proses input, 
    // event form juga mendefenisikan kategori nilai yang ingin disimpan
    // nilai ini di proses pada fungsi StartToSetting()
    const [category, SetCategory] = useState(null)


    //action Loading saat KataSandi dimasukan
    const [isLoading, setLoading] = useState(false)

    //action Saat Loading Finish
    const [isFinish, seFinish] = useState(false)

    //Message
    const [Message,setMessage] = useState(null)


    const ShowUpForm = (indexActive = 'menu') => {
        console.log(indexActive)
        console.log(active[indexActive])
        if (indexActive !== 'menu') {
            let tempActiveArray = active.slice()
            if (checkIndex !== indexActive && active[indexActive]) {
                tempActiveArray[indexActive] = active[indexActive] ? false : true
                setCheckIndex(indexActive)
                setActive(tempActiveArray)
            } else {
                tempActiveArray = Array(4).fill(false)
                tempActiveArray[indexActive] = active[indexActive] ? false : true
                setActive(tempActiveArray)
            }
        }
    }

    const StartToSetting = async (TokenSetting=false,ValuePasss=false) => {
        console.log(category)
        let endpoint = null
        //Kondisi ini adalah nama url endpoint yang diberikan ketika sudah dijalankan
        if (category === 'nama') {
            endpoint = "ChangeName"
        } else if (category === "username") {
            endpoint = "ChangeUsername"
        } else if (category === "AddBio") {
            endpoint = "AddBio"
        }
         else {
            endpoint = "ChangePass"
        }
        try {
            const response = await fetch(API_URL+`${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${account.acces_token}`,
                },
                //jika yang di chage adalah pass, token tidak diperlukan, karena di proses API sudah ada verifikasi pass lama
                body: ValuePasss ? JSON.stringify(ValuePasss) : JSON.stringify({ token: TokenSetting, data: value })
            })
            if (!response) {
                throw new Error("Failed To Change Name")
            }
            const result = await response.json();
            if(result.acces_token){
                socket.emit('Reset', account.username)
            }
            setMessage(result.Message)
            seFinish(true)
        } catch (err) {
            console.log(err.message)
        }
    }

    const CheckPass = async (event) => {
        event.preventDefault();
        setLoading(true)
        const pass = event.target.pass.value
        try {
            const response = await fetch(API_URL+`CheckPass`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${account.acces_token}`,
                },
                body: JSON.stringify({ pass: pass })
            })
            if (!response) {
                throw new Error("Failed To Change Name")
            }
            const result = await response.json();
            console.log(result)
            if (result.PassCorrect) {
                //Jika Pass Benar maka setting user akan di proses.
                StartToSetting(result.TokenSetting);
            }else{
                setMessage(result.Message)
                seFinish(true)
            }

        } catch (err) {
            console.log(err.message)
        }
    }

    const StartToChangeName = (event) => {
        event.preventDefault();
        setValue(event.target.MyName.value)
        SetCategory("nama")
        Confirm.current.style.visibility = "visible"
    }

    const StartToChangePass = async (event) => {
        event.preventDefault();
        setLoading(true)
        await StartToSetting(false,{
            oldPassword: event.target.oldPassword.value,
            newPassword: event.target.newPassword.value,
            newPassword2: event.target.newPassword.value
        });
        Confirm.current.style.visibility = "visible"
    }

    const StartToChangeUsername = (event) => {
        event.preventDefault();
        setValue(event.target.username.value)
        SetCategory("username")
        Confirm.current.style.visibility = "visible"
    }

    const StartToAddBio = (event) => {
        event.preventDefault();
        setValue(event.target.Bio.value)
        SetCategory("AddBio")
        Confirm.current.style.visibility = "visible"
    }

    const Reset = async ()=>{
        await Refresh_Token(socket);
        SetCategory(null)
        setValue(null)
        setLoading(false)
        seFinish(false)
        Confirm.current.style.visibility='hidden'
        location.href="SettingPages"
        
    }


    return (
        <div>
            <div className="headSetting">
                <a href="/products"><h1>Back</h1></a>
                <h1>SadeShop.com</h1>
            </div>
            <div className="SettingContainer">
                <div>
                    <div className="SettingMenu" >
                        <div className="SettingMenu HeaderSetting">
                            <h2>Menu Setting</h2>
                        </div>
                        <Button action={() => ShowUpForm('SecurityAccount')} ContentButton="Security Account"></Button>
                        <Button ContentButton="Location Account"></Button>
                    </div>
                </div>
                <div className="PrevieSetting">
                    <h1>
                        Profile Setting
                    </h1>
                    <div id="SecurityAccount" >
                        <button onClick={() => ShowUpForm(0)}>
                            <div className="ContentButton">
                                <h2>
                                    Add Bio
                                </h2>
                                <img src="/Images/arrow-point-to-right.png" alt="" width="30" height="30" />
                            </div>
                        </button>
                        <div id="Bio" className={`FormSetting ${active[0] ? "OnFormSetting" : ""}`}>
                            <h1>Add Bio</h1>
                            <form onSubmit={StartToAddBio} action="">
                                <label htmlFor="">Bio</label>
                                <br />
                                <textarea name="Bio" placeholder="Enter your Bio"></textarea>
                                <Button ContentButton="Add Bio" ></Button>
                            </form>
                        </div>
                        <button onClick={() => ShowUpForm(1)} >
                            <div className="ContentButton">
                                <h2>
                                    Username
                                </h2>
                                <img src="/Images/arrow-point-to-right.png" alt="" width="30" height="30" />
                            </div>
                        </button>
                        <div id='Username' className={`FormSetting ${active[1] ? " OnFormSetting" : ""}`} >
                            <h1>Change Username</h1>
                            <form onSubmit={StartToChangeUsername} action="">
                                <label htmlFor="">Username</label>
                                <Input onChange name="username" placeholder="Enter your new username"></Input>
                                <Button ContentButton="Save" ></Button>
                            </form>
                        </div>
                        <button onClick={() => ShowUpForm(2)} >
                            <div className="ContentButton">
                                <h2>
                                    Change Name
                                </h2>
                                <img src="/Images/arrow-point-to-right.png" alt="" width="30" height="30" />
                            </div>
                        </button>
                        <div id="name" className={`FormSetting ${active[2] ? "OnFormSetting" : ""}`}>
                            <h1>Change Your Name</h1>
                            <form onSubmit={StartToChangeName} action="">
                                <label htmlFor="">Name</label>
                                <Input name="MyName" placeholder="Enter Your new name"></Input>
                                <Button ContentButton="Save" ></Button>
                            </form>
                        </div>
                        <button onClick={() => ShowUpForm(3)} >
                            <div className="ContentButton">
                                <h2>
                                    Change Password
                                </h2>
                                <img src="/Images/arrow-point-to-right.png" alt="" width="30" height="30" />
                            </div>
                        </button>
                        <div id="Password" name="Password" className={`FormSetting ${active[3] ? "OnFormSetting" : ""}`}>
                            <h1>Change Password</h1>
                            <form onSubmit={StartToChangePass} action="">
                                <label htmlFor="">Old Password</label>
                                <Input type="password" name="oldPassword" placeholder="Enter Your Old Password"></Input>
                                <label htmlFor="">New Password</label>
                                <Input type="password" name="newPassword" placeholder="Enter Your New Password"></Input>
                                <label htmlFor="">New Password Verification</label>
                                <Input type="password" name="newPassword2" placeholder="Enter Your New Password"></Input>
                                <Button ContentButton="Save" ></Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div ref={Confirm} className="overlay3 Setting">
                <div className="InsertPass" hidden={isLoading ? true : false}>
                    <h1>Masukan Password</h1>
                    <form onSubmit={CheckPass} action="">
                        <input name="pass" type="password" />
                        <button >Verify My Account</button>
                    </form>
                </div>
                <div className="OverlayLoading" hidden={isLoading ? false : true}>
                    {!isFinish ?
                        <div>
                            <h2>Mohon Ditunggu Ya..😋</h2>
                            <img src="/Images/Loading.gif" alt="" />
                        </div> :
                        <div>
                            <h2>{isFinish ? `${Message}` : "Kata Sandi Anda Salah"}</h2>
                            <img  src="/Images/Smilee.png" alt="" width="200" />
                            <Button action={Reset} ContentButton="Oke"></Button>
                        </div>
                    }

                </div>
            </div>

        </div >
    )
}

export default SettingPages