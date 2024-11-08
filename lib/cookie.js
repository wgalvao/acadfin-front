import Cookies from "js-cookie";

// Example function to get tokens
const getTokens = () => {
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");

  return { accessToken, refreshToken };
};
