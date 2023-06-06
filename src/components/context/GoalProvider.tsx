import React, { createContext, PropsWithChildren, useContext } from 'react';
import { useLocalStorage } from 'react-use';

type GoalContextType = {
  activity: ReturnType<typeof useLocalStorage<string>>;
  usage: ReturnType<typeof useLocalStorage<string>>;
};
const GoalContext = createContext<GoalContextType | null>(null);

export const useGoalContext = (): GoalContextType =>
  useContext(GoalContext) as GoalContextType;

export const GoalProvider = ({ children }: PropsWithChildren) => {
  const usageManager = useLocalStorage('usage', '3');
  const activityManager = useLocalStorage('activity', '50');
  return (
    <GoalContext.Provider value={{ activity: activityManager, usage: usageManager }}>
      {children}
    </GoalContext.Provider>
  );
};
