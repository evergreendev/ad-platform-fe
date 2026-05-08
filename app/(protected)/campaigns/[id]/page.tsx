import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import client from "@/app/api/client";
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

const createCampaignPageUrl = ({
  campaignId,
  contactPage,
  contactPageSize,
  campaignContactPage,
  campaignContactPageSize,
}: {
  campaignId: string;
  contactPage: number;
  contactPageSize: number;
  campaignContactPage: number;
  campaignContactPageSize: number;
}) =>
  `/campaigns/${campaignId}?ContactPage=${contactPage}&ContactPageSize=${contactPageSize}&CampaignContactPage=${campaignContactPage}&CampaignContactPageSize=${campaignContactPageSize}`;

const getAllCampaignContactIds = async (campaignId: string) => {
  const contactIds = new Set<string>();
  const pageSize = 500;
  let page = 1;
  let fetchedCount = 0;
  let totalCount = 0;

  do {
    const { data, response } = await client.GET(
      "/api/v1/Campaigns/{id}/contacts",
      {
        params: {
          path: { id: campaignId },
          query: {
            Page: page,
            PageSize: pageSize,
          },
        },
        cache: "no-store",
      },
    );

    if (response.status === 401 || response.status === 403) {
      redirect(`/api/auth/signin?callbackUrl=/campaigns/${campaignId}`);
    }

    if (!response.ok) {
      return { contactIds: [...contactIds] };
    }

    const campaignContacts = data?.items ?? [];
    totalCount = data?.totalCount ?? 0;
    fetchedCount += campaignContacts.length;

    for (const campaignContact of campaignContacts) {
      if (campaignContact.contactId) {
        contactIds.add(campaignContact.contactId);
      }
    }

    if (campaignContacts.length === 0) {
      break;
    }

    page += 1;
  } while (fetchedCount < totalCount);

  return { contactIds: [...contactIds] };
};

export default async function CampaignDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const contactPage = getPositiveInteger(
    resolvedSearchParams.ContactPage,
    DEFAULT_PAGE,
  );
  const contactPageSize = getPositiveInteger(
    resolvedSearchParams.ContactPageSize,
    DEFAULT_PAGE_SIZE,
  );
  const campaignContactPage = getPositiveInteger(
    resolvedSearchParams.CampaignContactPage,
    DEFAULT_PAGE,
  );
  const campaignContactPageSize = getPositiveInteger(
    resolvedSearchParams.CampaignContactPageSize,
    DEFAULT_PAGE_SIZE,
  );
  const [
    { data: campaign, response: campaignResponse },
    { data: contacts, response: contactsResponse },
    { data: campaignContacts, response: campaignContactsResponse },
    { contactIds: existingCampaignContactIds },
  ] = await Promise.all([
    client.GET("/api/v1/Campaigns/{id}", {
      params: { path: { id } },
      cache: "no-store",
    }),
    client.GET("/api/v1/Contacts", {
      params: {
        query: {
          Page: contactPage,
          PageSize: contactPageSize,
        },
      },
      cache: "no-store",
    }),
    client.GET("/api/v1/Campaigns/{id}/contacts", {
      params: {
        path: { id },
        query: {
          Page: campaignContactPage,
          PageSize: campaignContactPageSize,
        },
      },
      cache: "no-store",
    }),
    getAllCampaignContactIds(id),
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

  if (contactsResponse.ok && contacts) {
    const totalCount = contacts.totalCount ?? 0;
    const resolvedPageSize = contacts.pageSize ?? contactPageSize;
    const lastPage = Math.max(1, Math.ceil(totalCount / resolvedPageSize));

    if (contactPage > lastPage) {
      redirect(
        createCampaignPageUrl({
          campaignId: id,
          contactPage: lastPage,
          contactPageSize: resolvedPageSize,
          campaignContactPage,
          campaignContactPageSize,
        }),
      );
    }
  }

  if (campaignContactsResponse.ok && campaignContacts) {
    const totalCount = campaignContacts.totalCount ?? 0;
    const resolvedPageSize =
      campaignContacts.pageSize ?? campaignContactPageSize;
    const lastPage = Math.max(1, Math.ceil(totalCount / resolvedPageSize));

    if (campaignContactPage > lastPage) {
      redirect(
        createCampaignPageUrl({
          campaignId: id,
          contactPage,
          contactPageSize,
          campaignContactPage: lastPage,
          campaignContactPageSize: resolvedPageSize,
        }),
      );
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
          contacts={contacts?.items ?? []}
          totalContacts={contacts?.totalCount ?? 0}
          contactPage={contacts?.page ?? contactPage}
          contactPageSize={contacts?.pageSize ?? contactPageSize}
          campaignContacts={campaignContacts?.items ?? []}
          totalCampaignContacts={campaignContacts?.totalCount ?? 0}
          campaignContactPage={campaignContacts?.page ?? campaignContactPage}
          campaignContactPageSize={
            campaignContacts?.pageSize ?? campaignContactPageSize
          }
          existingCampaignContactIds={existingCampaignContactIds}
        />
      </main>
    </div>
  );
}
