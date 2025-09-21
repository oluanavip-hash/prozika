import React, { createContext, useState, useContext, useEffect } from 'react';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { Profile, AuthContextType, User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('malhapro_user');
      const storedProfile = localStorage.getItem('malhapro_profile');

      if (storedUser && storedProfile) {
        setUser(JSON.parse(storedUser));
        setProfile(JSON.parse(storedProfile));
      }
    } catch (error) {
      console.error("Falha ao carregar dados de autenticação:", error);
      localStorage.removeItem('malhapro_user');
      localStorage.removeItem('malhapro_profile');
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 4000));

    if (!email || !password) {
      setLoading(false);
      throw new Error("Por favor, preencha e-mail e senha.");
    }
    
    const mockUser: User = {
      id: faker.string.uuid(),
      app_metadata: {},
      user_metadata: { full_name: faker.person.fullName() },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };
    const mockProfile: Profile = {
      id: mockUser.id,
      full_name: mockUser.user_metadata.full_name,
      phone: faker.phone.number(),
      balance: 0,
    };

    setUser(mockUser);
    setProfile(mockProfile);
    localStorage.setItem('malhapro_user', JSON.stringify(mockUser));
    localStorage.setItem('malhapro_profile', JSON.stringify(mockProfile));
    setLoading(false);
  };

  const signUp = async (email: string, password: string, name: string, phone: string) => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 4000));

    if (!email || !password || !name) {
      setLoading(false);
      throw new Error("Por favor, preencha nome, e-mail e senha.");
    }

    const mockUser: User = {
      id: faker.string.uuid(),
      app_metadata: {},
      user_metadata: { full_name: name },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };
    const mockProfile: Profile = {
      id: mockUser.id,
      full_name: name,
      phone: phone || faker.phone.number(),
      balance: 0,
    };

    setUser(mockUser);
    setProfile(mockProfile);
    localStorage.setItem('malhapro_user', JSON.stringify(mockUser));
    localStorage.setItem('malhapro_profile', JSON.stringify(mockProfile));
    setLoading(false);
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('malhapro_user');
    localStorage.removeItem('malhapro_profile');
  };

  const value: AuthContextType = {
    session: null,
    user,
    profile,
    loading,
    isMockUser: !!user,
    signOut,
    signIn,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
