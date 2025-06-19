// src/components/forms/SelectFormField.tsx
// src/components/forms/SelectFormField.tsx
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

/**
 * Represents a single option for the SelectFormField.
 */
interface SelectOption {
  /** The actual value of the option. */
  value: string | number;
  /** The human-readable label for the option. */
  label: string;
}

/**
 * Props for the SelectFormField component.
 */
interface SelectFormFieldProps {
  /** Unique identifier for the select field and label. */
  id: string;
  /** Text label for the select field. */
  label: string;
  /** Register function from react-hook-form. */
  register: UseFormRegisterReturn;
  /** Error object from react-hook-form for displaying validation errors. */
  error?: FieldError;
  /** Array of options to populate the select dropdown. */
  options: SelectOption[];
  /** Whether the select field is disabled. */
  disabled?: boolean;
  /** Optional additional CSS classes for the component's root div. */
  className?: string;
  /**
   * Default value for the select.
   * Used for initial empty/placeholder state; primary default setting should be via RHF's `useForm({ defaultValues: ... })`.
   */
  defaultValue?: string;
  /** Custom label for the initial disabled option (e.g., 'Select an item...'). */
  placeholderOptionLabel?: string;
}

const baseInputClass = "w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-brand-besoins focus:border-brand-besoins transition-colors duration-150";
const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

/**
 * A reusable form field component for select dropdowns,
 * integrated with react-hook-form for validation and state management.
 */
const SelectFormField = ({
  id,
  label,
  register,
  error,
  options,
  disabled = false,
  className = '',
  defaultValue = '',
  placeholderOptionLabel
}: SelectFormFieldProps) => {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <select
        {...register}
        id={id}
        disabled={disabled}
        className={baseInputClass}
        defaultValue={defaultValue}
      >
        <option value="">{placeholderOptionLabel || `Sélectionner ${label.toLowerCase()}...`}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default SelectFormField;
