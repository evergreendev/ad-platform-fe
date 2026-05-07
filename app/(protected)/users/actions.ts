"use server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function registerUser(formData: FormData) {
  const session = await auth();
  const accessToken = session?.accessToken;
  const email = formData.get("email") as string;

  if (!accessToken || session?.error === "AccessTokenExpired") {
    redirect("/api/auth/signin");
  }

  const res = await fetch(`${process.env.AUTH_BASE_URL}/users`, {
    method: "POST",
    body: JSON.stringify({
      Email: email as string,
      UserName: email as string,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      redirect("/api/auth/signin");
    }
    throw new Error("Registration failed");
  }

  redirect("/");
}
