import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogged } from '../admin_components/Login/loginSlice';

const useAuthAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({});

  const { isLogged } = useSelector((state) => state.adminLogin);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email === 'foodapp.admin.tt@admin.com') {
        // setCurrentUser(user);
        setCurrentUser(auth.currentUser);
      }
      if (user?.email === 'foodapp.admin.tt@admin.com' && !isLogged) {
        dispatch(setLogged(true));
        setLoading(false);
        return;
      } else if (!user) {
        navigate('/app/admin/login');
        setCurrentUser({});
        setLoading(false);
        return;
      } else if (user?.email !== 'foodapp.admin.tt@admin.com') {
        navigate('/error');
        setCurrentUser({});
        setLoading(false);
        return;
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [isLogged, dispatch, navigate]);

  return { loading, currentUser };
};

export default useAuthAdmin;
