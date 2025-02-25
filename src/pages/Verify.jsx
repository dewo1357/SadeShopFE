import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import { getAcc } from "./manage";

const Verify = () => {
    const { token } = useParams();
    const [message, SetMessage] = useState("Process");
    const [hasilAkhir,setHasilAkhir] = useState(false)
    const [finish, setFinish] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [account,setAccount] = useState(getAcc())

    const navigate = useNavigate();
    


    const checkedToken = async () => {
        try {
            
            const response = await fetch(API_URL+"CheckedToken", {
                method: 'POST',
                headers: { "Content-Type": 'application/json' ,
                    'Authorization' : `Bearer ${account.acces_token}`
                },
                body: JSON.stringify({
                    token: token,
                })
            })
            if (!response) {
                SetMessage("GAGAL verifikasi")
                throw new Error("Failed")
            }
            const result = await response.json();
            console.log(result)
            if (result.status === 'Failed') {
                SetMessage(result.message+'😥')
            } else {
                SetMessage("Berhasil Verifikasi 😁")
                setHasilAkhir(true)
            }

        } catch (e) {
            console.log(e.message)
        }
    }

    useEffect(() => {
        if (!finish) {  
            setFinish(true)
            checkedToken();
            
        }
        if (finish) {
            if(hasilAkhir){
                navigate("/profil/"+account.username)
            }
        }
        
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [finish, hasilAkhir])

    return (
        <>
            <div>
                <div style={{ textAlign: "center" }}>
                    <h1 style={{ textAlign: "center" }}>{message}</h1>
                </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                <img src="/Images/Loading.gif" alt="" width="100px" />
            </div>
        </>
    )
}

export default Verify