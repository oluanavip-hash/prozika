import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSignUp = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("Por favor, preencha nome, e-mail e senha.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signUp(formData.email, formData.password, formData.name, formData.phone);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro no cadastro.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!formData.email || !formData.password) {
      setError("Por favor, preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signIn(formData.email, formData.password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'E-mail ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      handleSignIn();
    } else {
      handleSignUp();
    }
  };

  const resetState = () => {
    setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    setError(null);
    setLoading(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetState();
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <img src="https://i.ibb.co/NnpRnXHn/1000022407-removebg-preview.png" alt="Malha Pro" className="h-12 w-auto mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-red-600">Malha Pro</h2>
              <p className="text-sm text-gray-600">O melhor fornecedor de malha tailandesa do Brasil</p>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800">{isLogin ? 'Fazer Login' : 'Criar Conta'}</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" name="name" placeholder="Nome completo" value={formData.name} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
          </div>

          {!isLogin && (
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input type="tel" name="phone" placeholder="Telefone/WhatsApp" value={formData.phone} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
            </div>
          )}
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="password" name="password" placeholder="Senha" value={formData.password} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
          </div>

          {!isLogin && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input type="password" name="confirmPassword" placeholder="Confirmar senha" value={formData.confirmPassword} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
            </div>
          )}
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:bg-red-400">
            {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Entrar' : 'Criar Conta')}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button onClick={toggleMode} className="text-red-600 hover:text-red-700 font-medium">
            {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
