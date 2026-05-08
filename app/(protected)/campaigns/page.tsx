import { redirect } from "next/navigation";
import client from "@/app/api/client";
import Pagination from "@/app/common/components/Pagination";
import CampaignsTable from "./components/CampaignsTable";

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

const createCampaignsPageUrl = (page: number, pageSize: number) =>
  `/campaigns?Page=${page}&PageSize=${pageSize}`;

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = getPositiveInteger(resolvedSearchParams.Page, DEFAULT_PAGE);
  const pageSize = getPositiveInteger(
    resolvedSearchParams.PageSize,
    DEFAULT_PAGE_SIZE,
  );
  const { data: campaigns, response } = await client.GET("/api/v1/Campaigns", {
    params: {
      query: {
        Page: page,
        PageSize: pageSize,
      },
    },
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) {
    redirect("/api/auth/signin?callbackUrl=/campaigns");
  }

  if (campaigns) {
    const totalCount = campaigns.totalCount ?? 0;
    const resolvedPageSize = campaigns.pageSize ?? pageSize;
    const lastPage = Math.max(1, Math.ceil(totalCount / resolvedPageSize));

    if (page > lastPage) {
      redirect(createCampaignsPageUrl(lastPage, resolvedPageSize));
    }
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

        <CampaignsTable campaigns={campaigns?.items ?? []} />

        <Pagination
          totalCount={campaigns?.totalCount ?? 0}
          pageSize={campaigns?.pageSize ?? pageSize}
          currentPage={campaigns?.page ?? page}
        />
      </main>
    </div>
  );
}
