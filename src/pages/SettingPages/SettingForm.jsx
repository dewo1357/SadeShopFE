/* eslint-disable react/prop-types */
import Button from "../../Component/Element/Button/Button";
import Input from "../../Component/Element/Input/Input";

const SettingForm = ({ active, ShowUpForm, StartToAddBio, StartToChangeUsername, StartToChangeName, StartToChangePass }) => {
    return (
        <div className="PrevieSetting">
            <h1>Profile Setting</h1>
            <div id="SecurityAccount">
                <button onClick={() => ShowUpForm(0)}>
                    <div className="ContentButton">
                        <h2>Add Bio</h2>
                        <img src="/Images/arrow-point-to-right.png" alt="" width="30" height="30" />
                    </div>
                </button>
                <div id="Bio" className={`FormSetting ${active[0] ? "OnFormSetting" : ""}`}>
                    <h1>Add Bio</h1>
                    <form onSubmit={StartToAddBio} action="">
                        <label htmlFor="">Bio</label>
                        <br />
                        <textarea name="Bio" placeholder="Enter your Bio"></textarea>
                        <Button ContentButton="Add Bio"></Button>
                    </form>
                </div>
                <button onClick={() => ShowUpForm(1)}>
                    <div className="ContentButton">
                        <h2>Username</h2>
                        <img src="/Images/arrow-point-to-right.png" alt="" width="30" height="30" />
                    </div>
                </button>
                <div id='Username' className={`FormSetting ${active[1] ? " OnFormSetting" : ""}`}>
                    <h1>Change Username</h1>
                    <form onSubmit={StartToChangeUsername} action="">
                        <label htmlFor="">Username</label>
                        <Input onChange name="username" placeholder="Enter your new username"></Input>
                        <Button ContentButton="Save"></Button>
                    </form>
                </div>
                <button onClick={() => ShowUpForm(2)}>
                    <div className="ContentButton">
                        <h2>Change Name</h2>
                        <img src="/Images/arrow-point-to-right.png" alt="" width="30" height="30" />
                    </div>
                </button>
                <div id="name" className={`FormSetting ${active[2] ? "OnFormSetting" : ""}`}>
                    <h1>Change Your Name</h1>
                    <form onSubmit={StartToChangeName} action="">
                        <label htmlFor="">Name</label>
                        <Input name="MyName" placeholder="Enter Your new name"></Input>
                        <Button ContentButton="Save"></Button>
                    </form>
                </div>
                <button onClick={() => ShowUpForm(3)}>
                    <div className="ContentButton">
                        <h2>Change Password</h2>
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
                        <Button ContentButton="Save"></Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SettingForm;