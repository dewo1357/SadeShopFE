import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Verify = () => {
    const { token } = useParams();
    const [message, SetMessage] = useState("Process");
    const [hasilAkhir,setHasilAkhir] = useState(false)
    const [finish, setFinish] = useState(false);
    


    const checkedToken = async () => {
        try {
            const account = JSON.parse(localStorage.getItem('account'))
            const response = await fetch("http://localhost:5000/CheckedToken", {
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
                location.href = "/profil"
            }
        }
        
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