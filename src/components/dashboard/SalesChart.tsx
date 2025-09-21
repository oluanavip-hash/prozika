import React from 'react';
import ReactECharts from 'echarts-for-react';
import { BarChart2 } from 'lucide-react';

interface SalesChartProps {
  data: number[];
  labels: string[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data, labels }) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: labels,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          formatter: 'R$ {value}'
        }
      }
    ],
    series: [
      {
        name: 'Faturamento',
        type: 'bar',
        barWidth: '60%',
        data: data,
        itemStyle: {
          color: '#dc2626'
        }
      }
    ]
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Vendas nos Últimos 6 Meses</h3>
      {data.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-400">
          <BarChart2 size={40} className="mb-4" />
          <p>Nenhum dado de vendas ainda.</p>
          <p className="text-xs">O gráfico aparecerá quando você fizer sua primeira venda.</p>
        </div>
      ) : (
        <ReactECharts option={option} style={{ height: '300px' }} />
      )}
    </div>
  );
};

export default SalesChart;
