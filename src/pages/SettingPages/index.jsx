/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../SocketProvider";
import { Refresh_Token,getAcc } from "../manage";
import { API_URL } from "../../../config";
import SettingForm from "./SettingForm";
import ConfirmModal from "./ConfirmModal";

const SettingPages = () => {
    const socket = useSocket();
    const navigate = useNavigate();

    const [account, setAccount] = useState(getAcc());
    const [active, setActive] = useState(Array(4).fill(false));
    const [checkIndex, setCheckIndex] = useState(null);
    const Confirm = useRef();

    const [value, setValue] = useState(null);
    const [category, SetCategory] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [isFinish, seFinish] = useState(false);
    const [Message, setMessage] = useState(null);

    const ShowUpForm = (indexActive = 'menu') => {
        if (indexActive !== 'menu') {
            let tempActiveArray = active.slice();
            if (checkIndex !== indexActive && active[indexActive]) {
                tempActiveArray[indexActive] = active[indexActive] ? false : true;
                setCheckIndex(indexActive);
                setActive(tempActiveArray);
            } else {
                tempActiveArray = Array(4).fill(false);
                tempActiveArray[indexActive] = active[indexActive] ? false : true;
                setActive(tempActiveArray);
            }
        }
    };

    const StartToSetting = async (TokenSetting = false, ValuePasss = false) => {
        let endpoint = null;
        if (category === 'nama') {
            endpoint = "ChangeName";
        } else if (category === "username") {
            endpoint = "ChangeUsername";
        } else if (category === "AddBio") {
            endpoint = "AddBio";
        } else {
            endpoint = "ChangePass";
        }
        try {
            const response = await fetch(API_URL + `${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${account.acces_token}`,
                },
                body: ValuePasss ? JSON.stringify(ValuePasss) : JSON.stringify({ token: TokenSetting, data: value })
            });
            if (!response) {
                throw new Error("Failed To Change Name");
            }
            const result = await response.json();
            if (result.acces_token) {
                socket.emit('Reset', account.username);
            }
            setMessage(result.Message);
            seFinish(true);
        } catch (err) {
            console.log(err.message);
        }
    };

    const CheckPass = async (event) => {
        event.preventDefault();
        setLoading(true);
        const pass = event.target.pass.value;
        try {
            const response = await fetch(API_URL + `CheckPass`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${account.acces_token}`,
                },
                body: JSON.stringify({ pass: pass })
            });
            if (!response) {
                throw new Error("Failed To Change Name");
            }
            const result = await response.json();
            if (result.PassCorrect) {
                StartToSetting(result.TokenSetting);
            } else {
                setMessage(result.Message);
                seFinish(true);
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    const StartToChangeName = (event) => {
        event.preventDefault();
        setValue(event.target.MyName.value);
        SetCategory("nama");
        Confirm.current.style.visibility = "visible";
    };

    const StartToChangePass = async (event) => {
        event.preventDefault();
        setLoading(true);
        await StartToSetting(false, {
            oldPassword: event.target.oldPassword.value,
            newPassword: event.target.newPassword.value,
            newPassword2: event.target.newPassword.value
        });
        Confirm.current.style.visibility = "visible";
    };

    const StartToChangeUsername = (event) => {
        event.preventDefault();
        setValue(event.target.username.value);
        SetCategory("username");
        Confirm.current.style.visibility = "visible";
    };

    const StartToAddBio = (event) => {
        event.preventDefault();
        setValue(event.target.Bio.value);
        SetCategory("AddBio");
        Confirm.current.style.visibility = "visible";
    };

    const Reset = async () => {
        await Refresh_Token(socket);
        SetCategory(null);
        setValue(null);
        setLoading(false);
        seFinish(false);
        Confirm.current.style.visibility = 'hidden';
        location.href = "/";
    };

    return (
        <>
            <div className="headSetting">
                <a href="/"><h1>Back</h1></a>
                <h1>SadeShop.com</h1>
            </div>
            <div className="SettingContainer">
                <SettingForm
                    active={active}
                    ShowUpForm={ShowUpForm}
                    StartToAddBio={StartToAddBio}
                    StartToChangeUsername={StartToChangeUsername}
                    StartToChangeName={StartToChangeName}
                    StartToChangePass={StartToChangePass}
                />
            </div>
            <ConfirmModal
                Confirm={Confirm}
                isLoading={isLoading}
                isFinish={isFinish}
                Message={Message}
                CheckPass={CheckPass}
                Reset={Reset}
            />
        </>
    );
};

export default SettingPages;