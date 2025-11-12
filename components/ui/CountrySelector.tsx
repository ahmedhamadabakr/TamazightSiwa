'use client';

import { useState } from 'react';
import {
  africanCountries,
  asianCountries,
  europeanCountries,
  northAmericanCountries,
  southAmericanCountries,
  oceaniaCountries,
  type Country
} from '@/data/countries-optimized';

interface CountrySelectorProps {
  onChange: (selected: { value: string; label: string } | null) => void;
  isDisabled?: boolean;
}

export default function CountrySelector({ onChange, isDisabled }: CountrySelectorProps) {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setValue(selectedValue);
    
    const allCountries = [
      ...africanCountries,
      ...asianCountries,
      ...europeanCountries,
      ...northAmericanCountries,
      ...southAmericanCountries,
      ...oceaniaCountries,
    ];
    
    const selected = allCountries.find((c) => c.value === selectedValue);
    onChange(selected || null);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={isDisabled}
      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value="">Select country...</option>
      
      <optgroup label="Africa">
        {africanCountries.map((country) => (
          <option key={country.value} value={country.value}>
            {country.label}
          </option>
        ))}
      </optgroup>
      
      <optgroup label="Asia">
        {asianCountries.map((country) => (
          <option key={country.value} value={country.value}>
            {country.label}
          </option>
        ))}
      </optgroup>
      
      <optgroup label="Europe">
        {europeanCountries.map((country) => (
          <option key={country.value} value={country.value}>
            {country.label}
          </option>
        ))}
      </optgroup>
      
      <optgroup label="North America">
        {northAmericanCountries.map((country) => (
          <option key={country.value} value={country.value}>
            {country.label}
          </option>
        ))}
      </optgroup>
      
      <optgroup label="South America">
        {southAmericanCountries.map((country) => (
          <option key={country.value} value={country.value}>
            {country.label}
          </option>
        ))}
      </optgroup>
      
      <optgroup label="Oceania">
        {oceaniaCountries.map((country) => (
          <option key={country.value} value={country.value}>
            {country.label}
          </option>
        ))}
      </optgroup>
    </select>
  );
}
