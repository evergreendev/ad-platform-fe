import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import client from "@/app/api/client";
import Pagination from "@/app/common/components/Pagination";
import CampaignContactsForm from "../components/CampaignContactsForm";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

const getPositiveInteger = (
  value: string | string[] | undefined,
  fallback: number,
) => {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const parsedValue = Number(rawValue);

  return Number.isInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
};

const createCampaignContactsPageUrl = (
  campaignId: string,
  page: number,
  pageSize: number,
) => `/campaigns/${campaignId}?Page=${page}&PageSize=${pageSize}`;

export default async function CampaignDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const page = getPositiveInteger(resolvedSearchParams.Page, DEFAULT_PAGE);
  const pageSize = getPositiveInteger(
    resolvedSearchParams.PageSize,
    DEFAULT_PAGE_SIZE,
  );
  const [
    { data: campaign, response: campaignResponse },
    { data: contacts, response: contactsResponse },
    { data: campaignContacts, response: campaignContactsResponse },
  ] = await Promise.all([
    client.GET("/api/v1/Campaigns/{id}", {
      params: { path: { id } },
      cache: "no-store",
    }),
    client.GET("/api/v1/Contacts", {
      cache: "no-store",
    }),
    client.GET("/api/v1/Campaigns/{id}/contacts", {
      params: {
        path: { id },
        query: {
          Page: page,
          PageSize: pageSize,
        },
      },
      cache: "no-store",
    }),
  ]);

  if (
    campaignResponse.status === 401 ||
    campaignResponse.status === 403 ||
    contactsResponse.status === 401 ||
    contactsResponse.status === 403 ||
    campaignContactsResponse.status === 401 ||
    campaignContactsResponse.status === 403
  ) {
    redirect(`/api/auth/signin?callbackUrl=/campaigns/${id}`);
  }

  if (campaignResponse.status === 404 || !campaign) {
    notFound();
  }

  if (campaignContactsResponse.ok && campaignContacts) {
    const totalCount = campaignContacts.totalCount ?? 0;
    const resolvedPageSize = campaignContacts.pageSize ?? pageSize;
    const lastPage = Math.max(1, Math.ceil(totalCount / resolvedPageSize));

    if (page > lastPage) {
      redirect(createCampaignContactsPageUrl(id, lastPage, resolvedPageSize));
    }
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

        {!campaignContactsResponse.ok && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Failed to load campaign contacts: {campaignContactsResponse.status}{" "}
            {campaignContactsResponse.statusText}
          </div>
        )}

        <CampaignContactsForm
          campaign={campaign}
          contacts={contacts ?? []}
          campaignContacts={campaignContacts?.items ?? []}
          totalCampaignContacts={campaignContacts?.totalCount ?? 0}
        />

        <Pagination
          totalCount={campaignContacts?.totalCount ?? 0}
          pageSize={campaignContacts?.pageSize ?? pageSize}
          currentPage={campaignContacts?.page ?? page}
        />
      </main>
    </div>
  );
}
