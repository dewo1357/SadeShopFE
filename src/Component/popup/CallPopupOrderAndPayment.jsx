/* eslint-disable react/prop-types */


import InfoPopup from "./pop Forms";
import Statesss from "../../pages/States";

const CallPopupOrderAndPayment = (props) => {
    const { popup,
        isVisible, process, ClosePopup,
        VisibleForm, setVisible, SetVisibleForm,SetProcessLoading,
        setProcessMap,address,seAddress,LoadingMap,setLoadingMap} = props
    const {SetLoading2} = Statesss()

    const CloseCheckout = (e)=>{
        if(e.target.id === "overlayCheckout"){
           
            setVisible(false)
            popup.current.style.visibility="hidden"
        }
    }
   

    return (
        <>
             <div ref={popup} className="popup" id="overlayCheckout" onClick={CloseCheckout} >
                <div  className={`overlay  ${isVisible ? "" : "action"} `}  >
                    <div className="ClosePopup" onClick={(e) => { ClosePopup(e, popup, setVisible, SetVisibleForm) }} hidden={VisibleForm ? true : false}><button>✖</button></div>
                    <InfoPopup 
                    action={(e)=>process(e,SetLoading2,SetProcessLoading)} 
                    setProcessMap={setProcessMap}
                    address={address}
                    seAddress={seAddress}
                    LoadingMap={LoadingMap}
                    setLoadingMap={setLoadingMap}/>
                </div>
            </div>
            
        </>
    )
}

export default CallPopupOrderAndPayment