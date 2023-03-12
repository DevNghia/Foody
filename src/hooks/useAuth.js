import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkLogged } from '../components/Login/loginSlice';
import { auth } from '../firebase/config';

const useAuth = () => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const currentUserAuth = auth.currentUser;
  const [currentUser, setCurrentUser] = useState(null);

  const { isLogged } = useSelector((state) => state.login);

  useEffect(() => {
    const unsubscribed = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      }
      if (user && !isLogged) {
        dispatch(checkLogged(true));
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    });

    return unsubscribed;
  }, [dispatch, isLogged]);

  return { isLoading, currentUserAuth, currentUser };
};

export default useAuth;
