import createClient from "openapi-fetch";
import { auth } from "@/auth";
import type { paths } from "./types";

const client = createClient<paths>({ baseUrl: process.env.API_BASE_URL });

client.use({
  async onRequest({ request }) {
    const session = await auth();
    const accessToken = session?.accessToken;

    if (accessToken) {
      request.headers.set("Authorization", `Bearer ${accessToken}`);
    }
  },
});

export default client;
