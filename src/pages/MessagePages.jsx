/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useState } from "react"
import { useParams } from "react-router-dom"
import { checkId, Refresh_Token, getAcc } from "./manage";
import { useRef } from "react";
import { useSocket } from "../SocketProvider";
import PopupNotification from "../Component/popup/PopupNotifCation";
import { API_URL } from "../../config";
import Button from "../Component/Element/Button/Button";

const Mesage = (props) => {
    const { StartChat } = props;

    const { username } = useParams();
    const [getMyAccount, setMyAccount] = useState(false);
    const [MyRoomChat, SetMyRoomChat] = useState([]);
    const [account, setAccount] = useState(getAcc())
    const [MyListChat, setMyListChat] = useState(false);
    const [process, setProcess] = useState(true)
    const [index, setIndex] = useState(null)
    const [messageTo, setMessageTo] = useState(null)
    const [processChat, setProcessChat] = useState(true)
    const [ContactName, setContactName] = useState(null)

    const socket = useSocket();

    const GetMyRoomChat = async (socket) => {
        try {
            const response = await fetch(API_URL + "GetRoomChat", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${account.acces_token}`,
                },
            })
            if (!response) {
                throw new Error("FAILED TO GET CHAT");

            }
            const result = await response.json();
            if (result.statusCode === 401) {
                await Refresh_Token(socket);

            }
            SetMyRoomChat(result.data)
            setMyListChat(result.ListChat)
            console.log(result.data)
            console.log(result.ListChat)
            if (index) {
                setTimeout(() => {
                    Room.current.scrollTop = Room.current.scrollHeight;
                }, 100)
            }
        } catch (err) {
            if (account === null) {
                location.href = "/"
            }
            console.log(err)
        }

    }
    const Room = useRef();

    useEffect(() => {
        if (socket) {
            console.log(index)
            socket.on("ReloadMessage", async (idCategory) => {
                Room.current.scrollTop = Room.current.scrollHeight;
                const index = JSON.parse(localStorage.getItem('idCategory'))
                console.log(index)
                if (index === idCategory) {
                    await checkToRead(idCategory)
                    GetMyRoomChat(socket)
                }
                GetMyRoomChat(socket)
            })

            try {
                if (account.isRegist) {
                    if (socket) {
                        console.log(account)
                        socket.emit("RegistRoomChat", {
                            'username': account.username,
                            'id': account.id
                        });
                        const data = { ...account, isRegist: false }
                        localStorage.setItem('account', JSON.stringify(data))
                    }
                }
            } catch (err) {
                if (account === 'undefined') {
                    location.href = "/"
                }
            }

            socket.on("AskAcces", (message) => {
                setAcces(true)
                ConfirmBack.current.style.visibility = "visible"
            })
        }
    }, [socket])


    useEffect(() => {
        if (StartChat && processChat && socket) {
            setTimeout(async () => {
                if (StartChat) {
                    if (innerWidth < 900) {
                        RoomChat.current.style.visibility = "visible"
                        ListContact.current.style.display = "none"
                    }
                    const GetAccount = await checkId(username, socket);
                    if (GetAccount) {
                        setMyAccount(GetAccount.account);
                        setMessageTo(GetAccount.account.id)
                    }
                    if (MyRoomChat.length !== 0) {
                        MyRoomChat.map((item) => {
                            console.log(item)
                            if (item.usernameSend.username === GetAccount.account.username || item.userReceive.username === GetAccount.account.username) {
                                setIndex(item.idCategory)
                                setContactName(item.usernameSend.username === account.username ? item.userReceive.username : item.usernameSend)

                                checkChatBasedOnIndex(item.idCategory,
                                    item.userReceive.username === account.username ?
                                        item.SenderAccountID : item.ReceiveAccountID,

                                    item.usernameSend.username === account.username ?
                                        item.userReceive.username : item.usernameSend.username,
                                    true)
                                setProcessChat(false)
                                return
                            } else {
                                console.log("tidak bisa")
                            }
                        })
                    }

                }
            }, 1000)

        }

    }, [MyRoomChat])

    useEffect(() => {
        if (process && socket) {
            if (JSON.parse(localStorage.getItem('CheckoutData'))) {
                ConfirmBack.current.style.visibility = "visible";
                setTimeout(() => {
                    setpopupconfirm(true)
                })
            }
            GetMyRoomChat(socket);
            setProcess(false)
        }
    }, [process, socket])

    const [isDelete, setIsDelete] = useState(false)
    const [idChat, setidChat] = useState(false)
    const [isLoading, setisLoading] = useState(false)
    const StartToDelete = (idChat) => {
        setIsDelete(true)
        setidChat(idChat)
        ConfirmBack.current.style.visibility = "visible"
    }

    const CancelToDeleteChat = () => {
        setIsDelete(false)
        ConfirmBack.current.style.visibility = "hidden"
    }

    const deleteMessage = async () => {
        setIsDelete(false)
        setisLoading(true)
        try {
            const response = await fetch(API_URL + `DeleteChat/${idChat}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${account.acces_token}`,
                },
            })
            if (!response) {
                throw new Error("Failed")
            }
            const result = await response.json()
            console.log(result)
        } catch (err) {
            console.log(err.message)
        }
        await GetMyRoomChat(socket);
        setIsDelete(false)
        ConfirmBack.current.style.visibility = "hidden"
        setisLoading(false)
    }


    const checkToRead = async (index) => {
        const response = await fetch(API_URL + "CheckToRead/" + index, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${account.acces_token}`,
            },
        })
        const result = await response.json();
        if (result.statusCode === 401) {
            await Refresh_Token(socket);
            location.href = "/message"
        }
        setProcess(false)
    }

    const RoomChat = useRef();
    const ListContact = useRef();
    const checkChatBasedOnIndex = async (index, To, ContactName, fromProses = false) => {
        if (innerWidth < 900) {
            RoomChat.current.style.visibility = "visible"
            ListContact.current.style.display = "none"
        }
        setTimeout(() => {
            Room.current.scrollTop = Room.current.scrollHeight;
            Room.current.style.opacity = 1;
        }, 10);
        setIndex(index)
        setMessageTo(To)
        setContactName(ContactName)
        checkToRead(index)
        console.log(To)

        localStorage.setItem('idCategory', JSON.stringify(index))
        if (fromProses) {
            setTimeout(() => {
                GetMyRoomChat(socket)
            }, 100);
        }
    }

    const sendMyChat = async (e) => {

        e.preventDefault();
        await checkToRead(index)
        const Message = {
            Text: e.target.textContent.value,
            to: messageTo,
            idCategoryRoomChat: StartChat ? false : index
        }
        e.target.textContent.value = ""
        try {
            const response = await fetch(API_URL + "Chatting", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${account.acces_token}`,
                },
                body: JSON.stringify(Message)
            })
            const result = await response.json();
            if (result.statusCode === 401) {
                await Refresh_Token(socket);


            }
            await GetMyRoomChat(socket);


        } catch (err) {
            console.log(err.message)
            return false
        }
    }

    const ConfirmBack = useRef();
    const [Acces, setAcces] = useState(false)
    const [notificationSeller, setnotificationSeller] = useState(false)

    const sendInformationAccount = () => {
        socket.emit('Send', {
            data: getAcc()
        })
        setnotificationSeller(false)
        ConfirmBack.current.style.visibility = 'hidden'
    }

    const Abaikan = () => {
        ConfirmBack.current.style.visibility = "hidden"
        setnotificationSeller(false)
    }

    const close = () => {
        ConfirmBack.current.style.visibility = "hidden"
        socket.emit('TolakAkses', account.username)
    }

    const [fillText, setFilltext] = useState(false)
    const undisabledbutton = (e) => {
        console.log(e.target.value)
        if (e.target.value !== "") {
            setFilltext(true)
        } else {
            setFilltext(false)
        }
    }


    const [popupConfirm, setpopupconfirm] = useState(false)
    const [popupConfirm2, setpopupconfirm2] = useState(false)
    const [message, setMessage] = useState(null)

    const backToListContact = () => {
        RoomChat.current.style.visibility = "hidden"
        ListContact.current.style.display = "block"
    }



    return (
        MyListChat ?
            <div className="MessageContainer">
                <div className="CategoryChatRoom" ref={ListContact}  >
                    <div className="ListChat">
                        <a style={{ textDecoration: "none", color: "black" }} href="/products"><h1>Back</h1></a>
                        <h1>List Chat</h1>
                    </div>
                    <div className="ListContactChatContainer" >
                        {MyRoomChat.map((item, index) => (
                            <div onClick={() => {
                                checkChatBasedOnIndex(item.idCategory,
                                    item.userReceive.username === account.username ?
                                        item.SenderAccountID : item.ReceiveAccountID,

                                    item.userReceive.username === account.username ?
                                        item.usernameSend.username : item.userReceive.username)
                            }}
                                key={item.idCategory} className="ListContactChat"
                                style={{
                                    backgroundColor: item.userReceive.username === account.username && item.isAllRead == 'false' ? "grey" : false,

                                }}>
                                <img src={`https://qcgtgzcrwkdtkzzgkclh.supabase.co/storage/v1/object/public/ProfilePicture/${item.userReceive.username !== account.username ? item.PictReceive.image : item.PictSend.image}`} alt="" width="100" height="100" />
                                <div >
                                    <div className="ListContact">
                                        <h2>{item.userReceive.username === account.username ? item.usernameSend.username : item.userReceive.username}</h2>
                                        <h3>{item.nUnRead !== 0 ? item.nUnRead : ""}</h3>
                                    </div>
                                    <div>
                                        <p>{item.LastContent}</p>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
                <div ref={RoomChat} className="RoomChat">
                    <div style={innerWidth < 700 ? { display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" } : {}}>
                        <div className="backButtonRoomChat">
                            <Button styling="btn" action={backToListContact} ContentButton={<img src="/Images/arrow-left_10023749.png" width="30px"></img>}></Button>
                        </div>
                        <div>
                            {ContactName ?
                                <a style={{ textDecoration: "none", color: "black", fontSize: innerWidth < 700 ? "10px" : "20px" }} href={`/profil/${ContactName}`}>
                                    <h1 style={{ textAlign: "right" }} > {index != null ? ContactName : "Chat Room"}</h1>
                                </a> :
                                <h1 style={{ textAlign: "right" }} > {index != null ? ContactName : "Chat Room"}</h1>}
                        </div>
                    </div>
                    <div className="PrevImageMessage" hidden={index || StartChat ? true : false}>
                        <img src="/Images/5664349.jpg" alt="" hidden={index || StartChat ? true : false} />
                    </div>

                    <div className="ListContactChatContainer" hidden={index || StartChat ? false : true} >
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} hidden={StartChat && getMyAccount ? true : false}>
                            <img src="/Images/Loading.gif" alt="" width="100px" hidden={StartChat && getMyAccount ? true : !StartChat ? true : false} />
                        </div>

                        <div hidden={(StartChat && getMyAccount) && !index ? false : true}>
                            <div className="ProfileInfoChat">
                                <img src={`https://qcgtgzcrwkdtkzzgkclh.supabase.co/storage/v1/object/public/ProfilePicture/${getMyAccount ? getMyAccount.image : ""}`} alt="" />
                            </div>
                            <div className="ProfileChatInfo">
                                <div>
                                    <h1>{getMyAccount ? getMyAccount.nama : ""} </h1>
                                </div>
                                <div>
                                    <p>{getMyAccount ? `${getMyAccount.username}` : ""} <br></br> {getMyAccount ? getMyAccount.province : ""} , Kota {getMyAccount ? getMyAccount.city : ""}  {getMyAccount ? getMyAccount.road : ""}  {getMyAccount ? getMyAccount.postalCode : ""}  </p>
                                </div>
                            </div>
                        </div>
                        <div ref={Room} className="chattingList " hidden={getMyAccount && !index ? true : !index ? true : false} >
                            {index !== null ? MyListChat[index].data.map((item) => (
                                <div key={item.idChat} style={{ display: "flex", justifyContent: item.Sender.username === account.username ? "end" : "left" }}>
                                    {item.Sender.username === account.username ?
                                        <div className="ListContactChat chatRoomList" key={item} >
                                            <div>
                                                <div className="optionsChat">
                                                    <span>
                                                        <img src="/Images/arrow-point-to-right.png" alt="" />
                                                    </span>
                                                </div>
                                                <div className="optionChatAction" >
                                                    <button><img src="/Images/information.png" alt="" /></button>
                                                    <button onClick={() => StartToDelete(item.idChat)}><img src="/Images/trash.png" alt="" /></button>
                                                </div>
                                            </div>
                                            <div  >
                                                <h2 style={{ textAlign: item.Sender.username === account.username ? "right" : "left" }}>{item.Content}</h2>
                                                <p style={{ fontSize: "10px" }}>{item.CreatedAt}</p>
                                            </div>
                                        </div>
                                        : <div className="ListContactChat chatRoomList" key={item} >
                                            <div>
                                                <h2 style={{ textAlign: item.Sender.username === account.username ? "right" : "left" }}>{item.Content}</h2>
                                                <p>{item.CreatedAt}</p>
                                            </div>
                                            <div>
                                                <div className="optionsChat">
                                                    <span>
                                                        <img src="/Images/arrow-point-to-right.png" alt="" />
                                                    </span>
                                                </div>
                                                <div className="optionChatAction" >
                                                    <button onClick={() => StartToDelete(item.idChat)}><img src="/Images/trash.png" alt="" /></button>
                                                    <button><img src="/Images/information.png" alt="" /></button>
                                                </div>
                                            </div>
                                        </div>}
                                </div>

                            )) : []}
                        </div>
                        <form action="" onSubmit={sendMyChat} hidden={index !== null || (StartChat && getMyAccount) ? false : true}>
                            <div className="ActionToSend" >
                                <div >
                                    <textarea onInput={undisabledbutton} name="textContent" id=""></textarea>
                                </div>
                                <div>
                                    <button style={{ backgroundColor: !fillText ? "grey" : false }} type="submit" disabled={fillText ? false : true}>Send</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div ref={ConfirmBack} className="overlay3">
                    <div className={`SellerNotification Account ${isDelete ? "AccountOn" : ""}`} hidden={isDelete ? false : true}>
                        <div>
                            <h1>Apakah Anda Yakin Menghapus Chat?</h1>
                        </div>

                        <h3>Jika Iya, Maka Data akan terhapus.</h3>

                        <div className="ConfirmBackToCartAction">
                            <button onClick={deleteMessage}>Tetap Hapus</button>
                            <button onClick={CancelToDeleteChat} >Tolak</button>
                        </div>
                    </div>
                    <div className="OverlayLoading" hidden={isLoading ? false : true}>
                        <h2>Mohon Ditunggu Ya..😋</h2>
                        <img src="/Images/Loading.gif" alt="" />
                    </div>


                </div>
                <PopupNotification
                    socket={socket}
                    popupConfirm={popupConfirm}
                    popupConfirm2={popupConfirm2}
                    setMessage={setMessage}
                />
            </div> :
            <center>
                <div>
                    <h1 style={{ fontFamily: "monospace" }}>Memproses..</h1>
                    <img src="/Images/Loading.gif" width="100" alt="" />
                </div>
            </center>
    )
}

export default Mesage