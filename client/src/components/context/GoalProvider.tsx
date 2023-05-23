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
  const goalManager = useLocalStorage('goal', '');
  const activityManager = useLocalStorage('activity', '');
  return (
    <GoalContext.Provider value={{ activity: goalManager, usage: activityManager }}>
      {children}
    </GoalContext.Provider>
  );
};
