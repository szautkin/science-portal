import { useContext } from 'react';
import { DataContext } from './dataContext';

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within an DataProvider');
  }
  return context;
};
