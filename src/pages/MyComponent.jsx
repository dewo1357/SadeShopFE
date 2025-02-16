/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";


const MyComponent = (props) => {
  const { setProcessMap, seAddress, setLoadingMap } = props
  const mapRef = useRef(null); // Simpan referensi ke peta
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  // Pastikan Leaflet tersedia
  const L = window.L;


  const getAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
      );
      const data = await response.json();

      seAddress((prevState) => ({
        ...prevState,
        address: data?.address || null,
      }))
      console.log(data)
      setProcessMap(false)
      setLoadingMap(true)
    } catch (err) {
      setError("Gagal mendapatkan alamat.");
      console.log(err.message)
    }
  };

  const currentLocation = () => {
    // Gunakan Geolocation API untuk mendapatkan lokasi pengguna
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          seAddress({ latitude, longitude });

          // Panggil fungsi reverse geocoding
          getAddress(latitude, longitude);

          // Update peta ke posisi pengguna
          mapRef.current.setView([latitude, longitude], 13);
          const marker = L.marker([latitude, longitude]).addTo(mapRef.current);
          marker.bindPopup("You are here.").openPopup();

        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }

  }

  useEffect(() => {

    // Inisialisasi map jika belum ada
    const timeout = setTimeout(() => {
      if (!mapRef.current) {
        console.log("diinstall")
        const initMap = L.map("map").setView([3.53321, 98.72535], 13); // Default center jika lokasi belum diperoleh
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(initMap);

        mapRef.current = initMap; // Simpan referensi ke peta
      }
    },1000)

   

    // Cleanup untuk mencegah inisialisasi ulang
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef]);

  return (
    <>
      <button onClick={currentLocation}> Lokasi Saya Saat Ini</button>
      <div style={{ height: '300px', width: "900px", overflow: "hidden", background: "red", marginTop: "10px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div id="map" style={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}></div>
      </div>
    </>
  );
};

export default MyComponent;
