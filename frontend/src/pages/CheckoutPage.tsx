import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { updateCustomer, updateDelivery, updatePayment, setTransactionResult, clearSensitiveData } from '../store/slices/checkoutSlice';
import { CreditCardInput } from '../components/ui/CreditCardInput';
import { PaymentSummaryBackdrop } from '../components/checkout/PaymentSummaryBackdrop';
import { api } from '../services/api';
import { ChevronLeft } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productId, productName, productPrice, customer, delivery, payment } = useSelector((state: RootState) => state.checkout);

  const [showSummary, setShowSummary] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Fixed fees as per backend logic
  const baseFee = 1500;
  const deliveryFee = 500;

  useEffect(() => {
    if (!productId) {
      navigate('/');
    }
  }, [productId, navigate]);

  if (!productId) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, section: 'customer' | 'delivery' | 'payment') => {
    const { name, value } = e.target;
    if (section === 'customer') dispatch(updateCustomer({ [name]: value }));
    if (section === 'delivery') dispatch(updateDelivery({ [name]: value }));
    if (section === 'payment') dispatch(updatePayment({ [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSummary(true);
  };

  const processPayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      const payload = {
        productId,
        customer,
        delivery,
        payment
      };

      const response = await api.post('/transactions', payload);
      
      dispatch(clearSensitiveData()); // Never keep CC in Redux after sending
      dispatch(setTransactionResult({
        id: response.data.id,
        status: response.data.status,
        providerReference: response.data.providerReference
      }));
      
      navigate('/result');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al procesar el pago. Por favor intenta nuevamente.');
      setShowSummary(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container py-8 animate-slide-up">
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center text-sm text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ChevronLeft size={16} className="mr-1" /> Volver al producto
      </button>

      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-1">Completa tu compra</h2>
        <p className="text-sm text-slate-400 mb-6">Estás comprando: <strong className="text-white">{productName}</strong></p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-md mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Datos Personales */}
          <div className="mb-8">
            <h3 className="text-md font-medium text-indigo-300 mb-4 pb-2 border-b border-white/5">1. Datos Personales</h3>
            <div className="form-group">
              <label className="form-label">Nombre Completo</label>
              <input required type="text" name="fullName" value={customer.fullName} onChange={e => handleInputChange(e, 'customer')} className="form-input" placeholder="Ej. Juan Pérez" />
            </div>
            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input required type="email" name="email" value={customer.email} onChange={e => handleInputChange(e, 'customer')} className="form-input" placeholder="juan@ejemplo.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input required type="tel" name="phone" value={customer.phone} onChange={e => handleInputChange(e, 'customer')} className="form-input" placeholder="+57 300 000 0000" />
            </div>
          </div>

          {/* Envío */}
          <div className="mb-8">
            <h3 className="text-md font-medium text-indigo-300 mb-4 pb-2 border-b border-white/5">2. Datos de Envío</h3>
            <div className="form-group">
              <label className="form-label">Dirección</label>
              <input required type="text" name="address" value={delivery.address} onChange={e => handleInputChange(e, 'delivery')} className="form-input" placeholder="Calle 123 #45-67" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Ciudad</label>
                <input required type="text" name="city" value={delivery.city} onChange={e => handleInputChange(e, 'delivery')} className="form-input" placeholder="Bogotá" />
              </div>
              <div className="form-group">
                <label className="form-label">Región/Estado</label>
                <input type="text" name="region" value={delivery.region} onChange={e => handleInputChange(e, 'delivery')} className="form-input" placeholder="Cundinamarca" />
              </div>
            </div>
          </div>

          {/* Pago */}
          <div className="mb-8">
            <h3 className="text-md font-medium text-indigo-300 mb-4 pb-2 border-b border-white/5">3. Tarjeta de Crédito</h3>
            <div className="form-group">
              <label className="form-label">Número de Tarjeta</label>
              <CreditCardInput 
                required 
                name="cardNumber" 
                value={payment.cardNumber} 
                onChange={e => handleInputChange(e, 'payment')} 
                placeholder="0000 0000 0000 0000"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Titular de la Tarjeta</label>
              <input required type="text" name="cardHolder" value={payment.cardHolder} onChange={e => handleInputChange(e, 'payment')} className="form-input" placeholder="Como aparece en la tarjeta" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label">Mes (MM)</label>
                <input required type="text" name="expMonth" maxLength={2} value={payment.expMonth} onChange={e => handleInputChange(e, 'payment')} className="form-input" placeholder="MM" />
              </div>
              <div className="form-group">
                <label className="form-label">Año (YY)</label>
                <input required type="text" name="expYear" maxLength={2} value={payment.expYear} onChange={e => handleInputChange(e, 'payment')} className="form-input" placeholder="YY" />
              </div>
              <div className="form-group">
                <label className="form-label">CVC</label>
                <input required type="password" name="cvc" maxLength={4} value={payment.cvc} onChange={e => handleInputChange(e, 'payment')} className="form-input" placeholder="123" />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            Continuar al Resumen
          </button>
        </form>
      </div>

      {showSummary && (
        <PaymentSummaryBackdrop
          productName={productName}
          productPrice={productPrice}
          baseFee={baseFee}
          deliveryFee={deliveryFee}
          isLoading={isProcessing}
          onConfirm={processPayment}
          onCancel={() => setShowSummary(false)}
        />
      )}
    </div>
  );
}
