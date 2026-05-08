"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import client from "@/app/api/client";
import type { components } from "@/app/api/types";

type CampaignStatus = components["schemas"]["CampaignStatus"];

export type CampaignActionState = {
  error?: string;
  message?: string;
};

type DeleteClient = {
  DELETE: (
    url: "/api/Campaigns/{id}",
    init: { params: { path: { id: string } } },
  ) => Promise<{ response: Response }>;
};

const campaignStatuses: CampaignStatus[] = ["Draft", "Active", "Completed"];

const getStringValues = (formData: FormData, fieldName: string) =>
  formData
    .getAll(fieldName)
    .filter((value): value is string => typeof value === "string" && !!value);

const getAllCampaignContactIds = async (campaignId: string) => {
  const pageSize = 500;
  const contactIds = new Set<string>();
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
      return {
        error: `Failed to load campaign contacts: ${response.status} ${response.statusText}`,
      };
    }

    totalCount = data?.totalCount ?? 0;
    const campaignContacts = data?.items ?? [];
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

const getAllContactIds = async () => {
  const pageSize = 500;
  const contactIds = new Set<string>();
  let page = 1;
  let fetchedCount = 0;
  let totalCount = 0;

  do {
    const { data, response } = await client.GET("/api/v1/Contacts", {
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

    if (!response.ok) {
      return {
        error: `Failed to load contacts: ${response.status} ${response.statusText}`,
      };
    }

    totalCount = data?.totalCount ?? 0;
    const contacts = data?.items ?? [];
    fetchedCount += contacts.length;

    for (const contact of contacts) {
      if (contact.id) {
        contactIds.add(contact.id);
      }
    }

    if (contacts.length === 0) {
      break;
    }

    page += 1;
  } while (fetchedCount < totalCount);

  return { contactIds: [...contactIds] };
};

export async function createCampaign(
  _previousState: CampaignActionState,
  formData: FormData,
): Promise<CampaignActionState> {
  const name = (formData.get("name") as string | null)?.trim();
  const description =
    (formData.get("description") as string | null)?.trim() || null;
  const status = formData.get("status") as CampaignStatus | null;

  if (!name) {
    return { error: "Campaign name is required." };
  }

  if (!status || !campaignStatuses.includes(status)) {
    return { error: "Select a valid campaign status." };
  }

  const { data, response } = await client.POST("/api/v1/Campaigns", {
    body: {
      name,
      description,
      status,
    },
  });

  if (response.status === 401 || response.status === 403) {
    redirect("/api/auth/signin?callbackUrl=/campaigns/new");
  }

  if (!response.ok) {
    return {
      error: `Campaign creation failed: ${response.status} ${response.statusText}`,
    };
  }

  revalidatePath("/campaigns");
  redirect(data?.id ? `/campaigns/${data.id}` : "/campaigns");
}

export async function deleteCampaigns(
  _previousState: CampaignActionState,
  formData: FormData,
): Promise<CampaignActionState> {
  const campaignIds = getStringValues(formData, "campaignIds");

  if (campaignIds.length === 0) {
    return { error: "Select at least one campaign to delete." };
  }

  const deleteClient = client as unknown as DeleteClient;
  const results = await Promise.all(
    campaignIds.map(async (campaignId) => {
      const { response } = await deleteClient.DELETE("/api/Campaigns/{id}", {
        params: { path: { id: campaignId } },
      });

      return {
        campaignId,
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
      };
    }),
  );

  if (
    results.some((result) => result.status === 401 || result.status === 403)
  ) {
    redirect("/api/auth/signin?callbackUrl=/campaigns");
  }

  const failedDeletes = results.filter((result) => !result.ok);

  revalidatePath("/campaigns");

  if (failedDeletes.length > 0) {
    const failedSummary = failedDeletes
      .map(
        (result) =>
          `${result.campaignId}: ${result.status} ${result.statusText}`,
      )
      .join("; ");

    return {
      error: `Could not delete every selected campaign. ${failedSummary}`,
    };
  }

  return { message: `Deleted ${campaignIds.length} campaign(s).` };
}

export async function addContactsToCampaign(
  campaignId: string,
  _previousState: CampaignActionState,
  formData: FormData,
): Promise<CampaignActionState> {
  const shouldAddAllAvailableContacts =
    formData.get("addAllAvailableContacts") === "true";
  let contactIds = getStringValues(formData, "contactIds");

  if (shouldAddAllAvailableContacts) {
    const [allContactIds, allCampaignContactIds] = await Promise.all([
      getAllContactIds(),
      getAllCampaignContactIds(campaignId),
    ]);

    if ("error" in allContactIds) {
      return { error: allContactIds.error };
    }

    if ("error" in allCampaignContactIds) {
      return { error: allCampaignContactIds.error };
    }

    const existingContactIds = new Set(allCampaignContactIds.contactIds);
    contactIds = allContactIds.contactIds.filter(
      (contactId) => !existingContactIds.has(contactId),
    );
  }

  if (contactIds.length === 0) {
    return { error: "Select at least one contact to add." };
  }

  const { response } = await client.POST("/api/v1/Campaigns/{id}/contacts", {
    params: { path: { id: campaignId } },
    body: contactIds,
  });

  if (response.status === 401 || response.status === 403) {
    redirect(`/api/auth/signin?callbackUrl=/campaigns/${campaignId}`);
  }

  if (!response.ok) {
    return {
      error: `Failed to add contacts: ${response.status} ${response.statusText}`,
    };
  }

  revalidatePath("/campaigns");
  revalidatePath(`/campaigns/${campaignId}`);

  return { message: `Added ${contactIds.length} contact(s) to the campaign.` };
}

export async function removeContactsFromCampaign(
  campaignId: string,
  _previousState: CampaignActionState,
  formData: FormData,
): Promise<CampaignActionState> {
  const shouldRemoveAllCampaignContacts =
    formData.get("removeAllCampaignContacts") === "true";
  let contactIds = getStringValues(formData, "contactIds");

  if (shouldRemoveAllCampaignContacts) {
    const allCampaignContactIds = await getAllCampaignContactIds(campaignId);

    if ("error" in allCampaignContactIds) {
      return { error: allCampaignContactIds.error };
    }

    contactIds = allCampaignContactIds.contactIds;
  }

  if (contactIds.length === 0) {
    return { error: "Select at least one contact to remove." };
  }

  const { response } = await client.DELETE("/api/v1/Campaigns/{id}/contacts", {
    params: { path: { id: campaignId } },
    body: contactIds,
  });

  if (response.status === 401 || response.status === 403) {
    redirect(`/api/auth/signin?callbackUrl=/campaigns/${campaignId}`);
  }

  if (!response.ok) {
    return {
      error: `Failed to remove contacts: ${response.status} ${response.statusText}`,
    };
  }

  revalidatePath("/campaigns");
  revalidatePath(`/campaigns/${campaignId}`);

  return {
    message: `Removed ${contactIds.length} contact(s) from the campaign.`,
  };
}
