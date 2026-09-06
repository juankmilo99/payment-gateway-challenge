import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';

interface CreditCardInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCardTypeChange?: (type: 'visa' | 'mastercard' | 'unknown') => void;
}

export const CreditCardInput: React.FC<CreditCardInputProps> = ({ onChange, onCardTypeChange, ...props }) => {
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'unknown'>('unknown');

  const detectCardType = (number: string) => {
    // Visa starts with 4
    if (/^4/.test(number)) return 'visa';
    // Mastercard starts with 51-55 or 2221-2720
    if (/^5[1-5]/.test(number) || /^2(?:2(?:2[1-9]|[3-9]\d)|[3-6]\d\d|7(?:[01]\d|20))/.test(number)) {
      return 'mastercard';
    }
    return 'unknown';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Keep only numbers
    const type = detectCardType(value);
    
    setCardType(type);
    if (onCardTypeChange) {
      onCardTypeChange(type);
    }

    // Format with spaces for display (optional, keeping it simple for now)
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="relative">
      <input
        {...props}
        onChange={handleChange}
        className={`form-input pl-10 ${props.className || ''}`}
        maxLength={19}
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
        {cardType === 'visa' ? (
          <span className="text-blue-500 font-bold italic text-sm">VISA</span>
        ) : cardType === 'mastercard' ? (
          <div className="flex -space-x-1">
             <div className="w-3 h-3 rounded-full bg-red-500 opacity-80 mix-blend-multiply"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80 mix-blend-multiply"></div>
          </div>
        ) : (
          <CreditCard size={18} className="text-slate-400" />
        )}
      </div>
    </div>
  );
};
