"use client";

import { CalendarClock, LucideMail, X } from "lucide-react";
import { useActionState, useMemo, useState } from "react";
import type { components } from "@/app/api/types";
import { type SendEmailActionState, sendContactEmail } from "../actions";

type Contact = components["schemas"]["ContactResponse"];

const initialActionState: SendEmailActionState = {};

const getContactName = (contact: Contact) => {
  const fullName = [contact.firstName, contact.lastName]
    .filter(Boolean)
    .join(" ");

  return fullName || "this contact";
};

const getPrimaryEmail = (contact: Contact) => {
  const primaryEmail = contact.emails?.find((email) => email.isPrimary);

  return primaryEmail?.email ?? contact.emails?.[0]?.email ?? "";
};

const EmailButton = ({
  contact,
  isOpen,
  onClick,
  onClose,
}: {
  contact: Contact;
  isOpen?: boolean;
  onClick?: () => void;
  onClose?: () => void;
}) => {
  const [scheduleEmail, setScheduleEmail] = useState(false);
  const [actionState, formAction, isPending] = useActionState(
    sendContactEmail,
    initialActionState,
  );
  const contactName = useMemo(() => getContactName(contact), [contact]);
  const toEmail = useMemo(() => getPrimaryEmail(contact), [contact]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-10">
          <button
            type="button"
            aria-label="Close email form"
            onClick={onClose}
            className="absolute inset-0 bg-green-950 opacity-20"
          />
          <div className="absolute top-1/2 left-1/2 flex w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg bg-white text-green-950 shadow-xl">
            <div className="flex w-full items-center justify-between bg-blue-500 p-3 text-white">
              <div className="font-bold">Send an email to {contactName}</div>
              <button
                type="button"
                onClick={onClose}
                className="rounded p-1 hover:bg-blue-600"
                aria-label="Close email form"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
            <form action={formAction} className="space-y-4 p-4 text-left">
              <div>
                <label
                  htmlFor={`toEmail-${contact.id}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  To
                </label>
                <input
                  id={`toEmail-${contact.id}`}
                  name="toEmail"
                  type="email"
                  required
                  defaultValue={toEmail}
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label
                  htmlFor={`subject-${contact.id}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Subject
                </label>
                <input
                  id={`subject-${contact.id}`}
                  name="subject"
                  type="text"
                  required
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label
                  htmlFor={`htmlBody-${contact.id}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id={`htmlBody-${contact.id}`}
                  name="htmlBody"
                  rows={8}
                  required
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  name="scheduleEmail"
                  type="checkbox"
                  checked={scheduleEmail}
                  onChange={(event) => setScheduleEmail(event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                />
                Schedule Email
              </label>

              {scheduleEmail && (
                <div className="grid gap-4 rounded-md border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`scheduledDate-${contact.id}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date
                    </label>
                    <input
                      id={`scheduledDate-${contact.id}`}
                      name="scheduledDate"
                      type="date"
                      required={scheduleEmail}
                      className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`scheduledTime-${contact.id}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Time
                    </label>
                    <input
                      id={`scheduledTime-${contact.id}`}
                      name="scheduledTime"
                      type="time"
                      required={scheduleEmail}
                      className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor={`timezone-${contact.id}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Time zone
                    </label>
                    <input
                      id={`timezone-${contact.id}`}
                      name="timezone"
                      type="text"
                      defaultValue={
                        Intl.DateTimeFormat().resolvedOptions().timeZone
                      }
                      required={scheduleEmail}
                      className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>
              )}

              {actionState.error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {actionState.error}
                </div>
              )}

              {actionState.message && (
                <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                  {actionState.message}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isPending || !toEmail}
                  className="inline-flex items-center gap-2 rounded-md bg-green-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
                >
                  {scheduleEmail && <CalendarClock size={18} />}
                  {isPending
                    ? "Sending..."
                    : scheduleEmail
                      ? "Schedule email"
                      : "Send email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <button
        type="button"
        className="cursor-pointer rounded bg-green-800 p-2 text-white hover:bg-green-500"
        onClick={onClick}
        aria-label="Send email"
        title="Send email"
      >
        <LucideMail />
      </button>
    </>
  );
};

export default EmailButton;
