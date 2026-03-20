import { auth } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "/users";
    redirect(`/api/auth/signin?callbackUrl=${pathname}`);
  }

  return <>{children}</>;
}
