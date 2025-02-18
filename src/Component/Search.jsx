/* eslint-disable react/prop-types */
import Button from "./Element/Button/Button";
const Search = (props) => {
    const { type, placeholder, action } = props
    return (
        <>
            <form action="" onInput={action}>
                <div className="SearchProduk">
                    <input type={type} placeholder={placeholder} name="name" />
                    <Button styling="btn" ContentButton="Search"></Button>
                </div>
            </form>
        </>
    )
}

export default Search;