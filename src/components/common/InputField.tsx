import React from 'react';

type InputType = 'text' | 'password' | 'tel' | 'number';

interface InputFieldProps {
  label?: string;
  type?: InputType;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

const formatTel = (raw: string) => {
  const numbers = raw.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  disabled = false,
  required = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (type === 'tel') {
      const formatted = formatTel(rawValue);
      // 부모에 formatted 값으로 전달
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: formatted },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
      return;
    }

    if (type === 'number') {
      if (!/^\d*$/.test(rawValue)) return;
    }

    onChange(e);
  };

  const inputBorderStyle = error
    ? 'border-red-500 focus:ring-red-400'
    : 'border-gray-300 focus:ring-blue-400';

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-3 py-2 rounded-md border text-sm
          focus:outline-none focus:ring-2
          transition-colors duration-200
          ${inputBorderStyle}
          ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'bg-white'}
        `}
      />

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default InputField;
