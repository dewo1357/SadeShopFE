/* eslint-disable react/prop-types */
import Button from "../../Component/Element/Button/Button";
import { useState } from "react";

const RoomChat = ({
    RoomChat, ContactName, index, StartChat, getMyAccount, Room, MyListChat,
    account, sendMyChat, fillText, undisabledbutton, backToListContact, StartToDelete,
    CheckListRoomChat, setCheckListRoomChat, BuildCategoryAction }) => {

    const [currentIndexRoomChat, setCurrentIndexRoomChat] = useState(0)
    return (
        <div ref={RoomChat} className="RoomChat">
            <div style={innerWidth < 700 ? { display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" } : {}}>
                <div className="backButtonRoomChat">
                    <Button styling="btn" action={backToListContact} ContentButton={<img src="/Images/arrow-left_10023749.png" width="30px"></img>}></Button>
                </div>
                <div className="HeaderRoomChat">
                    {ContactName ?
                        <a style={{ textDecoration: "none", color: "black" }} href={`/profil/${ContactName}`}>
                            <h1 style={{ textAlign: "right" }}> {index != null ? ContactName : "Chat Room"}</h1>
                        </a> :
                        <h1 style={{ textAlign: "right", }}> {index != null ? ContactName : "Chat Room"}</h1>}
                </div>
            </div>
            <div className="PrevImageMessage" hidden={index || StartChat ? true : false}>
                <img src="/Images/5664349.jpg" alt="" hidden={index || StartChat ? true : false} />
            </div>

            <div className="ListContactChatContainer" hidden={index || StartChat ? false : true}>
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
                <div ref={Room} className="chattingList" hidden={getMyAccount && !index ? true : !index ? true : false}>
                    {index !== null ? MyListChat[index]['data'].map((item,index) => (
                        <div key={item.idChat} style={{ display: "flex", justifyContent: item.Sender.username === account.username ? "end" : "left" }}>
                            {item.Sender.username === account.username ?
                                <div className="ListContactChat chatRoomList" key={item} style={{ textAlign: "right" }}>
                                    <div>
                                        <div className="optionsChat">
                                            <span>
                                            <img onClick={(e) => BuildCategoryAction(e.target.id, index,CheckListRoomChat, setCheckListRoomChat, currentIndexRoomChat, setCurrentIndexRoomChat)} src="/Images/arrow-point-to-right.png" alt="" id="img2" />
                                            </span>
                                        </div>
                                        <div className="optionChatAction">
                                            <button hidden={CheckListRoomChat[index]?false:true}><img src="/Images/information.png" alt="" /></button>
                                            <button hidden={CheckListRoomChat[index]?false:true} onClick={() => StartToDelete(item.idChat)}><img src="/Images/trash.png" alt="" /></button>
                                        </div>
                                    </div>
                                    <div>
                                        <h2 style={{ textAlign: item.Sender.username === account.username ? "right" : "left" }}>{item.Content}</h2>
                                        <p>{item.CreatedAt}</p>
                                    </div>
                                </div>
                                :
                                <div className="ListContactChat chatRoomList" key={item} style={{ textAlign: "left" }}>
                                    <div>
                                        <h2 style={{ textAlign: item.Sender.username === account.username ? "right" : "left" }}>{item.Content}</h2>
                                        <p>{item.CreatedAt}</p>
                                    </div>
                                    <div>
                                        <div className="optionsChat">
                                            <span>
                                                <img onClick={(e) => BuildCategoryAction(e.target.id, index,CheckListRoomChat, setCheckListRoomChat, currentIndexRoomChat, setCurrentIndexRoomChat)} src="/Images/arrow-point-to-right.png" alt="" id="img2" />
                                            </span>
                                        </div>
                                        <div className="optionChatAction">
                                            <button  hidden={CheckListRoomChat[index]?false:true} onClick={() => StartToDelete(item.idChat)}   ><img src="/Images/trash.png" alt="" /></button>
                                            <button  hidden={CheckListRoomChat[index]?false:true} ><img src="/Images/information.png" alt="" /></button>
                                        </div>
                                    </div>
                                </div>}
                        </div>
                    )) : []}
                </div>
                <form action="" onSubmit={sendMyChat} hidden={index !== null || (StartChat && getMyAccount) ? false : true}>
                    <div className="ActionToSend">
                        <div>
                            <textarea onInput={undisabledbutton} name="textContent" id=""></textarea>
                        </div>
                        <div>
                            <button style={{ backgroundColor: !fillText ? "grey" : false }} type="submit" disabled={fillText ? false : true}>Send</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoomChat;