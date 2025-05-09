import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../auth/services/supabase.service';

const funcName = 'extract-life-goals';

const cmd = async (msg: string) => {
  const { data, error } = await supabase.functions.invoke<{ career: string[] }>(
    funcName,
    {
      body: {
        msg,
      },
    },
  );

  if (error) throw error;

  return data;
};

export const useLifeGoalsExtractor = (msg: string) => {
  return useQuery({
    queryKey: ['lifeGoals', msg],
    queryFn: () => cmd(msg),
    enabled: !!msg,
  });
};
