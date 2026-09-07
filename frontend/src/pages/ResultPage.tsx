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
        
        {/* Ícono superior */}
        <div className="flex justify-center mb-6">
          {isSuccess ? (
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <CheckCircle size={56} className="text-emerald-500" />
            </div>
          ) : (
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center">
              <XCircle size={56} className="text-red-500" />
            </div>
          )}
        </div>
        
        {/* Título y Párrafo descriptivo */}
        <h2 className="text-3xl font-bold mb-4 text-white">
          {isSuccess ? '¡Pago Exitoso!' : 'Pago Rechazado'}
        </h2>
        
        <p className="text-slate-300 text-lg mb-8">
          {isSuccess 
            ? 'Tu pedido ha sido procesado y el envío será preparado en breve.' 
            : 'No pudimos procesar tu tarjeta. Por favor verifica tus datos o intenta con otro medio de pago.'}
        </p>

        {/* Bloque de detalles estructurado con Flexbox */}
        <div className="bg-black/30 p-6 rounded-xl mb-10 border border-white/10 flex flex-col gap-6">
          
          {/* Fila: Estado */}
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Estado:</span>
            <span className={`font-bold text-sm ${isSuccess ? 'text-emerald-500' : 'text-red-500'}`}>
              {result.status}
            </span>
          </div>

          {/* Fila: ID de Transacción */}
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">ID de Transacción:</span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-white text-sm" title={result.id}>
                {truncateId(result.id)}
              </span>
              <button 
                onClick={() => handleCopy(result.id, 'tx')}
                className="bg-transparent border-none p-0 text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                title="Copiar ID"
              >
                {copiedId === 'tx' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Fila: Referencia Proveedor (Si existe) */}
          {result.providerReference && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Ref. Proveedor:</span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-white text-sm" title={result.providerReference}>
                  {truncateId(result.providerReference)}
                </span>
                <button 
                  onClick={() => handleCopy(result.providerReference!, 'provider')}
                  className="bg-transparent border-none p-0 text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                  title="Copiar Referencia"
                >
                  {copiedId === 'provider' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Botón Final (Restaurado a su estilo primary original) */}
        <button onClick={handleFinish} className="btn btn-primary w-full font-bold text-white">
          {isSuccess ? 'Volver a la tienda' : 'Intentar nuevamente'}
        </button>
      </div>
    </div>
  );
}
