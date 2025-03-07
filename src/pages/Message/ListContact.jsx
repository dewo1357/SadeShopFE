/* eslint-disable react/prop-types */
import { useState } from "react";
const ListContact = ({ MyRoomChat, account, checkChatBasedOnIndex, ListContact, MyListChat, 
    StartToDelete,CheckListContact,SetCheckListContact,BuildCategoryAction }) => {
    const [currentIndex,setCurrentIndex] = useState(0)
    
    return (
        <div className="CategoryChatRoom" ref={ListContact}>
            <div className="ListChat">
                <a style={{ textDecoration: "none", color: "black" }} href="/"><h1>Back</h1></a>
                <h1>List Chat</h1>
            </div>
            <div className="ListContactChatContainer">
                {MyRoomChat.map((item,index) => (
                    <div className="ListContactChat" id="ListContact" onClick={(e) =>
                        checkChatBasedOnIndex(e.target.id,item.idCategory,
                            item.userReceive.username === account.username ?
                                item.SenderAccountID : item.ReceiveAccountID,
                            item.userReceive.username === account.username ?
                                item.usernameSend.username : item.userReceive.username)
                    }
                        key={item.idCategory} 
                        style={{
                            backgroundColor: item.userReceive.username === account.username && item.isAllRead == 'false' ? "grey" : false,
                        }}
                    >
                        <img id="ListContact" src={`https://qcgtgzcrwkdtkzzgkclh.supabase.co/storage/v1/object/public/ProfilePicture/${item.userReceive.username !== account.username ? item.PictReceive.image : item.PictSend.image}`} alt="" width="100" height="100" />
                        <div>
                            <div id="ListContact" className="ListContact">
                                <div id="ListContact" style={{ display: "flex", justifyContent: "space-between" }}>
                                    <h2>{item.userReceive.username === account.username ? item.usernameSend.username : item.userReceive.username}</h2>
                                    <h3>{item.nUnRead !== 0 ? item.nUnRead : ""}</h3>
                                </div>
                                <div>
                                    <p>{MyListChat[item.idCategory]['data']!=='undefined' ? MyListChat[item.idCategory]['data'][MyListChat[item.idCategory]['data'].length - 1]['Content'] : ""}</p>
                                </div>
                            </div>
                        </div>
                        <div className="optionsChat categoryChat">
                            <span>
                                <img onClick={(e)=>BuildCategoryAction(e.target.id,index,CheckListContact,SetCheckListContact,currentIndex,setCurrentIndex)} id="img" src="/Images/arrow-point-to-right.png" alt="" />
                            </span>
                            <div className="category"    >
                                <button onClick={() => StartToDelete(item.idCategory, true)} hidden={CheckListContact[index]?false:true}>Delete</button>
                                <button hidden={CheckListContact[index]?false:true}>Info</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListContact;