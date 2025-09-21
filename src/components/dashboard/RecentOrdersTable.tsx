import React from 'react';
import { Package, Send } from 'lucide-react';
import DropdownMenu from './DropdownMenu';

interface Order {
  id: string;
  customer: string;
  date: string;
  total: string;
  status: 'Entregue' | 'Enviado' | 'Pendente' | 'Reembolsado';
}

interface RecentOrdersTableProps {
  orders: Order[];
}

const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ orders }) => {
  const getStatusChip = (status: string) => {
    switch (status) {
      case 'Entregue': return 'bg-green-100 text-green-800';
      case 'Enviado': return 'bg-blue-100 text-blue-800';
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      case 'Reembolsado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Pedidos Recentes</h3>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Nenhum pedido recente para exibir.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Pedido</th>
                <th scope="col" className="px-6 py-3">Cliente</th>
                <th scope="col" className="px-6 py-3">Data</th>
                <th scope="col" className="px-6 py-3">Total</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="bg-white border-b">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">#{order.id}</th>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">{order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusChip(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <DropdownMenu>
                      <button className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Send size={14} />
                        Enviar Pedido
                      </button>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentOrdersTable;
