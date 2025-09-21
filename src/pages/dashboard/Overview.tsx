import React from 'react';
import StatCard from '../../components/dashboard/StatCard';
import SalesChart from '../../components/dashboard/SalesChart';
import OrderStatusPie from '../../components/dashboard/OrderStatusPie';
import RecentOrdersTable from '../../components/dashboard/RecentOrdersTable';
import { useAuth } from '../../contexts/AuthContext';
import { DollarSign, ShoppingCart, Users, TrendingUp, PlusCircle, Wallet } from 'lucide-react';

const DashboardOverview: React.FC = () => {
  const { profile } = useAuth();

  // Dados zerados para novo usuário
  const emptySalesData = {
    labels: Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return d.toLocaleString('default', { month: 'short' });
    }).reverse(),
    data: [0, 0, 0, 0, 0, 0]
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Saldo da Plataforma"
          value={`R$ ${profile?.balance.toFixed(2).replace('.', ',')}`}
          icon={<Wallet size={20} />}
          action={
            <button className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-semibold">
              <PlusCircle size={14} />
              Recarregar
            </button>
          }
        />
        <StatCard
          title="Saldo de Venda"
          value="R$ 0,00"
          icon={<DollarSign size={20} />}
          action={
             <span className="text-xs text-gray-400">Lucro a receber</span>
          }
        />
        <StatCard
          title="Vendas (Mês)"
          value="0"
          icon={<ShoppingCart size={20} />}
        />
        <StatCard
          title="Novos Clientes (Mês)"
          value="0"
          icon={<Users size={20} />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SalesChart labels={emptySalesData.labels} data={emptySalesData.data} />
        </div>
        <div className="lg:col-span-2">
          <OrderStatusPie data={[]} />
        </div>
      </div>

      <div>
        <RecentOrdersTable orders={[]} />
      </div>
    </div>
  );
};

export default DashboardOverview;
