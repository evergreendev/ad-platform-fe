"use client";

import { useState } from "react";
import Field from "@/app/common/form/Field";

interface SearchFormProps {
  onSearch: (params: Record<string, string>) => void;
}

const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (value) {
        params[key] = value.toString();
      }
    });
    onSearch(params);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-wrap items-end gap-4 mb-4">
        <div className="flex-1 min-w-[200px]">
          <Field fieldName="CompanyName" labelOverride="Company Name" />
        </div>
        <div className="flex gap-2 mb-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            {isExpanded ? "Less Options" : "More Options"}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4 border-t pt-4">
          <Field fieldName="Address" />
          <Field fieldName="City" />
          <Field fieldName="State" />
          <Field fieldName="Zip" />
          <Field fieldName="Country" />
          <Field fieldName="WebsiteUrl" labelOverride="Website URL" />
          <Field fieldName="Type" />
          <Field fieldName="TaxId" labelOverride="Tax ID" />
          <Field fieldName="PrimaryRepName" labelOverride="Primary Rep Name" />
          <Field fieldName="LegacyPrimaryCategory" labelOverride="Legacy Category" />
          <Field fieldName="HubspotCompanyId" labelOverride="Hubspot ID" />
          
          <div className="m-4 flex items-center">
            <label className="mr-2" htmlFor="Collections">Collections:</label>
            <input type="checkbox" name="Collections" value="true" className="w-4 h-4" />
          </div>
          <div className="m-4 flex items-center">
            <label className="mr-2" htmlFor="WriteOff">Write Off:</label>
            <input type="checkbox" name="WriteOff" value="true" className="w-4 h-4" />
          </div>
          <div className="m-4 flex items-center">
            <label className="mr-2" htmlFor="Dead">Dead:</label>
            <input type="checkbox" name="Dead" value="true" className="w-4 h-4" />
          </div>
          <div className="m-4 flex items-center">
            <label className="mr-2" htmlFor="IsNewCompany">Is New Company:</label>
            <input type="checkbox" name="IsNewCompany" value="true" className="w-4 h-4" />
          </div>
          <div className="m-4 flex items-center">
            <label className="mr-2" htmlFor="CompanySpecialBilling">Special Billing:</label>
            <input type="checkbox" name="CompanySpecialBilling" value="true" className="w-4 h-4" />
          </div>
        </div>
      )}
    </form>
  );
};

export default SearchForm;
