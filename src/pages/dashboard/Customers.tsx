import React, { useState, useMemo } from 'react';
import { Search, PlusCircle, MoreHorizontal, Users } from 'lucide-react';
import { Customer } from '../../types';
import AddCustomerModal from '../../components/dashboard/AddCustomerModal';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, customers]);

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers(prev => [newCustomer, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <>
      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCustomer={handleAddCustomer}
      />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors whitespace-nowrap"
            >
              <PlusCircle size={18} />
              <span className="hidden sm:inline">Adicionar Cliente</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Cliente</th>
                  <th scope="col" className="px-6 py-3">Telefone</th>
                  <th scope="col" className="px-6 py-3 text-center">Pedidos</th>
                  <th scope="col" className="px-6 py-3">Total Gasto</th>
                  <th scope="col" className="px-6 py-3"><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <Users size={40} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 font-medium">Nenhum cliente encontrado.</p>
                      <p className="text-sm text-gray-400 mt-1">Adicione um novo cliente para começar.</p>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img className="w-10 h-10 rounded-full object-cover" src={customer.avatar} alt={customer.name} />
                          <div>
                            <div className="font-semibold text-gray-900">{customer.name}</div>
                            <div className="text-gray-500">{customer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{customer.phone}</td>
                      <td className="px-6 py-4 text-center">{customer.orders}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">R$ {customer.totalSpent.toFixed(2).replace('.', ',')}</td>
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
    </>
  );
};

export default Customers;
