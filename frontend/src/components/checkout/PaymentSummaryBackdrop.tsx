import React from 'react';
import { Spinner } from '../ui/Spinner';

interface PaymentSummaryBackdropProps {
  productName: string;
  productPrice: number; // in cents
  baseFee: number; // in cents
  deliveryFee: number; // in cents
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const PaymentSummaryBackdrop: React.FC<PaymentSummaryBackdropProps> = ({
  productName,
  productPrice,
  baseFee,
  deliveryFee,
  onConfirm,
  onCancel,
  isLoading
}) => {
  const total = productPrice + baseFee + deliveryFee;
  const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div className="backdrop">
      <div className="card w-full max-w-sm animate-slide-up relative">
        <h3 className="text-xl font-bold mb-4">Resumen de Pago</h3>
        
        <div className="space-y-3 mb-6 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-300">{productName}</span>
            <span className="font-medium text-white">{formatMoney(productPrice)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Tarifa base</span>
            <span>{formatMoney(baseFee)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Envío</span>
            <span>{formatMoney(deliveryFee)}</span>
          </div>
          <div className="border-t border-white/10 pt-3 mt-3 flex justify-between font-bold text-lg text-white">
            <span>Total a pagar</span>
            <span>{formatMoney(total)}</span>
          </div>
        </div>

        {isLoading ? (
          <Spinner 
            message="Procesando pago..." 
            subMessage="Por favor no cierres ni recargues esta ventana" 
          />
        ) : (
          <div className="flex gap-3 mt-6">
            <button 
              onClick={onCancel}
              className="btn bg-white/5 hover:bg-white/10 text-white flex-1"
            >
              Cancelar
            </button>
            <button 
              onClick={onConfirm}
              className="btn btn-primary flex-1"
            >
              Confirmar Pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
