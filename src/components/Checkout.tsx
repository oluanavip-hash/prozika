import React, { useState, useEffect } from 'react';
import { X, MapPin, CreditCard, User, Truck, Loader2, QrCode } from 'lucide-react';
import { CartItem } from '../types';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { calculateCartTotals } from '../utils/cartUtils';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderSuccess: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ isOpen, onClose, cartItems, onOrderSuccess }) => {
  const { user, isMockUser } = useAuth();
  const [personalData, setPersonalData] = useState({ name: '', email: '', phone: '' });
  const [deliveryData, setDeliveryData] = useState({ cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' });
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [shippingCalculated, setShippingCalculated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Popula apenas o e-mail do usuário logado, deixando os outros campos para serem preenchidos.
      setPersonalData({
        name: '',
        email: user?.email || '',
        phone: ''
      });
      // Garante que os dados de endereço estejam sempre vazios ao abrir o checkout
      setDeliveryData({ 
        cep: '', 
        street: '', 
        number: '', 
        complement: '', 
        neighborhood: '', 
        city: '', 
        state: '' 
      });
      setShippingCalculated(false);
    }
  }, [user, isOpen]);

  const { subtotal, discount, total } = calculateCartTotals(cartItems);

  const handlePersonalDataChange = (e: React.ChangeEvent<HTMLInputElement>) => setPersonalData({ ...personalData, [e.target.name]: e.target.value });
  const handleDeliveryDataChange = (e: React.ChangeEvent<HTMLInputElement>) => setDeliveryData({ ...deliveryData, [e.target.name]: e.target.value });

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    setDeliveryData({ ...deliveryData, cep });
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setDeliveryData(prev => ({ ...prev, street: data.logradouro || '', neighborhood: data.bairro || '', city: data.localidade || '', state: data.uf || '' }));
          setShippingCalculated(true);
        }
      } catch (error) { console.error('Erro ao buscar CEP:', error); }
    }
  };

  const formatCep = (value: string) => value.replace(/(\d{5})(\d{3})/, '$1-$2');

  const handleFinalizeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isMockUser) {
      setTimeout(() => {
        setIsLoading(false);
        onOrderSuccess();
      }, 1000);
      return;
    }

    const orderData = {
      user_id: user?.id,
      customer_name: personalData.name,
      customer_email: personalData.email,
      customer_phone: personalData.phone,
      delivery_address: deliveryData,
      items: cartItems.map(item => ({ 
        id: item.team.id, 
        name: item.team.name, 
        size: item.size, 
        quantity: item.quantity, 
        price: item.team.price * 0.30 // Salva o preço com desconto
      })),
      subtotal: subtotal,
      discount: discount,
      total_amount: total,
      status: 'pending_payment',
      payment_method: paymentMethod,
    };

    try {
      const { error } = await supabase.from('orders').insert([orderData]);
      if (error) throw error;
      onOrderSuccess();
    } catch (error: any) {
      alert(`Erro ao finalizar pedido: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-red-600 text-white sticky top-0 z-10">
          <div className="flex items-center gap-2"><CreditCard size={24} /><h3 className="text-xl font-bold">Checkout</h3></div>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X size={24} /></button>
        </div>

        <form onSubmit={handleFinalizeOrder} className="p-6 grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><User size={20} />Dados Pessoais</h4>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label><input type="text" name="name" value={personalData.name} onChange={handlePersonalDataChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label><input type="email" name="email" value={personalData.email} onChange={handlePersonalDataChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Telefone/WhatsApp</label><input type="tel" name="phone" value={personalData.phone} onChange={handlePersonalDataChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" /></div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><MapPin size={20} />Dados de Entrega</h4>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">CEP</label><input type="text" name="cep" value={formatCep(deliveryData.cep)} onChange={handleCepChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" maxLength={9} required /></div>
                {shippingCalculated && <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-green-700"><Truck size={20} /><div><p className="font-semibold text-green-600">Frete Grátis</p><p className="text-sm">Tempo estimado: 7 a 10 dias úteis</p></div></div>}
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Rua/Avenida</label><input type="text" name="street" value={deliveryData.street} onChange={handleDeliveryDataChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Número</label><input type="text" name="number" value={deliveryData.number} onChange={handleDeliveryDataChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label><input type="text" name="complement" value={deliveryData.complement} onChange={handleDeliveryDataChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" /></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label><input type="text" name="neighborhood" value={deliveryData.neighborhood} onChange={handleDeliveryDataChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label><input type="text" name="city" value={deliveryData.city} onChange={handleDeliveryDataChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Estado</label><input type="text" name="state" value={deliveryData.state} onChange={handleDeliveryDataChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" maxLength={2} required /></div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Resumo e Pagamento</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-4 sticky top-24">
              {cartItems.map((item) => {
                const discountedPrice = item.team.price * 0.30;
                return (
                  <div key={`${item.team.id}-${item.size}`} className="flex gap-3 pb-3 border-b border-gray-200 last:border-b-0">
                    <img src={item.team.image1} alt={item.team.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-800">{item.team.name}</h5>
                      <p className="text-sm text-gray-600">Tamanho: {item.size} | Qtd: {item.quantity}</p>
                      <p className="text-red-600 font-semibold">R$ {(discountedPrice * item.quantity).toFixed(2).replace('.', ',')}</p>
                    </div>
                  </div>
                );
              })}
              <div className="border-t border-gray-300 pt-4">
                <div className="space-y-2 mb-2">
                  <div className="flex justify-between"><span>Subtotal:</span><span>R$ {subtotal.toFixed(2).replace('.', ',')}</span></div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Desconto (Leve 3, Pague 2):</span>
                      <span>- R$ {discount.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <div className="flex justify-between"><span className="text-green-600 font-semibold">Frete:</span><span className="text-green-600 font-semibold">Grátis</span></div>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2 mt-2"><span>Total:</span><span className="text-red-600">R$ {total.toFixed(2).replace('.', ',')}</span></div>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-3">Forma de Pagamento</h5>
                <div className="space-y-2">
                  <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer ${paymentMethod === 'pix' ? 'border-red-600 bg-red-50' : 'border-gray-300'}`}><input type="radio" name="paymentMethod" value="pix" checked={paymentMethod === 'pix'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" /><QrCode className="mr-3" /><span>PIX</span></label>
                  <label className="flex items-center p-3 border-2 rounded-lg cursor-not-allowed bg-gray-100 text-gray-400"><input type="radio" name="paymentMethod" value="card" disabled className="hidden" /><CreditCard className="mr-3" /><span>Cartão de Crédito (Indisponível)</span></label>
                </div>
              </div>
              <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors mt-4 flex items-center justify-center" disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin" /> : 'Finalizar Pedido'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
