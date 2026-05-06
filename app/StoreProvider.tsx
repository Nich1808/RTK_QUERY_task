'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/lip/store';

type StoreProviderProps = {
  children: React.ReactNode;
};

const StoreProvider = ({ children }: StoreProviderProps) => {
  const store = useRef<AppStore | null>(null);

  if (store.current === null) {
    store.current = makeStore();
  }

  return (
    <Provider store={store.current}>
      {children}
    </Provider>
  );
};

export default StoreProvider;