import Footer from "./Footer";
const HomeNoLoginPages = () => {
    const items = [
        { image: "Images/1.jpg", text: "Dynamic" },
        { image: "pictCatalog/pict0.jpg", text: "Electronic" },
        { image: "pictCatalog/pict1.jpg", text: "Luxurious" },
        { image: "pictCatalog/pict4.jpg", text: "Vibrant" },
        { image: "pictCatalog/pict5.jpg", text: "Creative" },
        { image: "pictCatalog/pict6.jpg", text: "Trendy" },
        { image: "pictCatalog/pict7.jpg", text: "Fashionable" },
        { image: "pictCatalog/pict9.jpg", text: "Artistic" },
        { image: "pictCatalog/pict8.jpg", text: "Stylish" },
    ];
    return (
        <div>
            <div className="HomeProduct">
                <div>
                    <h1 >
                        Penuhi Segala Kebutuhan Kamu
                    </h1>
                </div>
                <div className="HomePictProduct">
                    <div className="HomePictProductComponent">
                        <img style={{ width: "100%", objectFit: "cover" }} src="/Images/simply-mersah-MLV5zTSzj98-unsplash (1).jpg" alt="" />
                        <img style={{ width: "100%", objectFit: "cover" }} src="/Images/micheile-henderson-NuYB_I4wXFM-unsplash (1).jpg" alt="" />
                        <img style={{ width: "100%", objectFit: "cover" }} src="/Images/dwayne-joe-9wubaeSG13U-unsplash (1).jpg" alt="" />
                    </div>
                    <div className="HomePictProductComponent kedua">
                        <img style={{ width: "100%", objectFit: "cover" }} src="/Images/katsiaryna-endruszkiewicz-BteCp6aq4GI-unsplash (2).jpg" alt="" />
                        <img style={{ width: "100%", objectFit: "cover" }} src="/Images/jeff-trierweiler-yrINjq6HInM-unsplash (1).jpg" alt="" />
                        <img style={{ width: "100%", objectFit: "cover" }} src="/Images/laika-notebooks-RDYGxXuRyx4-unsplash (1).jpg" alt="" />
                    </div>
                </div>

            </div>
            <div>
                <h1 style={{ fontSize: "30px" }}>Our Products</h1>
            </div>
            <div className="containerHome">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="item"
                        style={{ backgroundImage: `url(${item.image})` }}
                    >
                        <div className="overlayHome"></div>
                        <h1>{item.text}</h1>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    )
}

export default HomeNoLoginPages