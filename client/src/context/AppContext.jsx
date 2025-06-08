import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { user } = useUser();
  const { getToken } = useAuth();

  const [searchFilter, setSearchFilter] = useState({ title: '', location: '' });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplications] = useState([]);

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const { data } = await axios.get(`${backendUrl}/api/jobs`);
      if (data.success) {
        setJobs(data.jobs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoadingJobs(false);
    }
  };

  // Fetch company data
  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/company`, {
        headers: {
          Authorization: `Bearer ${companyToken}`
        }
      });
      if (data.success) {
        setCompanyData(data.company);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const { data } = await axios.get(`${backendUrl}/api/users/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Function to fetch user Applied aplications

  const fetchUserApplications = async()=>{
    try {
      const token = await getToken()
      const {data} = await axios.get(backendUrl+'/api/users/applications',
        {headers:{Authorization:`Bearer ${token}`}}
      )

      if (data.success) {
        setUserApplications(data.applications)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Initial effect to fetch jobs and restore token
  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      if (isMounted) {
        await fetchJobs();
        const storedCompanyToken = localStorage.getItem('companyToken');
        if (storedCompanyToken) {
          setCompanyToken(storedCompanyToken);
        }
      }
    };

    initialize();

    return () => { isMounted = false; };
  }, []);

  // Watch for changes in companyToken
  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]);

  // Watch for Clerk user
  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserApplications();
    }
  }, [user]);

  const value = {
    setSearchFilter, searchFilter,
    isSearched, setIsSearched,
    jobs, setJobs, loadingJobs,
    showRecruiterLogin, setShowRecruiterLogin,
    companyToken, setCompanyToken,
    companyData, setCompanyData,
    backendUrl,
    userData, setUserData,
    userApplications, setUserApplications,
    fetchUserData,
    fetchUserApplications,
    
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
