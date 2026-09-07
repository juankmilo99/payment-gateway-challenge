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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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

  const validateField = (name: string, value: string) => {
    let err = '';
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (name === 'cardNumber') {
      const unmasked = value.replace(/\s+/g, '');
      if (unmasked.length > 0 && unmasked.length < 13) err = 'Tarjeta inválida (mínimo 13 dígitos)';
    }
    if (name === 'expMonth' || name === 'expYear') {
      const mVal = name === 'expMonth' ? value : payment.expMonth;
      const yVal = name === 'expYear' ? value : payment.expYear;
      
      if (name === 'expMonth' && value.length > 0 && (value.length < 2 || parseInt(value) < 1 || parseInt(value) > 12)) {
        err = 'Mes inválido (01-12)';
      } else if (name === 'expYear' && value.length > 0 && value.length < 2) {
        err = 'Año inválido (YY)';
      } else if (mVal.length === 2 && yVal.length === 2) {
        const y = parseInt(yVal);
        const m = parseInt(mVal);
        if (y < currentYear || (y === currentYear && m < currentMonth)) {
          err = 'Tarjeta expirada';
          // Also flag the other field if expired
          setValidationErrors(prev => ({ ...prev, expMonth: 'Tarjeta expirada', expYear: 'Tarjeta expirada' }));
          return; // Skip normal setting below to avoid overriding
        } else {
          // Clear both if valid
          setValidationErrors(prev => ({ ...prev, expMonth: '', expYear: '' }));
          return;
        }
      }
    }
    if (name === 'cvc') {
      if (value.length > 0 && value.length < 3) err = 'CVC muy corto';
    }
    setValidationErrors(prev => ({ ...prev, [name]: err }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, section: 'customer' | 'delivery' | 'payment') => {
    let { name, value } = e.target;
    if (section === 'customer') {
      if (name === 'phone') {
        // Permite números, espacios, +, -, y paréntesis, pero elimina cualquier letra u otro símbolo raro
        value = value.replace(/[^\d\s\+\-\(\)]/g, '');
      }
      dispatch(updateCustomer({ [name]: value }));
    }
    if (section === 'delivery') dispatch(updateDelivery({ [name]: value }));
    if (section === 'payment') {
      if (['cardNumber', 'expMonth', 'expYear', 'cvc'].includes(name)) {
        value = value.replace(/\D/g, ''); // Ensure only numbers are allowed
      }
      dispatch(updatePayment({ [name]: value }));
      validateField(name, value);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!customer.fullName || !customer.email || !customer.phone || !delivery.address || !delivery.city || !payment.cardNumber || !payment.expMonth || !payment.expYear || !payment.cvc) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    // Final pre-submit validation
    const hasErrors = Object.values(validationErrors).some(err => err !== '');
    if (hasErrors) {
      setError('Por favor, corrige los errores en el formulario antes de continuar.');
      return;
    }
    if (payment.expMonth.length < 2 || payment.expYear.length < 2 || payment.cvc.length < 3 || payment.cardNumber.length < 13) {
      setError('Por favor completa todos los datos de la tarjeta correctamente.');
      return;
    }
    
    setError('');
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
      
      dispatch(clearSensitiveData());
      dispatch(setTransactionResult({
        id: response.data.id,
        status: response.data.status,
        providerReference: response.data.providerReference
      }));
      
      navigate('/result');
    } catch (err: any) {
      let msg = err.response?.data?.message || 'Error al procesar el pago. Por favor intenta nuevamente.';
      if (Array.isArray(msg)) {
        msg = msg.join(' | ');
      }
      setError(msg);
      setShowSummary(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container py-8 animate-slide-up">
      <button 
        onClick={() => navigate('/')} 
        className="btn border border-white/20 bg-black/20 hover:bg-white/10 text-white mb-6 max-w-[240px] transition-all"
      >
        <ChevronLeft size={18} className="mr-2" /> Volver a productos
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
              <input required type="tel" maxLength={20} name="phone" value={customer.phone} onChange={e => handleInputChange(e, 'customer')} className="form-input" placeholder="+57 300 000 0000" />
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
              {validationErrors.cardNumber && <span className="text-red-400 text-xs mt-1 block">{validationErrors.cardNumber}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Titular de la Tarjeta</label>
              <input required type="text" name="cardHolder" value={payment.cardHolder} onChange={e => handleInputChange(e, 'payment')} className="form-input" placeholder="Como aparece en la tarjeta" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label">Mes (MM)</label>
                <input required type="text" name="expMonth" maxLength={2} value={payment.expMonth} onChange={e => handleInputChange(e, 'payment')} className={`form-input ${validationErrors.expMonth ? 'border-red-500/50' : ''}`} placeholder="MM" />
                {validationErrors.expMonth && <span className="text-red-400 text-xs mt-1 block leading-tight">{validationErrors.expMonth}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Año (YY)</label>
                <input required type="text" name="expYear" maxLength={2} value={payment.expYear} onChange={e => handleInputChange(e, 'payment')} className={`form-input ${validationErrors.expYear ? 'border-red-500/50' : ''}`} placeholder="YY" />
                {validationErrors.expYear && <span className="text-red-400 text-xs mt-1 block leading-tight">{validationErrors.expYear}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">CVC</label>
                <input required type="password" name="cvc" maxLength={4} value={payment.cvc} onChange={e => handleInputChange(e, 'payment')} className={`form-input ${validationErrors.cvc ? 'border-red-500/50' : ''}`} placeholder="123" />
                {validationErrors.cvc && <span className="text-red-400 text-xs mt-1 block leading-tight">{validationErrors.cvc}</span>}
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
