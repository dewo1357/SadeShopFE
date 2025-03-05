/* eslint-disable react/prop-types */
import Button from "../../Component/Element/Button/Button";
const ListContact = ({ MyRoomChat, account, checkChatBasedOnIndex, ListContact, MyListChat, deleteMessage }) => {
    console.log(MyListChat)
    return (
        <div className="CategoryChatRoom" ref={ListContact}>
            <div className="ListChat">
                <a style={{ textDecoration: "none", color: "black" }} href="/"><h1>Back</h1></a>
                <h1>List Chat</h1>
            </div>
            <div className="ListContactChatContainer">
                {MyRoomChat.map((item) => (
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
                        <div>
                            <div className="ListContact">
                                <div style={{display:"flex",justifyContent:"space-between"}}>
                                    <h2>{item.userReceive.username === account.username ? item.usernameSend.username : item.userReceive.username}</h2>
                                    <h3>{item.nUnRead !== 0 ? item.nUnRead : ""}</h3>
                                </div>
                                <div>
                                    <p>{MyListChat[item.idCategory]['data'][MyListChat[item.idCategory]['data'].length - 1]['Content']}</p>
                                </div>
                            </div>

                        </div>
                        <div className="optionsChat">
                            <span>
                                <img src="/Images/arrow-point-to-right.png" alt="" />
                            </span>
                            <div className="category">
                                <button>Delete</button>
                                <button>Info</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListContact;