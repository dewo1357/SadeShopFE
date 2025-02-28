/* eslint-disable react/prop-types */
import Button from "../../Component/Element/Button/Button";
import Input from "../../Component/Element/Input/Input";

const ConfirmModal = ({ Confirm, isLoading, isFinish, Message, CheckPass, Reset }) => {
    return (
        <div ref={Confirm} className="overlay3">
            <div className="InsertPass" hidden={isLoading ? true : false}>
                <h1>Masukan Password</h1>
                <form onSubmit={CheckPass} action="">
                    <Input name="pass" type="password" />
                    <Button ContentButton="Start To Setting"/>
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
                        <img src="/Images/Smilee.png" alt="" width="200" />
                        <Button action={Reset} ContentButton="Oke"></Button>
                    </div>
                }
            </div>
        </div>
    );
};

export default ConfirmModal;