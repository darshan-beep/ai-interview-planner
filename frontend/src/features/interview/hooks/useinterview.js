import{getinterviewreportById,generateinterviewreports,getAllinterviewreports,generatepdf}from"../services/interview.api"
import{useContext,useEffect}from"react"
import{InterviewContext}from"../interview.context"
import { useParams } from "react-router"
export const useinterview =()=>{
    const context = useContext(InterviewContext)
    const {interviewId} = useParams()
    if(!context){
        throw new Error("useinterview must be used within an InterviewProvider")
    }
    const {loading,setloading,report,setreport,reports,setreports} = context;
    const generatereport = async({resumefile,selfdescription,jobdescription})=>{
        
        setloading(true)
        let response = (null)
        try{
             response = await generateinterviewreports({resumefile,selfdescription,jobdescription})
            setreport(response.interviewreport)
        }
        catch(error){
            console.error("Error generating interview report:", error)
        }
        finally{
            setloading(false)
        }
        return response?.interviewreport ??null;
    }
    const getreportbyid = async(interviewId)=>{
        setloading(true)
        let response = (null)
        try{
            const response = await getinterviewreportById(interviewId)
            setreport(response.interviewreport)
        }catch(error){
            console.error("Error fetching interview report by ID:", error)
        }
        finally{
            setloading(false)
        }
        return response?.interviewreport ??null;


   }
   const getallreports = async()=>{
    setloading(true)
    let response =(null)
    try{
        const response = await getAllinterviewreports()
        setreports(response.interviewreports)
    }catch(error){
        console.error("Error fetching all interview reports:", error)
    }
    finally{
        setloading(false)
    }
    return response?.interviewreports ??null;
}
const getPdf = async (interviewId) => {
  setloading(true);
  let response = null;
  try {
    response = await generatepdf( interviewId );
    const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `resume_${interviewId}.pdf`);
    document.body.appendChild(link);
    link.click();

    // cleanup — without these, links pile up in the DOM and object URLs leak memory
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.log(error);
  } finally {
    setloading(false);
  }
};
useEffect(()=>{
    if(interviewId){
        getreportbyid(interviewId)
    }else{
        getallreports()
    }

},[interviewId])
return{
    loading,
    report,
    reports,
    generatereport,
    getreportbyid,
    getallreports,getPdf
}
}