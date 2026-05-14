"use server";

import client from "@/app/api/client";

export type SendEmailActionState = {
  error?: string;
  message?: string;
};

const getRequiredString = (formData: FormData, fieldName: string) => {
  const value = formData.get(fieldName);

  return typeof value === "string" ? value.trim() : "";
};

export async function sendContactEmail(
  _previousState: SendEmailActionState,
  formData: FormData,
): Promise<SendEmailActionState> {
  const toEmail = getRequiredString(formData, "toEmail");
  const subject = getRequiredString(formData, "subject");
  const htmlBody = getRequiredString(formData, "htmlBody");
  const scheduleEmail = formData.get("scheduleEmail") === "on";

  if (!toEmail) {
    return { error: "Recipient email is required." };
  }

  if (!subject) {
    return { error: "Subject is required." };
  }

  if (!htmlBody) {
    return { error: "Email body is required." };
  }

  if (scheduleEmail) {
    return {
      error:
        "Scheduling details were entered, but the email API does not currently expose a scheduling endpoint.",
    };
  }

  const { data, response } = await client.POST("/api/v1/EmailMarketing/send", {
    body: {
      toEmail,
      subject,
      htmlBody,
    },
  });

  if (!response.ok || data?.success === false) {
    return {
      error:
        data?.message ??
        `Failed to send email: ${response.status} ${response.statusText}`,
    };
  }

  return { message: data?.message ?? "Email sent." };
}
