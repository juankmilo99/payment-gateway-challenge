import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { resetCheckout } from '../store/slices/checkoutSlice';
import { CheckCircle, XCircle, Copy, Check } from 'lucide-react';

export default function ResultPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const result = useSelector((state: RootState) => state.checkout.transactionResult);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!result) {
      navigate('/');
    }
  }, [result, navigate]);

  const handleFinish = () => {
    dispatch(resetCheckout());
    navigate('/');
  };

  if (!result) return null;

  const isSuccess = result.status === 'APPROVED';

  const truncateId = (id: string) => {
    if (!id || id.length < 12) return id;
    return `${id.slice(0, 8)}...${id.slice(-4)}`;
  };

  const handleCopy = (text: string, idType: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idType);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="container flex-1 flex flex-col items-center justify-center animate-slide-up py-12">
      <div className="card w-full text-center p-8 md:p-10">
        <div className="flex justify-center mb-8">
          {isSuccess ? (
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <CheckCircle size={56} className="text-emerald-400" />
            </div>
          ) : (
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center">
              <XCircle size={56} className="text-red-400" />
            </div>
          )}
        </div>
        
        {/* Usando h2 en vez de h1 para evitar el clash con el gradiente global en index.css */}
        <h2 className={`text-3xl font-bold mb-4 ${isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
          {isSuccess ? '¡Pago Exitoso!' : 'Pago Rechazado'}
        </h2>
        
        <p className="text-slate-300 mb-10 text-lg">
          {isSuccess 
            ? 'Tu pedido ha sido procesado y el envío será preparado en breve.' 
            : 'No pudimos procesar tu tarjeta. Por favor verifica tus datos o intenta con otro medio de pago.'}
        </p>

        <div className="bg-black/30 p-6 rounded-xl mb-10 text-sm text-left border border-white/5 flex flex-col gap-5">
          
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Estado</span>
            <span className={`font-bold px-3 py-1 rounded-full text-xs ${isSuccess ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
              {result.status}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">ID de Transacción</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-white text-sm" title={result.id}>{truncateId(result.id)}</span>
              <button 
                onClick={() => handleCopy(result.id, 'tx')}
                className="text-slate-400 hover:text-white transition-colors p-1"
                title="Copiar ID"
              >
                {copiedId === 'tx' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {result.providerReference && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Ref. Proveedor</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-emerald-400 text-sm" title={result.providerReference}>{truncateId(result.providerReference)}</span>
                <button 
                  onClick={() => handleCopy(result.providerReference, 'provider')}
                  className="text-slate-400 hover:text-white transition-colors p-1"
                  title="Copiar Referencia"
                >
                  {copiedId === 'provider' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          )}
        </div>

        <button onClick={handleFinish} className={`btn w-full ${isSuccess ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'btn-primary'}`}>
          {isSuccess ? 'Volver a la tienda' : 'Intentar nuevamente'}
        </button>
      </div>
    </div>
  );
}
