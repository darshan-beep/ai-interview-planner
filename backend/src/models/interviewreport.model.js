const mongoose = require("mongoose")
const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true, 'technical question is required']
    },
    intention:{
        type:String,
        required:[true,'intention of question is required']
    },
    answer:{
        type:String,
        required:[true,'answer is required']
    }

},{
    _id:false
})
const behavioralQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true, 'technical question is required']
    },
    intention:{
        type:String,
        required:[true,'intention of question is required']
    },
    answer:{
        type:String,
        required:[true,'answer is required']
    }
},{
    _id:false
}) 
const skillGapSchema = new mongoose.Schema({
    skill:{
        type:String,
        required:[true,'skill is required']
        
    },
    severity:{
            type:String,
            enum:['low','medium','high'],
            required:[true,'severity is true']
        }

},{
    _id:false
})
const preparationPlanSchema = new mongoose.Schema({
    day:{
        type:String,
        required:[true,'day is required']

    },
    focus:{type:String,
        required:[true,'focus topics is required']

    },
    tasks:[{
        type:String,
        required:[true,'tasks are required']

}]
},{
    _id:false
})
const interviewreportSchema = new mongoose.Schema({
    jobdescription:{
        type:String,
        required:true
    },
    resume:{
        type:String
     },
    selfdescription: {
        type:String
    },
    matchScore:{
        type:Number,
        max:100,
        min:0
    },
    technicalQuestions:[technicalQuestionSchema],
    behavioralQuestions:[behavioralQuestionSchema],
    skillGaps:[skillGapSchema],
    preparationPlan:[preparationPlanSchema],
    user:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'

    },
    title:{
        type:String,
        required:[true,'title is required']

    }

},
  
{
    timestamps:true
})
const interviewReportModel = mongoose.model("InterviewReport", interviewreportSchema)
module.exports = interviewReportModel;