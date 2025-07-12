import { SelectAuth } from '../store/slices/authSlice';
import { SelectRace } from '../store/slices/raceSlice';
import { useAppSelector } from '../store/hooks';


const useRace = () => {
  const { user, isAuthenticated } = useAppSelector(SelectAuth);
  const { selectedRace, loading, error } = useAppSelector(SelectRace);

  const isSignedUsersRace: boolean = (isAuthenticated && selectedRace)
    ? selectedRace.user.id === user?.id // if isAuthenticated => user is not null
    : false;

  return {
    selectedRace,
    loading,
    error,
    isSignedUsersRace,
  };
};

export default useRace;
