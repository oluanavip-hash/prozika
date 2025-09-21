import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Order } from '../types';
import { Loader2, Package, Calendar, Hash, DollarSign } from 'lucide-react';

const MyOrders: React.FC = () => {
  const { user, isMockUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || isMockUser) {
        setLoading(false);
        setOrders([]);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user, isMockUser]);

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending_payment':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">Aguardando Pagamento</span>;
      case 'paid':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">Pago</span>;
      case 'shipped':
        return <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">Enviado</span>;
      case 'delivered':
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">Entregue</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Meus Pedidos</h1>
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-red-600" size={48} />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-100 rounded-lg">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">Você ainda não fez nenhum pedido.</p>
          <p className="text-gray-500 mt-2">Que tal encontrar a camisa do seu time?</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Hash size={16} />
                  <div>
                    <p className="font-semibold">PEDIDO</p>
                    <p className="text-gray-800">#{order.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  <div>
                    <p className="font-semibold">DATA</p>
                    <p className="text-gray-800">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign size={16} />
                  <div>
                    <p className="font-semibold">TOTAL</p>
                    <p className="text-gray-800 font-bold">R$ {order.total_amount.toFixed(2).replace('.', ',')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Package size={16} />
                  <div>
                    <p className="font-semibold">STATUS</p>
                    {getStatusChip(order.status)}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-3">Itens do pedido:</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-gray-500">Tamanho: {item.size} | Qtd: {item.quantity}</p>
                      </div>
                      <p className="text-gray-700">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
