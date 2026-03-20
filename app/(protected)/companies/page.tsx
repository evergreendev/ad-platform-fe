"use client";

import { useState, useEffect } from "react";
import SearchForm from "./components/SearchForm";

const CompaniesPage = () => {
  const [data, setData] = useState<any>(null);
  const [params, setParams] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = async (searchParams: Record<string, string>) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(searchParams).toString();
      const response = await fetch(`/api/proxy/Companies?${query}`, { cache: "no-store" });
      
      if (response.status === 401) {
        window.location.href = "/api/auth/signin";
        return;
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies({});
  }, []);

  const handleSearch = (newParams: Record<string, string>) => {
    setParams(newParams);
    fetchCompanies(newParams);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="mt-2 text-sm text-gray-600">Search and manage companies in the system.</p>
        </div>

        <SearchForm onSearch={handleSearch} />

        {loading && (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}

        {data && (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
              Results ({data.totalCount || data.length || 0})
            </div>
            <div className="overflow-x-auto">
              {Array.isArray(data) || Array.isArray(data.items) ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City/State</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(Array.isArray(data) ? data : data.items).map((company: any, index: number) => (
                      <tr key={company.id || index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{company.companyName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.city}{company.state ? `, ${company.state}` : ''}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {company.websiteUrl && (
                            <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              Link
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8">
                   <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto">{JSON.stringify(data, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompaniesPage;
