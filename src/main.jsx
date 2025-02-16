import FormLogin from './Component/Auth/FormLogin.jsx';
import FormLayout from './pages/FormLayout.jsx';
import FormRegister from './Component/Auth/FormRegister.jsx';
import ProductPages from './pages/ProductPages.jsx';
import ProfilPages from './pages/profilPages.jsx';
import Eror from "./Component/Eror.jsx";
import CartPages from './pages/CartPages.jsx';
import CheckOut from './pages/Checkout.jsx';
import InformationOrder from './pages/InformationOrder.jsx';
import Verify from './pages/Verify.jsx';
import YourProduct from './pages/YourProduct.jsx';
import MessagePages from './pages/MessagePages.jsx';
import SettingPages from './pages/setting.jsx';
import { SocketProvider } from './SocketProvider.jsx';

// eslint-disable-next-line no-unused-vars
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import './index.css';



const router = createBrowserRouter([
  {
    path: "/",
    element: <FormLayout title="Login" Content="Enter Username & Kata Sandi" Children={<FormLogin />} type="login"></FormLayout>,
  },
  {
    path: "/register",
    element: <FormLayout title="Register"
      Content="Isi Form Yang Tersedia" Children={<FormRegister />} type="register"></FormLayout>,
  },
  {
    path: "/verify/:token",
    element: <Verify />
  },
  {
    path: "/SettingPages",
    element: <SettingPages />
  },
  {
    path: "/Message",
    element: <MessagePages />
  },
  {
    path: "/Message/:username",
    element: <MessagePages StartChat={true} />
  },
  {
    path: "/YourProductOrder",
    element: <YourProduct />
  },
  {
    path: "/InformationOrder",
    element: <InformationOrder />
  },
  {
    path: "/checkout",
    element: <CheckOut />
  },
  {
    path: "/cart",
    element: <CartPages />
  },
  {
    path: "/products",
    element: <ProductPages />
  },
  {
    path: "/profil",
    element: <ProfilPages />
  },
  {
    path: "/profil/:idUser",
    element: <ProfilPages visit={true} />
  },
  {
    path: "*", // Wildcard di akhir
    element: <Eror />
  },
]);


createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <RouterProvider router={router} />
  </SocketProvider>
)


