import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setProduct, resetCheckout } from '../store/slices/checkoutSlice';
import { api } from '../services/api';
import { Spinner } from '../components/ui/Spinner';
import { ShoppingBag } from 'lucide-react';

export default function ProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Reset any previous checkout state when landing on product page
    dispatch(resetCheckout());

    // Fetch products
    const fetchProduct = async () => {
      try {
        const response = await api.get('/products');
        if (response.data && response.data.length > 0) {
          setProducts(response.data);
        } else {
          setError('No hay productos disponibles.');
        }
      } catch (err: any) {
        if (err.code === 'ECONNABORTED') {
          setError('El servidor tardó demasiado en responder. Por favor recarga la página.');
        } else {
          setError('Error al cargar el producto.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [dispatch]);

  const handleBuy = (product: any) => {
    dispatch(setProduct({ id: product.id, price: product.price, name: product.name }));
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="container flex-1 flex flex-col items-center justify-center">
        <Spinner 
          size="lg" 
          message="Conectando con la tienda..." 
          subMessage="Estamos despertando el servidor, esto puede tardar unos segundos..." 
        />
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="container flex-1 flex flex-col items-center justify-center">
        <div className="card text-center p-8 w-full">
          <p className="text-red-400 mb-4">{error || 'No hay productos disponibles'}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-slide-up pb-12 mt-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center text-white">Nuestros Productos</h1>
      <div className="flex flex-col space-y-12">
        {products.map((product) => (
          <div key={product.id} className="card overflow-hidden p-0 flex flex-col border border-white/10 hover:border-indigo-500/50 transition-all hover:-translate-y-1">
            <div className="bg-black/40 border-b border-white/5 overflow-hidden flex items-center justify-center py-8">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  loading="lazy"
                  style={{ width: '125px', height: '125px', objectFit: 'contain' }}
                  className="transition-transform hover:scale-110 duration-500 drop-shadow-2xl"
                />
              ) : (
                <div style={{ width: '125px', height: '125px' }} className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center rounded-lg">
                  <ShoppingBag size={48} className="text-indigo-400 opacity-80" />
                </div>
              )}
            </div>
            <div className="p-6 flex flex-col flex-1 items-center justify-center text-center">
              <h2 className="text-xl font-bold mb-3 text-white line-clamp-2 text-center w-full">{product.name}</h2>
              <p className="text-slate-400 text-sm mb-6 line-clamp-3 flex-1 text-center w-full">
                {product.description}
              </p>
              
              <div className="flex flex-col w-full items-center justify-center mb-6 gap-3">
                <div className="text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Precio</p>
                  <p className="text-2xl font-bold text-white">${(product.price / 100).toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Disponibilidad</p>
                  {product.stock > 0 ? (
                    <p className="text-emerald-400 font-medium">{product.stock} disp.</p>
                  ) : (
                    <p className="text-red-400 font-medium">Agotado</p>
                  )}
                </div>
              </div>

              <button 
                onClick={() => handleBuy(product)} 
                disabled={product.stock <= 0}
                className="btn btn-primary w-full"
              >
                {product.stock > 0 ? 'Comprar ahora' : 'Sin stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
