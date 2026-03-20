"use client";

import { useState } from "react";
import Field from "@/app/common/form/Field";

interface SearchFormProps {
  onSearch: (params: Record<string, string>) => void;
  initialValues?: Record<string, string>;
}

const SearchForm = ({ onSearch, initialValues }: SearchFormProps) => {
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
          <Field 
            fieldName="CompanyName" 
            labelOverride="Company Name" 
            defaultValue={initialValues?.CompanyName}
          />
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
          <Field fieldName="Address" defaultValue={initialValues?.Address} />
          <Field fieldName="City" defaultValue={initialValues?.City} />
          <Field fieldName="State" defaultValue={initialValues?.State} />
          <Field fieldName="Zip" defaultValue={initialValues?.Zip} />
          <Field fieldName="Country" defaultValue={initialValues?.Country} />
          <Field fieldName="WebsiteUrl" labelOverride="Website URL" defaultValue={initialValues?.WebsiteUrl} />
          <Field fieldName="Type" defaultValue={initialValues?.Type} />
          <Field fieldName="TaxId" labelOverride="Tax ID" defaultValue={initialValues?.TaxId} />
          <Field fieldName="PrimaryRepName" labelOverride="Primary Rep Name" defaultValue={initialValues?.PrimaryRepName} />
          <Field fieldName="LegacyPrimaryCategory" labelOverride="Legacy Category" defaultValue={initialValues?.LegacyPrimaryCategory} />
          <Field fieldName="HubspotCompanyId" labelOverride="Hubspot ID" defaultValue={initialValues?.HubspotCompanyId} />
          
          <div className="m-4 flex items-center">
            <label className="mr-2" htmlFor="Collections">Collections:</label>
            <input 
              type="checkbox" 
              name="Collections" 
              value="true" 
              className="w-4 h-4" 
              defaultChecked={initialValues?.Collections === "true"}
            />
          </div>
          <div className="m-4 flex items-center">
            <label className="mr-2" htmlFor="WriteOff">Write Off:</label>
            <input 
              type="checkbox" 
              name="WriteOff" 
              value="true" 
              className="w-4 h-4" 
              defaultChecked={initialValues?.WriteOff === "true"}
            />
          </div>
          <div className="m-4 flex items-center">
            <label className="mr-2" htmlFor="Dead">Dead:</label>
            <input 
              type="checkbox" 
              name="Dead" 
              value="true" 
              className="w-4 h-4" 
              defaultChecked={initialValues?.Dead === "true"}
            />
          </div>
          <div className="m-4 flex items-center">
            <label className="mr-2" htmlFor="IsNewCompany">Is New Company:</label>
            <input 
              type="checkbox" 
              name="IsNewCompany" 
              value="true" 
              className="w-4 h-4" 
              defaultChecked={initialValues?.IsNewCompany === "true"}
            />
          </div>
          <div className="m-4 flex items-center">
            <label className="mr-2" htmlFor="CompanySpecialBilling">Special Billing:</label>
            <input 
              type="checkbox" 
              name="CompanySpecialBilling" 
              value="true" 
              className="w-4 h-4" 
              defaultChecked={initialValues?.CompanySpecialBilling === "true"}
            />
          </div>
        </div>
      )}
    </form>
  );
};

export default SearchForm;
