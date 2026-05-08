import { redirect } from "next/navigation";
import client from "@/app/api/client";
import Pagination from "@/app/common/components/Pagination";

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

const createContactsPageUrl = (page: number, pageSize: number) =>
  `/contacts?Page=${page}&PageSize=${pageSize}`;

export default async function Page({
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
  const { data: contacts, response } = await client.GET("/api/v1/Contacts", {
    params: {
      query: {
        Page: page,
        PageSize: pageSize,
      },
    },
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) {
    redirect("/api/auth/signin?callbackUrl=/contacts");
  }

  if (!contacts) {
    return null;
  }

  const totalCount = contacts.totalCount ?? 0;
  const resolvedPageSize = contacts.pageSize ?? pageSize;
  const lastPage = Math.max(1, Math.ceil(totalCount / resolvedPageSize));

  if (page > lastPage) {
    redirect(createContactsPageUrl(lastPage, resolvedPageSize));
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans ">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          {contacts.items?.map((contact) => (
            <div key={contact.id}>
              <h2>{contact.firstName}</h2>
              <p>
                {contact?.companies?.map((company) => (
                  <span key={company.id}>{company.companyName}, </span>
                ))}
              </p>
            </div>
          ))}
        </div>
        <Pagination
          totalCount={contacts.totalCount ?? 0}
          pageSize={contacts.pageSize ?? pageSize}
          currentPage={contacts.page ?? page}
        />
      </main>
    </div>
  );
}
