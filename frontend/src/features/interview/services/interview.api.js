import axios from"axios";
const api=axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true,
})
 export const generateinterviewreports = async({resumefile,selfdescription,jobdescription})=>{
  const formData = new FormData();
  if (resumefile) {
  formData.append('resume', resumefile);
}
  formData.append('selfdescription', selfdescription);
  formData.append('jobdescription', jobdescription);
const response = await api.post('/api/interview',formData,);
  return response.data;
}
export const getinterviewreportById = async(interviewId)=>{
  const response = await api.get(`/api/interview/report/${interviewId}`);
  return response.data;
}
export const getAllinterviewreports = async()=>{
    const response = await api.get('/api/interview');
    return response.data;
}
export const generatepdf =async(interviewId)=>{
    const response = await api.post(`/api/interview/resume/pdf/${interviewId}`,null,{
        responseType:"blob"
    })
    return response.data
}