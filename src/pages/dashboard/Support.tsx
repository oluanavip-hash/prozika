import React from 'react';
import { LifeBuoy } from 'lucide-react';

const Support: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
      <LifeBuoy size={64} className="mb-4 text-gray-300" />
      <h1 className="text-2xl font-bold text-gray-700">Suporte</h1>
      <p className="mt-2">Esta página está em desenvolvimento.</p>
    </div>
  );
};

export default Support;
