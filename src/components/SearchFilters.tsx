
import { Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  priceFilter: { min: number; max: number };
  setPriceFilter: (filter: { min: number; max: number }) => void;
  propertyTypeFilter: string;
  setPropertyTypeFilter: (type: string) => void;
}

const propertyTypes = [
  { value: "all", label: "All Property Types" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "villa", label: "Villa" },
  { value: "studio", label: "Studio" },
  { value: "flat", label: "Flat" },
];

export const SearchFilters = ({
  searchTerm,
  setSearchTerm,
  priceFilter,
  setPriceFilter,
  propertyTypeFilter,
  setPropertyTypeFilter
}: SearchFiltersProps) => {
  return (
    <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Property Type Dropdown */}
        <div>
          <Select value={propertyTypeFilter} onValueChange={setPropertyTypeFilter}>
            <SelectTrigger className="w-full h-12">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
              {propertyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min Price"
            value={priceFilter.min || ''}
            onChange={(e) => setPriceFilter({ ...priceFilter, min: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max Price"
            value={priceFilter.max || ''}
            onChange={(e) => setPriceFilter({ ...priceFilter, max: parseInt(e.target.value) || 200000 })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Filter Button */}
        <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          <Filter size={20} />
          <span>Advanced Filters</span>
        </button>
      </div>
    </div>
  );
};
