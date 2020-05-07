const express = require('express');
const app = express();
require('dotenv').config()
require('./helpers');
const mongoose = require('mongoose');
const teamRoutes = require('./routes/teamRoutes');


var TeamModel = require('./models/team');
app.use('/team',teamRoutes);

mongoose.connect('mongodb+srv://sumit:5rXYpCfanupMRmKj@cluster0-95yz9.mongodb.net/teambox?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>{
    
    console.log('connected')
}).catch((error)=>{
    console.log(error)
})

app.listen(3000)