import { redirect } from "next/navigation";
import client from "@/app/api/client";
import CampaignsTable from "./components/CampaignsTable";

export default async function CampaignsPage() {
  const { data: campaigns, response } = await client.GET("/api/v1/Campaigns", {
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) {
    redirect("/api/auth/signin?callbackUrl=/campaigns");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <main className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="mt-2 text-sm text-gray-600">
            Review campaigns and manage campaign membership.
          </p>
        </div>

        {!response.ok && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Failed to load campaigns: {response.status} {response.statusText}
          </div>
        )}

        <CampaignsTable campaigns={campaigns ?? []} />
      </main>
    </div>
  );
}
