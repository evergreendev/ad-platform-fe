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
        // Only add to params if not "either" (case-insensitive for safety)
        if (value.toString().toLowerCase() !== "either") {
          params[key] = value.toString();
        }
      }
    });

    // Handle checkboxes that are not checked (should send "false")
    const checkboxes = ["dead"];
    checkboxes.forEach((name) => {
      if (!formData.has(name)) {
        params[name] = "false";
      }
    });

    onSearch(params);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-wrap items-end gap-4 mb-4">
        <div className="flex-1 min-w-50">
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
          
          <div className="m-4">
            <label className="mr-2" htmlFor="Collections">Collections:</label>
            <select 
              name="Collections" 
              className="bg-white border border-green-100 p-2 rounded"
              defaultValue={initialValues?.Collections === "true" ? "true" : initialValues?.Collections === "false" ? "false" : "either"}
            >
              <option value="either">Either</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="m-4">
            <label className="mr-2" htmlFor="WriteOff">Write Off:</label>
            <select 
              name="WriteOff" 
              className="bg-white border border-green-100 p-2 rounded"
              defaultValue={initialValues?.WriteOff === "true" ? "true" : initialValues?.WriteOff === "false" ? "false" : "either"}
            >
              <option value="either">Either</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="m-4 flex items-center">
            <label className="mr-2" htmlFor="dead">Show Inactive Companies:</label>
            <input 
              type="checkbox" 
              id="dead"
              name="dead" 
              value="true" 
              className="w-4 h-4" 
              defaultChecked={initialValues?.dead === "true" || initialValues?.Dead === "true"}
            />
          </div>
          <div className="m-4">
            <label className="mr-2" htmlFor="IsNewCompany">Is New Company:</label>
            <select 
              name="IsNewCompany" 
              className="bg-white border border-green-100 p-2 rounded"
              defaultValue={initialValues?.IsNewCompany === "true" ? "true" : initialValues?.IsNewCompany === "false" ? "false" : "either"}
            >
              <option value="either">Either</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="m-4">
            <label className="mr-2" htmlFor="CompanySpecialBilling">Special Billing:</label>
            <select 
              name="CompanySpecialBilling" 
              className="bg-white border border-green-100 p-2 rounded"
              defaultValue={initialValues?.CompanySpecialBilling === "true" ? "true" : initialValues?.CompanySpecialBilling === "false" ? "false" : "either"}
            >
              <option value="either">Either</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
      )}
    </form>
  );
};

export default SearchForm;
