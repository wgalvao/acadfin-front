// lib/session.js
import Cookies from "js-cookie";

export function getSession() {
  return {
    token: Cookies.get("accessToken") || null,
    userId: Cookies.get("userId") || null,
    userName: Cookies.get("userName") || null,
  };
}
