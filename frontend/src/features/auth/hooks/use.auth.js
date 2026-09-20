import { useContext } from 'react';
import { AuthContext } from '../auth.context';
import { register, login, logout } from '../services/auth.api';

export const useAuth = () => {
 const context = useContext(AuthContext);

 if (!context) {
   return {
     User: null,
     loading: false,
     handlelogin: async () => {},
     handlelogout: async () => {},
     handleregister: async () => {},
   };
 }

 const { User, Setuser, loading, Setloading } = context;

 const handlelogin = async ({ email, password }) => {
   Setloading(true);
   try {
     const data = await login({ email, password });
     Setuser(data.user);
   } catch (err) {
     console.log(err);
   } finally {
     Setloading(false);
   }
 };

 const handleregister = async ({ username, email, password }) => {
   Setloading(true);
   try {
     const data = await register({ username, email, password });
     Setuser(data.user);
   } catch (err) {
     console.log(err);
   } finally {
     Setloading(false);
   }
 };

 const handlelogout = async () => {
   Setloading(true);
   try {
     await logout();
     Setuser(null);
   } catch (err) {
     console.log(err);
   } finally {
     Setloading(false);
   }
 };

 return { User, loading, handlelogin, handlelogout, handleregister };
};
