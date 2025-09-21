import React from 'react';
import ReactECharts from 'echarts-for-react';
import { PieChart } from 'lucide-react';

interface OrderStatusData {
  value: number;
  name: string;
}

interface OrderStatusPieProps {
  data: OrderStatusData[];
}

const OrderStatusPie: React.FC<OrderStatusPieProps> = ({ data }) => {
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Status dos Pedidos',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data,
        color: ['#16a34a', '#2563eb', '#f97316', '#ef4444']
      }
    ]
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Status dos Pedidos</h3>
      {data.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-400">
          <PieChart size={40} className="mb-4" />
          <p>Nenhum pedido encontrado.</p>
          <p className="text-xs">O status dos seus pedidos aparecerá aqui.</p>
        </div>
      ) : (
        <ReactECharts option={option} style={{ height: '300px' }} />
      )}
    </div>
  );
};

export default OrderStatusPie;
