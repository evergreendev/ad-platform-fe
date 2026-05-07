"use client";

import { useActionState } from "react";
import type { components } from "@/app/api/types";
import { type CampaignActionState, createCampaign } from "../actions";

type CampaignStatus = components["schemas"]["CampaignStatus"];

const campaignStatuses: CampaignStatus[] = ["Draft", "Active", "Completed"];
const initialActionState: CampaignActionState = {};

export default function NewCampaignForm() {
  const [actionState, formAction, isPending] = useActionState(
    createCampaign,
    initialActionState,
  );

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Campaign name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
        />
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue="Draft"
          className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
        >
          {campaignStatuses.map((campaignStatus) => (
            <option key={campaignStatus} value={campaignStatus}>
              {campaignStatus}
            </option>
          ))}
        </select>
      </div>

      {actionState.error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {actionState.error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isPending ? "Creating..." : "Create campaign"}
        </button>
      </div>
    </form>
  );
}
