import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ApplyJob from './pages/ApplyJob';
import Applications from './pages/Applications';
import RecruiterLogin from './components/RecruiterLogin';
import { AppContext } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import AddJob from './pages/AddJob';
import ViewApplications from './pages/ViewApplications';
import ManageJobs from './pages/ManageJobs';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Ensure toast styles are included
import 'quill/dist/quill.snow.css'; // ✅ Moved to top where imports belong

const App = () => {
  const { showRecruiterLogin, companyToken } = useContext(AppContext);

  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/applications" element={<Applications />} />

        <Route path="/dashboard" element={<Dashboard />}>
          {companyToken && (
            <>
              <Route path="add-job" element={<AddJob />} />
              <Route path="manage-jobs" element={<ManageJobs />} />
              <Route path="view-applications" element={<ViewApplications />} />
            </>
          )}
        </Route>
      </Routes>
    </div>
  );
};

export default App;

