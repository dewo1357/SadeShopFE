/* eslint-disable react/prop-types */

const DeleteConfirmation = ({ NotifDelete, isDelete, isLoading, deleteMessage, CancelToDeleteChat }) => {
    return (
        <div ref={NotifDelete} className="loading">
            <div className={`SellerNotification Account ${isDelete ? "AccountOn" : ""}`} hidden={isDelete ? false : true}>
                <div>
                    <h1>Apakah Anda Yakin Menghapus Chat?</h1>
                </div>
                <h3>Jika Iya, Maka Data akan terhapus.</h3>
                <div className="ConfirmBackToCartAction">
                    <button onClick={deleteMessage}>Tetap Hapus</button>
                    <button onClick={CancelToDeleteChat}>Tolak</button>
                </div>
            </div>
            <div className="OverlayLoading" hidden={isLoading ? false : true}>
                <h2>Mohon Ditunggu Ya..😋</h2>
                <img src="/Images/Loading.gif" alt="" />
            </div>
        </div>
    );
};

export default DeleteConfirmation;