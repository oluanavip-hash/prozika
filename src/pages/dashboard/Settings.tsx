import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
      <SettingsIcon size={64} className="mb-4 text-gray-300" />
      <h1 className="text-2xl font-bold text-gray-700">Configurações</h1>
      <p className="mt-2">Esta página está em desenvolvimento.</p>
    </div>
  );
};

export default Settings;
