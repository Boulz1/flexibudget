// src/components/forms/TextInputFormField.tsx
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

/**
 * Props for the TextInputFormField component.
 */
interface TextInputFormFieldProps {
  /** Unique identifier for the input field and label. */
  id: string;
  /** Text label for the input field. */
  label: string;
  /** Register function from react-hook-form. */
  register: UseFormRegisterReturn;
  /** Error object from react-hook-form for displaying validation errors. */
  error?: FieldError;
  /** Type of the input field. */
  type?: 'text' | 'number' | 'date';
  /** Placeholder text for the input field. */
  placeholder?: string;
  /** Step attribute, typically for number inputs. */
  step?: string;
  /** Optional additional CSS classes for the component's root div. */
  className?: string;
}

const baseInputClass = "w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-brand-besoins focus:border-brand-besoins transition-colors duration-150";
const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

/**
 * A reusable form field component for text, number, or date inputs,
 * integrated with react-hook-form for validation and state management.
 */
const TextInputFormField = ({
  id,
  label,
  register,
  error,
  type = 'text',
  placeholder,
  step,
  className = ''
}: TextInputFormFieldProps) => {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        {...register}
        id={id}
        type={type}
        step={step}
        placeholder={placeholder}
        className={baseInputClass}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default TextInputFormField;
