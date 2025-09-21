import React, { useState } from 'react';
import { X, User, Mail, Phone, Loader2 } from 'lucide-react';
import { Customer } from '../../types';
import { faker } from '@faker-js/faker/locale/pt_BR';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomer: (customer: Customer) => void;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose, onAddCustomer }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError("Nome e e-mail são obrigatórios.");
      return;
    }

    setLoading(true);
    const newCustomer: Customer = {
      id: faker.string.uuid(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      avatar: faker.image.avatar(),
      orders: 0,
      totalSpent: 0,
    };

    // Simular uma chamada de API
    setTimeout(() => {
      onAddCustomer(newCustomer);
      setLoading(false);
      handleClose();
    }, 1000);
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', phone: '' });
    setError(null);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Adicionar Novo Cliente</h3>
          <p className="text-sm text-gray-500">Preencha os dados para cadastrar um cliente.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" name="name" placeholder="Nome completo" value={formData.name} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
          </div>
          
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="tel" name="phone" placeholder="Telefone/WhatsApp" value={formData.phone} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:bg-red-400">
            {loading ? <Loader2 className="animate-spin" /> : 'Adicionar Cliente'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;
