import { useEffect } from 'react';
import { BASE_URL, USERINFO_URL } from './constants';

const useCheckAuth = () => {
  useEffect(() => {
    const checkCallback = async () => {
      try {
        // Fetch user info
        const userInfoResponse = await fetch(`${BASE_URL}${USERINFO_URL}`, {
          credentials: 'include',
        });
        if (userInfoResponse.ok) {
          console.log('User info:', await userInfoResponse.json());
        } else {
          console.log('not authenticated', userInfoResponse);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    checkCallback();
  }, []);
};

export default useCheckAuth;
