'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  worldIdHash: string;
  createdAt: string;
}

interface Profile {
  id: string;
  userId: string;
  type: 'PROVIDER' | 'CLIENT';
  username: string;
  avatarEmoji: string;
  bio: string;
  reputationScore: number;
  totalReviews: number;
  badges: Array<{
    kind: string;
    title: string;
    iconUrl: string;
  }>;
}

interface UserContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  setProfile: (profile: Profile) => void;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfileState] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('xambatlan_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setProfileState(null);
    localStorage.removeItem('xambatlan_user');
    localStorage.removeItem('xambatlan_profile');
  };

  const setProfile = (profile: Profile) => {
    setProfileState(profile);
    localStorage.setItem('xambatlan_profile', JSON.stringify(profile));
  };

  const refreshProfile = async () => {
    if (!isAuthenticated) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/profiles/me`);

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setProfile(result.data);
        }
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  useEffect(() => {
    // Load saved user data
    const savedUser = localStorage.getItem('xambatlan_user');
    const savedProfile = localStorage.getItem('xambatlan_profile');

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('xambatlan_user');
      }
    }

    if (savedProfile) {
      try {
        setProfileState(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Failed to parse saved profile:', error);
        localStorage.removeItem('xambatlan_profile');
      }
    }

    setIsLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{
      user,
      profile,
      isAuthenticated,
      isLoading,
      login,
      logout,
      setProfile,
      refreshProfile,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}