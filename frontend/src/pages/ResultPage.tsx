import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { resetCheckout } from '../store/slices/checkoutSlice';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ResultPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const result = useSelector((state: RootState) => state.checkout.transactionResult);

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

  return (
    <div className="container flex-1 flex flex-col items-center justify-center animate-slide-up">
      <div className="card w-full text-center p-8">
        <div className="flex justify-center mb-6">
          {isSuccess ? (
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <CheckCircle size={48} className="text-emerald-400" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
              <XCircle size={48} className="text-red-400" />
            </div>
          )}
        </div>
        
        <h1 className={`text-2xl font-bold mb-2 ${isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
          {isSuccess ? '¡Pago Exitoso!' : 'Pago Rechazado'}
        </h1>
        
        <p className="text-slate-300 mb-6">
          {isSuccess 
            ? 'Tu pedido ha sido procesado y el envío será preparado en breve.' 
            : 'No pudimos procesar tu tarjeta. Por favor verifica tus datos o intenta con otro medio de pago.'}
        </p>

        <div className="bg-black/20 p-4 rounded-lg mb-8 text-sm text-left border border-white/5 space-y-4">
          <div className="flex flex-col">
            <span className="text-slate-400 text-xs mb-1 uppercase tracking-wider">ID de Transacción</span>
            <span className="font-mono text-white text-sm break-all">{result.id}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-xs mb-1 uppercase tracking-wider">Estado</span>
            <span className="font-semibold text-white">{result.status}</span>
          </div>
          {result.providerReference && (
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs mb-1 uppercase tracking-wider">Referencia Proveedor</span>
              <span className="font-mono text-emerald-400 text-sm break-all">{result.providerReference}</span>
            </div>
          )}
        </div>

        <button onClick={handleFinish} className="btn btn-primary">
          {isSuccess ? 'Volver a la tienda' : 'Intentar nuevamente'}
        </button>
      </div>
    </div>
  );
}
