import React, { createContext, PropsWithChildren, useContext } from 'react';
import { useLocalStorage } from 'react-use';

type GoalContextType = ReturnType<typeof useLocalStorage<string>>;
const GoalContext = createContext<GoalContextType | null>(null);

const useGoalContext = (): GoalContextType =>
  useContext(GoalContext) as GoalContextType;

export const GoalProvider = ({ children }: PropsWithChildren) => {
  const goal = useLocalStorage('goal', '');
  return <GoalContext.Provider value={goal}>{children}</GoalContext.Provider>;
};
