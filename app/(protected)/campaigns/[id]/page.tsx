import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import client from "@/app/api/client";
import CampaignContactsForm from "../components/CampaignContactsForm";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [
    { data: campaign, response: campaignResponse },
    { data: contacts, response: contactsResponse },
  ] = await Promise.all([
    client.GET("/api/v1/Campaigns/{id}", {
      params: { path: { id } },
      cache: "no-store",
    }),
    client.GET("/api/v1/Contacts", {
      cache: "no-store",
    }),
  ]);

  if (
    campaignResponse.status === 401 ||
    campaignResponse.status === 403 ||
    contactsResponse.status === 401 ||
    contactsResponse.status === 403
  ) {
    redirect(`/api/auth/signin?callbackUrl=/campaigns/${id}`);
  }

  if (campaignResponse.status === 404 || !campaign) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <main className="mx-auto max-w-7xl space-y-8">
        <div>
          <Link
            href="/campaigns"
            className="text-sm font-medium text-blue-700 hover:underline"
          >
            Back to campaigns
          </Link>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            {campaign.name ?? "Campaign"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Add contacts to this campaign and review current campaign contacts.
          </p>
        </div>

        {!campaignResponse.ok && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Failed to load campaign: {campaignResponse.status}{" "}
            {campaignResponse.statusText}
          </div>
        )}

        <CampaignContactsForm campaign={campaign} contacts={contacts ?? []} />
      </main>
    </div>
  );
}
