/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { checkId, Refresh_Token, getAcc } from "../manage";
import { useSocket } from "../../SocketProvider";
import PopupNotification from "../../Component/popup/PopupNotifCation";
import { API_URL } from "../../../config";
import DeleteConfirmation from "./DeleteConfirmation"
import RoomChat from "./RoomChat";
import ListContact from "./ListContact";


const Message = (props) => {
    const { StartChat } = props;
    

    const { username } = useParams();
    const [getMyAccount, setMyAccount] = useState(false);
    const [MyRoomChat, SetMyRoomChat] = useState([]);
    const [account, setAccount] = useState(getAcc());
    const [MyListChat, setMyListChat] = useState(false);
    const [process, setProcess] = useState(true);
    const [index, setIndex] = useState(null);
    const [messageTo, setMessageTo] = useState(null);
    const [processChat, setProcessChat] = useState(true);
    const [ContactName, setContactName] = useState(null);
    const [CategoryDelete,setCategoryDelete] = useState(false);

    const socket = useSocket();

    const GetMyRoomChat = async (socket) => {
        try {
            const response = await fetch(API_URL + "GetRoomChat", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${account.acces_token}`,
                },
            });
            if (!response) {
                throw new Error("FAILED TO GET CHAT");
            }
            const result = await response.json();
            if (result.statusCode === 401) {
                await Refresh_Token(socket);
                location.href = "/message";
            }
            SetMyRoomChat(result.data?result.data:[]);
            setMyListChat(result.ListChat?result.ListChat:[]);
            setTimeout(() => {
                Room.current.scrollTop = Room.current.scrollHeight;
            }, 100);
        } catch (err) {
            if (account === null) {
                location.href = "/login";
            }
            console.log(err);
        }
    };

    const Room = useRef();

    useEffect(() => {
        if (socket) {
            socket.on("ReloadMessage", async (idCategory) => {
                Room.current.scrollTop = Room.current.scrollHeight;
                const index = JSON.parse(localStorage.getItem('idCategory'));
                if (index === idCategory) {
                    await checkToRead(idCategory);
                    GetMyRoomChat(socket);
                }
                GetMyRoomChat(socket);
            });
        }
    }, [socket]);

    useEffect(() => {
        if (StartChat && processChat && socket) {
            setTimeout(async () => {
                if (StartChat) {
                    if (innerWidth < 900) {
                        roomChat.current.style.visibility = "visible";
                        listContact.current.style.display = "none";
                    }
                    const GetAccount = await checkId(username, socket);
                    if (GetAccount) {
                        setMyAccount(GetAccount.account);
                        setMessageTo(GetAccount.account.id);
                    }
                    if (MyRoomChat.length !== 0) {
                        console.log(MyRoomChat)
                        MyRoomChat.map((item) => {
                            if (item.usernameSend.username === GetAccount.account.username || item.userReceive.username === GetAccount.account.username) {
                                setIndex(item.idCategory);
                                setContactName(item.usernameSend.username === account.username ? item.userReceive.username : item.usernameSend);
                                checkChatBasedOnIndex(item.idCategory,
                                    item.userReceive.username === account.username ?
                                        item.SenderAccountID : item.ReceiveAccountID,
                                    item.usernameSend.username === account.username ?
                                        item.userReceive.username : item.usernameSend.username,
                                    true);
                                setProcessChat(false);
                                return;
                            }
                        });
                    }
                }
            }, 100);
        }
    }, [MyRoomChat]);

    useEffect(() => {
        if (process && socket) {
            GetMyRoomChat(socket);
            setProcess(false);
        }
    }, [process, socket]);

    const [isDelete, setIsDelete] = useState(false);
    const [idChat, setidChat] = useState(false);
    const [isLoading, setisLoading] = useState(false);

    const StartToDelete = (idChat,Category=false) => {
        if(Category){
            setCategoryDelete(true)
        }
        console.log(idChat)
        setIsDelete(true);
        setidChat(idChat);
        NotifDelete.current.style.visibility = "visible";
    };

    const CancelToDeleteChat = () => {
        setIsDelete(false);
        NotifDelete.current.style.visibility = "hidden";
    };

    const navigate = useNavigate();
    const deleteMessage = async () => {
        setIsDelete(false);
        setisLoading(true);
        let endPointURL = "DeleteChat"
        if(CategoryDelete){
            endPointURL = "deleteCategoryChat"
            setCategoryDelete(false)
        }
        
        try {
            const response = await fetch(API_URL + `${endPointURL}/${idChat}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${account.acces_token}`,
                },
            });
            if (!response) {
                throw new Error("Failed");
            }
            const result = await response.json();
            
        } catch (err) {
            console.log(err.message);
        }
        await GetMyRoomChat(socket);
        setIsDelete(false);
        NotifDelete.current.style.visibility = "hidden";
        setisLoading(false);
        if(endPointURL == "deleteCategoryChat" && StartChat){
            location.href="/message/"+username
        }else{
            setIndex(false)
            location.href="/message/"
        }
            
    };

    const checkToRead = async (index) => {
        const response = await fetch(API_URL + "CheckToRead/" + index, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${account.acces_token}`,
            },
        });
        const result = await response.json();
        if (result.statusCode === 401) {
            await Refresh_Token(socket);
            location.href = "/message";
        }
        setProcess(false);
    };

    const roomChat = useRef();
    const listContact = useRef();

    const checkChatBasedOnIndex = async (index, To, ContactName, fromProses = false) => {
        if (innerWidth < 900) {
            roomChat.current.style.visibility = "visible";
            listContact.current.style.display = "none";
        }
        setTimeout(() => {
            Room.current.scrollTop = Room.current.scrollHeight;
            Room.current.style.opacity = 1;
        }, 10);
        setIndex(index);
        setMessageTo(To);
        setContactName(ContactName);
        checkToRead(index);
        localStorage.setItem('idCategory', JSON.stringify(index));
        if (fromProses) {
            setTimeout(() => {
                GetMyRoomChat(socket);
            }, 100);
        }
    };

    const sendMyChat = async (e) => {
        e.preventDefault();
        if(!StartChat){
            await checkToRead(index);
        }
        const Message = {
            Text: e.target.textContent.value,
            to: messageTo,
            idCategoryRoomChat: StartChat ? false : index
        };
        e.target.textContent.value = "";
        try {
            const response = await fetch(API_URL + "Chatting", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${account.acces_token}`,
                },
                body: JSON.stringify(Message)
            });
            const result = await response.json();
            if (result.statusCode === 401) {
                await Refresh_Token(socket);
                location.href = "/message";
            }
            await GetMyRoomChat(socket);
        } catch (err) {
            console.log(err.message);
            return false;
        }
    };

    const NotifDelete = useRef();

    const [fillText, setFilltext] = useState(false);
    const undisabledbutton = (e) => {
        if (e.target.value !== "") {
            setFilltext(true);
        } else {
            setFilltext(false);
        }
    };

    const [popupConfirm, setpopupconfirm] = useState(false);
    const [popupConfirm2, setpopupconfirm2] = useState(false);
    const [message, setMessage] = useState(null);

    const backToListContact = () => {
        roomChat.current.style.visibility = "hidden";
        listContact.current.style.display = "block";
    };

    return (
       MyListChat ?
            <>
                <PopupNotification
                    popupConfirm={popupConfirm}
                    popupConfirm2={popupConfirm2}
                    setMessage={setMessage}
                />
                <div className="MessageContainer">
                    <ListContact
                        MyRoomChat={MyRoomChat}
                        MyListChat={MyListChat}
                        account={account}
                        checkChatBasedOnIndex={checkChatBasedOnIndex}
                        StartToDelete={StartToDelete}
                        ListContact={listContact}
                    />
                    <RoomChat
                        RoomChat={roomChat}
                        ContactName={ContactName}
                        index={index}
                        StartChat={StartChat}
                        getMyAccount={getMyAccount}
                        Room={Room}
                        MyListChat={MyListChat}
                        account={account}
                        sendMyChat={sendMyChat}
                        fillText={fillText}
                        undisabledbutton={undisabledbutton}
                        backToListContact={backToListContact}
                        StartToDelete={StartToDelete}
                    />
                    <DeleteConfirmation
                        NotifDelete={NotifDelete}
                        isDelete={isDelete}
                        isLoading={isLoading}
                        deleteMessage={deleteMessage}
                        CancelToDeleteChat={CancelToDeleteChat}
                    />
                </div>
            </>
            :

            <center>
                <div>
                    <h1 style={{ fontFamily: "monospace" }}>Memproses..</h1>
                    <img src="/Images/Loading.gif" width="100" alt="" />
                </div>
            </center>
    
    );
};

export default Message;