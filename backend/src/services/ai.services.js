const { GoogleGenAI } = require("@google/genai"); 
const{z}= require('zod')
const puppeteer = require('puppeteer')


const ai = new GoogleGenAI({
    apiKey :process.env.GOOGLE_GENAI_API_KEY
});
const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})
async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
    headless: "new",
        executablePath:'C:/Users/win/AppData/Local/Google/Chrome/Application/chrome.exe',
    args: ["--no-sandbox", "--disable-setuid-sandbox"] // needed on most Linux servers/Render/Vercel-style hosts
  });

  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true, // without this, any background colors/gradients in your HTML won't show up in the PDF
      margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" }
    });

    return pdfBuffer;
  } finally {
    await browser.close(); // ensures the browser closes even if setContent or pdf() throws
  }
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        responseSchema: z.toJSONSchema(interviewReportSchema),
        }
    })

    return JSON.parse(response.text)
}
async function generatepdf({resume,selfDescription,jobDescription}){
    const resumepdfSchema = z.object({
        html:z.string().describe('the html content of the pdf which can be converted into pdf using any library like puppeteer')

    })
const prompt = `You are an expert resume writer, ATS (Applicant Tracking System) optimization specialist, and resume designer.

Generate a professional, visually polished, ATS-friendly resume tailored specifically to the job description below, using the candidate's background.

CANDIDATE INFORMATION:
Resume/Experience: ${resume}
Self Description: ${selfDescription}

TARGET JOB DESCRIPTION:
${jobDescription}

INSTRUCTIONS:

1. ATS Compatibility (non-negotiable):
   - Single-column layout only — no tables, no CSS multi-column, no floated side-by-side sections
   - Use standard section headings: "Summary", "Skills", "Experience", "Projects", "Education"
   - No images, icons, or text embedded in graphics
   - Use real HTML text elements (h1, h2, h3, p, ul, li) — never render text as an image or SVG
   - Styling is applied via CSS only, never inline images or decorative fonts that replace real text

2. Keyword Tailoring:
   - Extract key skills, technologies, and qualifications from the job description
   - Naturally incorporate matching keywords into Summary, Skills, and Experience
   - Mirror exact terminology from the job description (e.g. "React.js" not "ReactJS")
   - Only include skills/experience the candidate actually has — never fabricate qualifications

3. Visual Design (apply via embedded <style> in the HTML):
   - Use ONE accent color (a professional tone — navy, deep teal, charcoal, or dark burgundy) for name, section headings, and subtle dividers only. Body text stays black/dark gray for readability and print-safety
   - Use two font families max: one for headings (e.g. a clean serif or semi-bold sans-serif like Georgia or Lato), one for body text (e.g. Arial, Calibri, or Inter) — never more than two, and never decorative/script fonts
   - Section headings should have a consistent visual treatment: e.g. accent color + bold + a thin bottom border, uniform across all sections
   - Use consistent spacing/margins between sections (don't let some sections look cramped and others loose)
   - Left-align body content; right-align or use flex space-between for date ranges next to job titles
   - Use subtle visual hierarchy: name largest, section headings medium, job titles bold, dates/companies in a slightly muted gray
   - Avoid anything that reads as a template default — no generic "Objective:" boilerplate, no centered-everything layout, no rainbow color use

4. Content Guidelines:
   - Write a 2-3 sentence professional summary aligned to this specific role
   - Rewrite Experience bullets to emphasize achievements/responsibilities relevant to the target job — reframe transferable skills from non-technical roles toward the technical angle where genuinely applicable
   - Start bullets with strong action verbs (Built, Led, Optimized, Designed, Implemented)
   - Quantify achievements with real numbers wherever the candidate's info allows
   - Vary sentence structure and phrasing naturally — avoid repetitive AI-sounding patterns (e.g. don't start every bullet with the same verb, avoid overused phrases like "leveraged," "utilized," "spearheaded" more than once each)
   - Keep tone confident and human, not robotic or overly formal

5. Format:
   - Return a complete, self-contained HTML document with an embedded <style> block in the <head>
   - No external stylesheets, no inline style="" attributes scattered everywhere — centralize styling in the <style> block using classes
   - Ensure consistent alignment: contact info under name, job title/company on one line with dates aligned right, bullet indentation uniform throughout

Respond with a JSON object containing a single field "html" with the complete HTML document (including <style>) of the resume.`;
    const response =  await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config:{
             responseMimeType: "application/json",
             responseSchema: z.toJSONSchema(resumepdfSchema),
        }
    })
     const jsonContent = JSON.parse(response.text)
     const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
     return pdfBuffer


}

module.exports={generateInterviewReport,generatepdf}