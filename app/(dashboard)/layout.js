"use client";
// import node module libraries
import { useState } from "react";

// import theme style scss file
import "styles/theme.scss";

// import sub components
import NavbarVertical from "/layouts/navbars/NavbarVertical";
import NavbarTop from "/layouts/navbars/NavbarTop";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(true);
  const ToggleMenu = () => {
    return setShowMenu(!showMenu);
  };

  // useEffect(() => {
  //   const token = Cookies.get("accessToken");
  //   console.log(token);
  //   if (!token) {
  //     router.replace("/authentication/sign-in"); // If no token is found, redirect to login page
  //     return;
  //   }

  //   // Validate the token by making an API call
  //   const validateToken = async () => {
  //     try {
  //       const res = await fetch(
  //         "http://localhost:8000/api/auth/token/verify/",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({ token }),
  //         }
  //       );
  //       console.log(res);
  //       if (!res.ok) throw new Error("Token validation failed");
  //     } catch (error) {
  //       console.error(error);
  //       router.replace("/authentication/sign-in"); // Redirect to login if token validation fails
  //     }
  //   };

  //   validateToken();
  // }, [router]);

  return (
    <div id="db-wrapper" className={`${showMenu ? "" : "toggled"}`}>
      <div className="navbar-vertical navbar">
        <NavbarVertical
          showMenu={showMenu}
          onClick={(value) => setShowMenu(value)}
        />
      </div>
      <div id="page-content">
        <div className="header">
          <NavbarTop
            data={{
              showMenu: showMenu,
              SidebarToggleMenu: ToggleMenu,
            }}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
