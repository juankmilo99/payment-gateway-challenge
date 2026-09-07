import React from 'react';
import { CreditCard } from 'lucide-react';

interface CreditCardInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
}

export const CreditCardInput: React.FC<CreditCardInputProps> = (props) => {
  const detectCardType = (number: string) => {
    if (!number) return 'unknown';
    // Visa starts with 4
    if (/^4/.test(number)) return 'visa';
    // Mastercard starts with 51-55 or 2221-2720
    if (/^5[1-5]/.test(number) || /^2(?:2(?:2[1-9]|[3-9]\d)|[3-6]\d\d|7(?:[01]\d|20))/.test(number)) {
      return 'mastercard';
    }
    return 'unknown';
  };

  const cardType = detectCardType(props.value);

  return (
    <div className="relative">
      <input
        {...props}
        className={`form-input pl-10 ${props.className || ''}`}
        maxLength={19}
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
        {cardType === 'visa' ? (
          <span className="text-blue-500 font-bold italic text-sm tracking-tighter">VISA</span>
        ) : cardType === 'mastercard' ? (
          <div className="flex -space-x-1.5">
             <div className="w-4 h-4 rounded-full bg-red-500 opacity-90 mix-blend-screen"></div>
             <div className="w-4 h-4 rounded-full bg-yellow-500 opacity-90 mix-blend-screen"></div>
          </div>
        ) : (
          <CreditCard size={18} className="text-slate-400" />
        )}
      </div>
    </div>
  );
};
