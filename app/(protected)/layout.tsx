import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.error === "AccessTokenExpired") {
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "/users";
    redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`);
  }

  return <>{children}</>;
}
