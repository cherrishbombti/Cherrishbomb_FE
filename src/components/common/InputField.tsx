import React from 'react';
import { formatTel } from '../../utils/format';

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
    ? 'border-red-500 focus:ring-red-400 focus:border-red-400'
    : 'border-gray-300 hover:border-gray-400 focus:ring-blue-400 focus:border-blue-400';

  return (
    <div className="flex flex-col gap-1.5 w-full">
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
          w-full px-3.5 py-2.5 rounded-lg border text-sm
          focus:outline-none focus:ring-2 focus:ring-offset-0
          transition-all duration-200 ease-out motion-reduce:transition-none
          ${inputBorderStyle}
          ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'bg-white'}
        `}
      />

      {/* 에러가 있을 때만 자리를 차지하며 부드럽게 펼쳐짐 */}
      <div
        className={`grid transition-all duration-200 ease-out motion-reduce:transition-none ${
          error ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <span className="overflow-hidden text-xs text-red-500 leading-tight">{error}</span>
      </div>
    </div>
  );
};

export default InputField;
