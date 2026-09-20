const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();
const app = require('./src/app');
const userModel = require('./src/models/user.model');
const connectDB = require('./src/config/db');
const {generateInterviewReport} = require ('./src/services/ai.services')
connectDB();

const { resume, selfDescription, jobDescription } = require('./src/services/temp.js'); 
// or wherever you saved those consts from earlier

generateInterviewReport({ resume, selfDescription, jobDescription })
  .then(report => console.log(report))
  .catch(err => console.error(err));
app.listen(3000, () => {
  console.log('Server is running on port 3000');
}); 