/* eslint-disable react/prop-types */

import Button from "../Element/Button/Button";

const CardProduct = (props) => {
    const { children } = props;

    return (
        <>
            <div className="CardLayout">
                {children}
            </div>
        </>
    )
}

const images = (props) => {
    const { source } = props
    return (
        <div className={`CardImage`}>
            <img src={source} />
        </div>
    )
}



const HeaderContent = (props) => {
    const { title, seller, children, dataProduct } = props;
    return (
        <div className="HeaderContent">
            <h2>{title}</h2>
            <p>⏺ <a href={`/profil/${dataProduct.Account.username ? dataProduct.Account.username : ""}`}>{seller}</a></p>
            <div className="BodyCard">
                {children}
            </div>
        </div>
    )
}

const Footer = (props) => {
    const { price, action, Content } = props
    return (
        <div className="Footer">
            <span className="Price">Rp {price}</span>
            <Button styling="btn FooterButton" action={action} ContentButton={Content}></Button>
        </div>
    )
}

CardProduct.images = images;
CardProduct.HeaderContent = HeaderContent;
CardProduct.Footer = Footer;


export default CardProduct;