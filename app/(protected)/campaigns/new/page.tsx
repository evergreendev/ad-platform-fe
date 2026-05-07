import NewCampaignForm from "../components/NewCampaignForm";

export default function NewCampaignPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <main className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Campaign</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create a campaign to organize outreach contacts and activity.
          </p>
        </div>

        <NewCampaignForm />
      </main>
    </div>
  );
}
