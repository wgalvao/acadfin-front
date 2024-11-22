import { NextResponse } from "next/server";
import { useSession, signOut } from "next-auth/react";
export async function middleware(req) {
  // const { data: session, status } = useSession({ required: true });
  // console.log(session);
  console.log("*** Middleware ***");

  // if (!session) {
  //   return NextResponse.redirect(new URL("/auth/signin", req.url));
  // }

  // return NextResponse.next();

  // const accessToken = req.cookies.get("accessToken")?.value;
  // const refreshToken = req.cookies.get("refreshToken")?.value;

  // // Se não existir accessToken e refreshToken, redireciona para login
  // if (!accessToken && !refreshToken) {
  //   return NextResponse.redirect(new URL("/authentication/sign-in", req.url));
  // }

  // // Função para validar o accessToken
  // const validateAccessToken = async (token) => {
  //   try {
  //     const res = await fetch("http://localhost:8000/api/auth/token/verify/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ token }),
  //     });
  //     return res.ok;
  //   } catch (error) {
  //     console.error("Token validation failed:", error);
  //     return false;
  //   }
  // };

  // // Função para renovar o accessToken usando o refreshToken
  // const refreshAccessToken = async () => {
  //   try {
  //     const res = await fetch("http://localhost:8000/api/auth/token/refresh/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ refresh: refreshToken }),
  //     });

  //     if (res.ok) {
  //       const data = await res.json();
  //       return data.access; // Novo accessToken
  //     } else {
  //       throw new Error("Refresh token invalid");
  //     }
  //   } catch (error) {
  //     console.error("Error refreshing access token:", error);
  //     return null;
  //   }
  // };

  // // Tenta validar o accessToken atual
  // const isValidAccessToken = await validateAccessToken(accessToken);

  // if (!isValidAccessToken) {
  //   // Se o accessToken for inválido, tenta renová-lo usando o refreshToken
  //   const newAccessToken = await refreshAccessToken();

  //   if (newAccessToken) {
  //     // Atualiza o cookie do accessToken com o novo valor
  //     const response = NextResponse.next();
  //     response.cookies.set("accessToken", newAccessToken, { httpOnly: true });
  //     return response;
  //   } else {
  //     // Se a renovação falhar, redireciona para a página de login
  //     return NextResponse.redirect(new URL("/authentication/sign-in", req.url));
  //   }
  // }

  // return NextResponse.next();
}

// Configura onde o middleware deve ser aplicado
export const config = {
  matcher: [
    "/pages/:path*",
    "/profile/:path*",
    // "/components/:path*",
    "/protected/:path*",
  ], // Rotas que precisam ser protegidas
};
