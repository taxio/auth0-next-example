import ProfileClient from "@/components/ProfileClient";

export default function Home() {
  return (
    <div>
      <a href="/api/auth/login">Login</a>
      <a href="/api/auth/logout">Logout</a>

      <ProfileClient />
    </div>
  )
}
