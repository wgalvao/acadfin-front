"use client";
// import node module libraries
import { Container } from "react-bootstrap";
// import { SessionProvider } from "next-auth/react";

export default function AuthLayout({ children }) {
  return <Container className="d-flex flex-column">{children}</Container>;
}
