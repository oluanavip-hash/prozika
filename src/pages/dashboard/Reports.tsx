import React from 'react';
import { Calendar, DollarSign, ShoppingCart, Users, TrendingUp, Package } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import SalesChart from '../../components/dashboard/SalesChart';
import OrderStatusPie from '../../components/dashboard/OrderStatusPie';

const salesData = {
  labels: Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d.toLocaleString('default', { month: 'short' });
  }).reverse(),
  data: [0, 0, 0, 0, 0, 0]
};

const orderStatusData: any[] = [];

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Relatórios</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50">
          <Calendar size={16} />
          <span>Últimos 30 dias</span>
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Faturamento Total"
          value="R$ 0,00"
          change="vs mês passado"
          icon={<DollarSign size={20} />}
        />
        <StatCard
          title="Lucro"
          value="R$ 0,00"
          change="vs mês passado"
          icon={<TrendingUp size={20} />}
        />
        <StatCard
          title="Pedidos"
          value="0"
          change="vs mês passado"
          icon={<ShoppingCart size={20} />}
        />
        <StatCard
          title="Ticket Médio"
          value="R$ 0,00"
          change="vs mês passado"
          icon={<Users size={20} />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesChart labels={salesData.labels} data={salesData.data} />
        </div>
        <div className="lg:col-span-1">
          <OrderStatusPie data={orderStatusData} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Produtos Mais Vendidos</h3>
        <div className="text-center py-12">
            <Package size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">Nenhum produto vendido ainda.</p>
            <p className="text-sm text-gray-400 mt-1">Os produtos mais vendidos aparecerão aqui.</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
