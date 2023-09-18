import ProfileClient from "@/components/ProfileClient";
import {Suspense} from "react";

export default function Home() {
  return (
    <div>
      <a href="/api/auth/login">Login</a>
      <a href="/api/auth/logout">Logout</a>

      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-ignore */}
        <ProfileClient />
      </Suspense>
    </div>
  )
}
