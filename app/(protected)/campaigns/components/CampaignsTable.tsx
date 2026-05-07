"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import type { components } from "@/app/api/types";
import { type CampaignActionState, deleteCampaigns } from "../actions";

type Campaign = components["schemas"]["CampaignResponse"];

const initialActionState: CampaignActionState = {};

const formatDate = (value?: string) => {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export default function CampaignsTable({
  campaigns,
}: {
  campaigns: Campaign[];
}) {
  const [actionState, formAction, isPending] = useActionState(
    deleteCampaigns,
    initialActionState,
  );
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<Set<string>>(
    () => new Set(),
  );

  const selectableCampaignIds = useMemo(
    () =>
      campaigns
        .map((campaign) => campaign.id)
        .filter((id): id is string => Boolean(id)),
    [campaigns],
  );
  const allSelected =
    selectableCampaignIds.length > 0 &&
    selectableCampaignIds.every((id) => selectedCampaignIds.has(id));

  const toggleCampaign = (campaignId: string) => {
    setSelectedCampaignIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(campaignId)) {
        nextIds.delete(campaignId);
      } else {
        nextIds.add(campaignId);
      }

      return nextIds;
    });
  };

  const toggleAllCampaigns = () => {
    setSelectedCampaignIds(
      allSelected ? new Set() : new Set(selectableCampaignIds),
    );
  };

  return (
    <form action={formAction} className="space-y-4">
      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="submit"
          disabled={selectedCampaignIds.size === 0 || isPending}
          className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
        >
          {isPending
            ? "Deleting..."
            : `Delete selected (${selectedCampaignIds.size})`}
        </button>
        <Link
          href="/campaigns/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          New campaign
        </Link>
      </div>

      {actionState.error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {actionState.error}
        </div>
      )}

      {actionState.message && (
        <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {actionState.message}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">
          {campaigns.length} campaigns
        </div>

        {campaigns.length === 0 ? (
          <div className="p-8 text-sm text-gray-600">
            No campaigns have been created yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAllCampaigns}
                      aria-label="Select all campaigns"
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Contacts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {campaigns.map((campaign) => {
                  const campaignId = campaign.id;

                  return (
                    <tr key={campaignId ?? campaign.name ?? "campaign"}>
                      <td className="px-4 py-4">
                        {campaignId && (
                          <input
                            type="checkbox"
                            name="campaignIds"
                            value={campaignId}
                            checked={selectedCampaignIds.has(campaignId)}
                            onChange={() => toggleCampaign(campaignId)}
                            aria-label={`Select ${campaign.name ?? "campaign"}`}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {campaignId ? (
                          <Link
                            href={`/campaigns/${campaignId}`}
                            className="text-sm font-medium text-blue-700 hover:underline"
                          >
                            {campaign.name || "Untitled campaign"}
                          </Link>
                        ) : (
                          <span className="text-sm font-medium text-gray-900">
                            {campaign.name || "Untitled campaign"}
                          </span>
                        )}
                        {campaign.description && (
                          <p className="mt-1 max-w-xl truncate text-sm text-gray-500">
                            {campaign.description}
                          </p>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                        {campaign.status ?? "Not set"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                        {campaign.contacts?.length ?? 0}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                        {formatDate(campaign.updatedAt ?? campaign.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </form>
  );
}
