import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <div className="auth-container flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="mb-4">
        <SignIn />
      </div>
      <Link
        href="/forgot-password"
        className="text-white hover:underline mt-4"
      >
        Forgot Password?
      </Link>
    </div>
  );
}
