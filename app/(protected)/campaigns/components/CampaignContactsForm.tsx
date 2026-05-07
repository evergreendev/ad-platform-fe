"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import type { components } from "@/app/api/types";
import {
  addContactsToCampaign,
  type CampaignActionState,
  removeContactsFromCampaign,
} from "../actions";

type Campaign = components["schemas"]["CampaignResponse"];
type Contact = components["schemas"]["ContactResponse"];

const initialActionState: CampaignActionState = {};

const getContactName = (contact: Contact) => {
  const fullName = [contact.firstName, contact.lastName]
    .filter(Boolean)
    .join(" ");
  return fullName || "Unnamed contact";
};

const getPrimaryEmail = (contact: Contact) => {
  const primaryEmail = contact.emails?.find((email) => email.isPrimary);
  return primaryEmail?.email ?? contact.emails?.[0]?.email ?? "No email";
};

export default function CampaignContactsForm({
  campaign,
  contacts,
}: {
  campaign: Campaign;
  contacts: Contact[];
}) {
  const addContactsToCurrentCampaign = addContactsToCampaign.bind(
    null,
    campaign.id ?? "",
  );
  const removeContactsFromCurrentCampaign = removeContactsFromCampaign.bind(
    null,
    campaign.id ?? "",
  );
  const [addActionState, addFormAction, isAdding] = useActionState(
    addContactsToCurrentCampaign,
    initialActionState,
  );
  const [removeActionState, removeFormAction, isRemoving] = useActionState(
    removeContactsFromCurrentCampaign,
    initialActionState,
  );
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [selectedCampaignContactIds, setSelectedCampaignContactIds] = useState<
    Set<string>
  >(() => new Set());

  const campaignContacts = useMemo(
    () => campaign.contacts ?? [],
    [campaign.contacts],
  );

  const existingContactIds = useMemo(
    () =>
      new Set(
        campaignContacts
          ?.map((campaignContact) => campaignContact.contactId)
          .filter((contactId): contactId is string => Boolean(contactId)) ?? [],
      ),
    [campaignContacts],
  );

  const availableContacts = useMemo(
    () =>
      contacts.filter(
        (contact) => contact.id && !existingContactIds.has(contact.id),
      ),
    [contacts, existingContactIds],
  );

  const currentContactIds = useMemo(
    () =>
      campaignContacts
        .map((campaignContact) => campaignContact.contactId)
        .filter((contactId): contactId is string => Boolean(contactId)),
    [campaignContacts],
  );

  const allAvailableSelected =
    availableContacts.length > 0 &&
    availableContacts.every(
      (contact) => contact.id && selectedContactIds.has(contact.id),
    );

  const allCampaignContactsSelected =
    currentContactIds.length > 0 &&
    currentContactIds.every((contactId) =>
      selectedCampaignContactIds.has(contactId),
    );

  useEffect(() => {
    setSelectedContactIds(
      (currentIds) =>
        new Set(
          [...currentIds].filter((contactId) =>
            availableContacts.some((contact) => contact.id === contactId),
          ),
        ),
    );
  }, [availableContacts]);

  useEffect(() => {
    setSelectedCampaignContactIds(
      (currentIds) =>
        new Set(
          [...currentIds].filter((contactId) =>
            currentContactIds.includes(contactId),
          ),
        ),
    );
  }, [currentContactIds]);

  const toggleAvailableContact = (contactId: string) => {
    setSelectedContactIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(contactId)) {
        nextIds.delete(contactId);
      } else {
        nextIds.add(contactId);
      }

      return nextIds;
    });
  };

  const toggleAllAvailableContacts = () => {
    setSelectedContactIds(
      allAvailableSelected
        ? new Set()
        : new Set(
            availableContacts
              .map((contact) => contact.id)
              .filter((contactId): contactId is string => Boolean(contactId)),
          ),
    );
  };

  const toggleCampaignContact = (contactId: string) => {
    setSelectedCampaignContactIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(contactId)) {
        nextIds.delete(contactId);
      } else {
        nextIds.add(contactId);
      }

      return nextIds;
    });
  };

  const toggleAllCampaignContacts = () => {
    setSelectedCampaignContactIds(
      allCampaignContactsSelected ? new Set() : new Set(currentContactIds),
    );
  };

  return (
    <div className="space-y-6">
      {(addActionState.error || removeActionState.error) && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {addActionState.error ?? removeActionState.error}
        </div>
      )}

      {(addActionState.message || removeActionState.message) && (
        <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {addActionState.message ?? removeActionState.message}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <form
          action={addFormAction}
          className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-700">
              Available contacts
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {availableContacts.length} available
              </span>
              <button
                type="submit"
                disabled={
                  selectedContactIds.size === 0 || isAdding || !campaign.id
                }
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {isAdding
                  ? "Adding..."
                  : `Add selected (${selectedContactIds.size})`}
              </button>
            </div>
          </div>

          {availableContacts.length === 0 ? (
            <div className="p-8 text-sm text-gray-600">
              Every loaded contact is already in this campaign.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-12 px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={allAvailableSelected}
                        onChange={toggleAllAvailableContacts}
                        aria-label="Select all available contacts"
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Company
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {availableContacts.map((contact) => {
                    const contactId = contact.id;

                    return (
                      <tr key={contactId ?? getContactName(contact)}>
                        <td className="px-4 py-4">
                          {contactId && (
                            <input
                              type="checkbox"
                              name="contactIds"
                              value={contactId}
                              checked={selectedContactIds.has(contactId)}
                              onChange={() => toggleAvailableContact(contactId)}
                              aria-label={`Select ${getContactName(contact)}`}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                          {getContactName(contact)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                          {getPrimaryEmail(contact)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {contact.companies
                            ?.map((company) => company.companyName)
                            .filter(Boolean)
                            .join(", ") || "No company"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </form>

        <form
          action={removeFormAction}
          className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-700">
              Campaign contacts
            </h2>
            <button
              type="submit"
              disabled={
                selectedCampaignContactIds.size === 0 ||
                isRemoving ||
                !campaign.id
              }
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
            >
              {isRemoving
                ? "Removing..."
                : `Remove selected (${selectedCampaignContactIds.size})`}
            </button>
          </div>

          {campaignContacts.length ? (
            <div className="divide-y divide-gray-200">
              <label className="flex items-center gap-3 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={allCampaignContactsSelected}
                  onChange={toggleAllCampaignContacts}
                  aria-label="Select all campaign contacts"
                  className="h-4 w-4 rounded border-gray-300"
                />
                Select all
              </label>
              {campaignContacts.map((campaignContact) => {
                const contactId = campaignContact.contactId;

                return (
                  <div
                    key={campaignContact.id ?? contactId}
                    className="flex items-start gap-3 p-4"
                  >
                    {contactId && (
                      <input
                        type="checkbox"
                        name="contactIds"
                        value={contactId}
                        checked={selectedCampaignContactIds.has(contactId)}
                        onChange={() => toggleCampaignContact(contactId)}
                        aria-label={`Select ${
                          campaignContact.contact
                            ? getContactName(campaignContact.contact)
                            : contactId
                        } for removal`}
                        className="mt-1 h-4 w-4 rounded border-gray-300"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {campaignContact.contact
                          ? getContactName(campaignContact.contact)
                          : contactId}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {campaignContact.contact
                          ? getPrimaryEmail(campaignContact.contact)
                          : "Contact details not loaded"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-sm text-gray-600">
              No contacts have been added to this campaign.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
