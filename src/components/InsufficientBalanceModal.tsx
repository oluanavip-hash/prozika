import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Wallet, AlertTriangle } from 'lucide-react';

interface InsufficientBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InsufficientBalanceModal: React.FC<InsufficientBalanceModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleRecharge = () => {
    onClose();
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
          <AlertTriangle className="h-8 w-8 text-yellow-500" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2">Saldo Insuficiente</h3>
        <p className="text-gray-600 mb-6">
          Para comprar estoque para sua loja, você precisa ter saldo na plataforma. Por favor, recarregue sua conta para continuar.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleRecharge}
            className="flex-1 py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <Wallet size={18} />
            Recarregar Agora
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsufficientBalanceModal;
