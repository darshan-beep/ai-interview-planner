const { PDFParse } = require('pdf-parse')   

 const{ generateInterviewReport,generatepdf} = require('../services/ai.services')
 const interviewreportmodel = require ('../models/interviewreport.model')
async function generateinterviewreportcontroller(req,res){
    const parser = new PDFParse({ data: req.file.buffer })
     const resumedata = await parser.getText()
    const resumecontent = resumedata.text
   
    const {selfdescription,jobdescription} = req.body;
    const interviewreportbyai = await generateInterviewReport({
        resume:resumecontent,
        selfdescription,
        jobdescription
    })
    const interviewreport = await interviewreportmodel.create({
        user:req.user.id,
         resume:resumecontent,
        selfdescription,
        jobdescription,
        ...interviewreportbyai 
    })
    res.status(201).json({
        message:'interview report generated',
        interviewreport
    })

}
async function getinterviewreportByIdcontroller(req,res){
    const {interviewId} = req.params;
    const interviewreport = await interviewreportmodel.findOne({
        _id:interviewId,
        user:req.user.id
    })
    if(!interviewreport){
        return res.status(404).json({
            message:'interview report not found'
        })
    }
    res.status(200).json({
        message:'interview report found',
        interviewreport
    })
}
async function getAllinterviewreportscontroller(req,res){
    const interviewreports = await interviewreportmodel.find({user:req.user.id}).sort({createdAt:-1}).select('-resume -selfdescription -jobdescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan')

    res.status(200).json({
        message:'interview reports found',
        interviewreports
    })
}
async function generatepdfcontroller(req,res){
    const{interviewId} =req.params
    const interviewreport = await interviewreportmodel.findById(interviewId)
    if(!interviewreport){
      return res.status(404).json ({
        message:"report not found"
       })
    }
    const {resume,selfDescription,jobDescription}=interviewreport
    const pdfBuffer = await generatepdf({
        resume,selfDescription,jobDescription
    })
    res.set({
        "Content-Type":'application/pdf',
        "Content-Disposition": `attachment;filename=resume_${interviewId}.pdf`
    })
    res.send(pdfBuffer)
}

module.exports={generateinterviewreportcontroller,getinterviewreportByIdcontroller,getAllinterviewreportscontroller,generatepdfcontroller}