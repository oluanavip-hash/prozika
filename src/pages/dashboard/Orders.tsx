import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, MoreHorizontal, Calendar, ShoppingCart } from 'lucide-react';

type OrderStatus = 'Pendente' | 'Enviado' | 'Entregue' | 'Cancelado';

interface Order {
  id: string;
  customerName: string;
  customerAvatar: string;
  date: Date;
  status: OrderStatus;
  total: number;
}

const mockOrders: Order[] = []; // Dados zerados

const statusFilters: ('Todos' | OrderStatus)[] = ['Todos', 'Pendente', 'Enviado', 'Entregue', 'Cancelado'];

const getStatusChip = (status: OrderStatus) => {
    switch (status) {
      case 'Entregue': return 'bg-green-100 text-green-800';
      case 'Enviado': return 'bg-blue-100 text-blue-800';
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
};

const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'Todos' | OrderStatus>('Todos');

  const filteredOrders = useMemo(() => {
    return mockOrders.filter(order => {
      const matchesFilter = activeFilter === 'Todos' || order.status === activeFilter;
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [searchTerm, activeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Pedidos</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            to="/"
            className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors whitespace-nowrap"
          >
            <PlusCircle size={18} />
            <span className="hidden sm:inline">Adicionar Pedido</span>
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex border-b border-gray-200 w-full md:w-auto">
                {statusFilters.map(filter => (
                    <button 
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-3 py-2 text-sm font-medium whitespace-nowrap ${activeFilter === filter ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {filter}
                    </button>
                ))}
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por ID ou cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                </div>
                 <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                    <Calendar size={18} />
                </button>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="p-4"><input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500"/></th>
                <th scope="col" className="px-6 py-3">Pedido</th>
                <th scope="col" className="px-6 py-3">Cliente</th>
                <th scope="col" className="px-6 py-3">Data</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Total</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <ShoppingCart size={40} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">Nenhum pedido encontrado.</p>
                    <p className="text-sm text-gray-400 mt-1">Os novos pedidos aparecerão aqui.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="p-4"><input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500"/></td>
                    <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img className="w-8 h-8 rounded-full" src={order.customerAvatar} alt={order.customerName} />
                        <span>{order.customerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{order.date.toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusChip(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">R$ {order.total.toFixed(2).replace('.', ',')}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 rounded-full hover:bg-gray-200"><MoreHorizontal size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
