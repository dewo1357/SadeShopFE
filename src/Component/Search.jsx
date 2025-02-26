/* eslint-disable react/prop-types */
const Search = (props) => {
    const { type, placeholder, action,onBlur } = props
    return (
        <>
            <form action="" onSubmit={action} onInput={action} onBlur={onBlur}>
                <div className="SearchProduk">
                    <input type={type} placeholder={placeholder} name="name" />
                </div>
            </form>
        </>
    )
}

export default Search;