/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.01.26
 * Description : Main
 */
import "./style.scss";
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from 'react-router-dom';

import Register from "./pages/Register";
import Register2 from "./pages/Register2";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Search from "./pages/Search";
import OnlineStudy from "./pages/OnlineStudy";
import Profile from "./pages/Profile";
import MyOnline from "./pages/MyOnline";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import PaymentList from "./pages/PaymentList";
import LectureDetail from "./pages/LectureDetail";
import UpdateUserInfo from './pages/UpdateUserInfo';

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import KakaoCallback from "./components/KakaoCallback";
import Certificates from "./pages/Certificates";
import FindPassword from "./pages/FindPassword";

const Layout = () => {
  
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/lecturedetail/:lectureID",
        element:<LectureDetail/>
      },
      {
        path: "/search/:searchcategory",
        element: <Search />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/updateUserinfo",
        element: <UpdateUserInfo />
      },
      {
        path: "/myonline",
        element: <MyOnline />
      },
      {
        path: "/cart",
        element: <Cart />
      },
      {
        path: "/payment",
        element: <Payment />
      },
      {
        path: "/paymentlist",
        element: <PaymentList />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/register2",
        element: <Register2 />
      },
      {
        path: "/certificates",
        element: <Certificates />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/findpassword",
        element: <FindPassword />
      },
      {
        path: "/onlinestudy/:lectureID",
        element: <OnlineStudy />
      },
      {
        path: "/kakaoCallback",
        element: <KakaoCallback />
      },
    ]
  },
  

]);

function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
