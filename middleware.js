// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  console.log("*** Middleware ***");
  // Verifica se existe um cookie de autenticação
  // const token = Cookies.get("accessToken");
  const token = req.cookies.get("accessToken")?.value;

  // Se o token não existir, redireciona para a página de login
  if (!token) {
    return NextResponse.redirect(new URL("/authentication/sign-in", req.url));
  }

  // Validate the token by making an API call
  const validateToken = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/token/verify/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      // console.log(res);
      if (!res.ok) throw new Error("Token validation failed");
    } catch (error) {
      console.error(error);
      // router.replace("/authentication/sign-in"); // Redirect to login if token validation fails
      return NextResponse.redirect(new URL("/authentication/sign-in", req.url));
    }
  };

  validateToken();

  return NextResponse.next();
}

// Configura onde o middleware deve ser aplicado
export const config = {
  matcher: [
    "/pages/:path*",
    "/profile/:path*",
    "/components/:path*",
    "/protected/:path*",
  ], // Adicione rotas que precisam ser protegidas
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
