/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useState,useRef } from "react";
import { Refresh_Token } from "../manage";
import { API_URL } from "../../../config";

const ProfilPagesLayout = (props) => {
    const {socket, getMyAccount,isAccess,setNotifMessage,account,
        setVerified,setChecked,setPesan, SetProcessLoading,
        SetProcessChangeProfile,popupVerify} = props
    const FormChangeProfile = useRef();
    const verify = useRef();

    const IsVerified = async () => {
        try {
            const response = await fetch(API_URL + "CheckAccount", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${account.acces_token}`
                }
            })
            if (!response) {
                throw new Error("Failed")
            }
            const result = await response.json();
            if (result.statusCode === 401) {
                await Refresh_Token(socket)
                location.href = `/profil/${account.username}`
            }

            console.log(result)
            if (!result.verified) {
                verify.current.style.visibility = "visible"
            } else {
                setVerified(true)
            }
            setNotifMessage(result.notifMessage ? true : false)
            setChecked(false)

        } catch (e) {
            return
        }
    }

    const StartToChat = () => {
        location.href = `/message/${getMyAccount.username}`
    }


    useEffect(()=>{
        IsVerified();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const UploadImageToAPI = async (e, file) => {
        setPesan("Foto Kamu Sedang Di Proses")
        SetProcessLoading(true)
        SetProcessChangeProfile(true)
        e.preventDefault();
        const files = new FormData()
        files.append('files', file);
        try {
            const response = await fetch(API_URL + "ChangeImageProfile", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${account.acces_token}`,
                },
                body: files,
            })
            location.href = `/profil/${getMyAccount.username}`
            if (!response) {
                throw new Error(response.messages)
            }
            const result = await response.json();
            if (result.statusCode == 401) {
                await Refresh_Token(socket)
                location.href = `/profil/${getMyAccount.username}`
            }
        } catch (error) {
            return
        }
    }

    const handleBackground = (e) => {
        if (e.target.id === "OverChange") {
            FormChangeProfile.current.style.visibility = "hidden"
        }
    }

    const [tempProfileImage, setTempProfileImage] = useState(null)
    const [FileImage, setFileImage] = useState(null)
    const ProfileImageHandle = (e) => {
        let file = e.target.files[0];
        if (!file) {
            throw new Error("Tipe Dokumen Tidak Sesuai");
        } else {
            const alloType = ['image/jpg', 'image/png', 'image/jpeg'];
            if (alloType.includes(file.type)) {
                //Validasi. Akan Di Proses apabila kurang dari 5 MB.
                if (file.size < 5000000) {
                    const date = new Date().getTime().toString()
                    const terbaru = new File([file], `${date}`, {
                        type: file.type
                    })
                    setTempProfileImage(URL.createObjectURL(terbaru))
                    setFileImage(terbaru)
                }
            }
        }
    }
    return (
        <>
            <div className="DetailLayoutProfil">
                <div className="gambarProfil">
                    <div className="ContainerPictProfile images" style={{
                        backgroundImage: `url(https://qcgtgzcrwkdtkzzgkclh.supabase.co/storage/v1/object/public/ProfilePicture/${getMyAccount ? getMyAccount.image : ""})`,
                        backgroundPosition: "center",
                        borderRadius: "360px"
                    }}>
                        <div className={!isAccess ? "" : "LabelOverLay"} >
                            <div>
                                <label onClick={() => { FormChangeProfile.current.style.visibility = "visible" }}><img src="/Images/settings-svgrepo-com.svg" alt="" hidden={!isAccess ? true : false} /></label>
                            </div>
                        </div>
                    </div>
                </div>
                <div onClick={handleBackground} ref={FormChangeProfile} id="OverChange" className="overlay3">
                    <div className="FormChangeProfile">
                        <h2 style={{ margin: "0px", marginBottom: "20px", textAlign: "center" }}>Change Profile Picture</h2>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                            <img src={tempProfileImage ? tempProfileImage : `https://qcgtgzcrwkdtkzzgkclh.supabase.co/storage/v1/object/public/ProfilePicture/${getMyAccount ? getMyAccount.image : ""}`} alt="" />
                        </div>
                        <form style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }} action="" onSubmit={tempProfileImage ? (e) => { UploadImageToAPI(e, FileImage) } : () => { }}>
                            <div>
                                <input onChange={ProfileImageHandle} type="file" id="file" hidden={!isAccess ? true : false} />
                            </div>
                            <div>
                                <button>Change My Pict</button>
                            </div>
                        </form>
                    </div>

                </div>
                <div className={`BioData`} >
                    <div>
                        <div ref={verify} className="buttonVerify">
                            <button onClick={() => { popupVerify.current.style.visibility = 'visible' }} hidden={!isAccess ? true : false}   >Verify Your Account</button>
                        </div>
                        <div>
                            <h1>{getMyAccount.nama} </h1>
                        </div>

                        <div>
                            <p>{getMyAccount.username} | {getMyAccount.Bio} </p>
                        </div>
                        <div hidden={getMyAccount.nama ? false : true} >
                            <button onClick={StartToChat} hidden={isAccess ? true : false}>Mulai Obrolan</button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ProfilPagesLayout