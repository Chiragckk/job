import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import Loading from '../components/Loading'
import { assets } from '../assets/assets'
import Navbar from '../components/Navbar'
import kconvert from 'k-convert'
import moment from 'moment'
import JobCard from '../components/JobCard'
import Footer from '../components/Footer'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

const ApplyJob = () => {
  const { id } = useParams()
  const {getToken} = useAuth()
  const [JobData, setJobData] = useState(null)
  const [isAlreadyApplied , setIsAlreadyApplied] = useState(false)
  const { jobs,backendUrl,userData,userApplications ,fetchUserApplications} = useContext(AppContext)

  const fetchJob = async()=>{
   try {
     const {data} =await axios.get(backendUrl+`/api/jobs/${id}`)

    if(data.success){
      setJobData(data.job)
    }else {
      toast.error(data.message)
    }
   } catch (error) {
    toast.error(error.message)
   }
  }

  const applyHandler = async()=>{
    try {
      if (!userData) {
        return toast.error('Login to apply for jobs')
      }
      if (!userData.resume) {
        return toast.error('Upload resume to apply ')
      }

      const token  = await getToken()

      const {data} = await axios.post(backendUrl+'/api/users/apply',
        {jobId:JobData._id},
        {headers:{Authorization:`Bearer ${token}`}}
      )

      if (data.success) {
        toast.success(data.message)
        fetchUserApplications()
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const checkAlreadyApplied=()=>{
    const hasApplied = userApplications.some(item =>item.jobId._id===JobData)

    setIsAlreadyApplied(hasApplied)
  }

  useEffect(() => {
    fetchJob()

  }, [id])

  useEffect(()=>{
    if (userApplications.length > 0 && JobData) {
      checkAlreadyApplied()
    }
  },[JobData,userApplications,id])

  return JobData ? (
    <>
      <Navbar />
      <div className='min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto'>
        <div className='bg-white text-black rounded-lg w-full'>
          <div className='flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl'>
            <div className='flex flex-col md:flex-row items-center'>
              <img
                className='h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border-gray-200'
                src={JobData.companyId?.image || assets.company_icon}
                alt=""
              />
              <div className='text-center md:text-left text-neutral-700'>
                <h1 className='text-2xl sm:text-4xl font-medium'>{JobData.title}</h1>
                <div className='flex flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2'>
                  <span className='flex items-center gap-1'>
                    <img src={assets.suitcase_icon} alt="" />
                    {JobData.companyId.name}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.location_icon} alt="" />
                    {JobData.location}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.person_icon} alt="" />
                    {JobData.level}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.money_icon} alt="" />
                    CTC: {kconvert.convertTo(JobData.salary)}
                  </span>
                </div>
              </div>
            </div>
            <div className='flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center'>
              <button onClick={applyHandler} className='bg-blue-600 p-2.5 px-10 text-white rounded'>{isAlreadyApplied?'Already Applied':'Apply Now'}</button>
              <p className='mt-1 text-gray-600'>Posted {moment(JobData.date).fromNow()}</p>
            </div>
          </div>

          <div className='flex flex-col lg:flex-row justify-between items-start'>
            <div className='w-full lg:w-2/3'>
              <h2 className='font-black text-2xl mb-4'>Job Description</h2>
              <div className='text-gray-700' dangerouslySetInnerHTML={{ __html: JobData.description }}></div>
              <button  onClick={applyHandler} className='bg-blue-600 p-2.5 px-10 text-white rounded mt-10'>{isAlreadyApplied?'Already Applied':'Apply Now'}</button>
            </div>

            <div className='w-full lg:w-1/3 pl-0 lg:pl-8 mt-8 lg:mt-0'>
              <h2 className='font-semibold text-lg mb-4'>More Jobs from {JobData.companyId.name}</h2>
              <div className='grid gap-4'>
                {jobs
                  .filter(job => job._id !== JobData._id && job.companyId._id === JobData.companyId._id)
                    .filter(job=>{
                      //set of applide job id
                      const appliedJobsIds = new Set(userApplications.map(app => app.jobId && app.jobId._id))
                      //return true if the user is not applied for this job
                      return !appliedJobsIds.has(job._id)
                    })
                  
                  .slice(0, 4)
                  .map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  )
}

export default ApplyJob
