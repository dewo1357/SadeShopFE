/* eslint-disable react/prop-types */
import Button from "../Element/Button/Button";
import FormPayment from "./PaymentForm";


const InfoPopup = (props) => {
    const { action, isvisible, setProcessMap, address, seAddress,LoadingMap,setLoadingMap } = props;
    return (
        <form onSubmit={action} hidden={isvisible}>
            <h1>Payment Process</h1>
            <div className="overlayBody">
                <div className="componentOverlay">
                    <div className="componentOverlayForm">
                        <FormPayment
                            setProcessMap={setProcessMap}
                            address={address}
                            seAddress={seAddress}
                            LoadingMap={LoadingMap} 
                            setLoadingMap={setLoadingMap}/>
                    </div>
                </div>
            </div>
            <Button ContentButton="Checkout"  ></Button>
        </form>
    )
}

export default InfoPopup;