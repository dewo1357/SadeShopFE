/* eslint-disable react/prop-types */
const Search = (props) => {
    const { type, placeholder, action } = props
    return (
        <>
            <form action="" onInput={action}>
                <div className="SearchProduk">
                    <input type={type} placeholder={placeholder} name="name" />
                    <button>Search</button>
                </div>
            </form>
        </>
    )
}

export default Search;