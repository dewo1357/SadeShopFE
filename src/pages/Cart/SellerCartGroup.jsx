/* eslint-disable react/prop-types */
import CartItem from "./CartItem";

const SellerCartGroup = ({
    sellerGroup,
    checkedItems,
    transactionIds,
    tempValuePcs,
    onCheck,
    onDelete,
    onQuantityChange,
    onInputBlur
}) => {
    return (
        <div key={sellerGroup.Seller}>
            <h1>{sellerGroup.Seller}</h1>
            {sellerGroup.cartProduk.map((item, index) => (
                <CartItem
                    key={item.id}
                    item={item}
                    index={index}
                    isChecked={checkedItems[index]}
                    transactionIds={transactionIds}
                    tempValuePcs={tempValuePcs}
                    onCheck={onCheck}
                    onDelete={onDelete}
                    onQuantityChange={onQuantityChange}
                    onInputBlur={onInputBlur}
                />
            ))}
        </div>
    );
};

export default SellerCartGroup;