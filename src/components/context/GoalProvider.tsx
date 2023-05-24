import React, { createContext, PropsWithChildren, useContext } from 'react';
import { useLocalStorage } from 'react-use';

<<<<<<< HEAD
type GoalContextType = ReturnType<typeof useLocalStorage<string>>;
const GoalContext = createContext<GoalContextType | null>(null);

const useGoalContext = (): GoalContextType =>
  useContext(GoalContext) as GoalContextType;

export const GoalProvider = ({ children }: PropsWithChildren) => {
  const goal = useLocalStorage('goal', '');
  return <GoalContext.Provider value={goal}>{children}</GoalContext.Provider>;
=======
type GoalContextType = {
  activity: ReturnType<typeof useLocalStorage<string>>;
  usage: ReturnType<typeof useLocalStorage<string>>;
};
const GoalContext = createContext<GoalContextType | null>(null);

export const useGoalContext = (): GoalContextType =>
  useContext(GoalContext) as GoalContextType;

export const GoalProvider = ({ children }: PropsWithChildren) => {
  const goalManager = useLocalStorage('goal', '0');
  const activityManager = useLocalStorage('activity', '0');
  return (
    <GoalContext.Provider value={{ activity: goalManager, usage: activityManager }}>
      {children}
    </GoalContext.Provider>
  );
>>>>>>> main
};
