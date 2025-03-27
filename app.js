require('dotenv').config()
const express = require('express');
const app = express();
const OpenAI = require('openai');
const path = require('path');
const ejsMate = require('ejs-mate');
const { PDFDocument, rgb } = require("pdf-lib");
const fs = require('fs');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'view'));
app.use(express.static(path.join(__dirname,'public')));
app.engine('ejs',ejsMate);

app.use(express.urlencoded({extended:true}));
const openai = new OpenAI({
    apiKey:process.env.OPEN_AI_API
});


// AI API

app.get('/',(req,res)=>{
    res.render('webPages/home.ejs');
})

app.get('/ai/query',(req,res)=>{
    res.render('webPages/aiQuery.ejs',{result:null});
})

//chat api
app.post('/ai/chat',async(req,res)=>{
    console.log(req.body.question);
    const message = req.body.question;

    try{
        const response = await openai.chat.completions.create({
            model:'gpt-4o-mini',
            messages: [{"role": "user", "content": message},],
        });
            res.render('webPages/aiQuery.ejs',{result:response.choices[0].message.content});  
    }catch (error) {
        res.send({ error: error.message });
    }
})

    let name = 'sehaj';
    let address = 'ghaziabad';
    let phone = 98893493;
    let email = 'nadeemsiddiqui0390@gmail.com'
    let departMentName = "cse";
    let letterQuery = ' about education ';
    let location = 'delhi';
    let timePeriod = '20day';
    let date = '23-3-2004'; 

app.post('/data/nameAddress',(req,res)=>{
    name = req.body.name;
    address = req.body.address;
    res.render('webPages/2phoneEmail.ejs');
})
app.post('/data/phoneEmail',(req,res)=>{
    phone = req.body.phone;
    email = req.body.email;
    res.render('webPages/3query.ejs');
})
app.post('/data/query',(req,res)=>{

    letterQuery = req.body.email;
    res.render('webPages/4deparmentLocation.ejs');
})
app.post('/data/departmentLocation',(req,res)=>{
    departMentName = req.body.departmentName;
    location = req.body.location;
    res.render('webPages/5timeperiodDate.ejs');
})
app.post('/data/TimePeriodDate',(req,res)=>{
    date = req.body.date;
    timePeriod = req.body.timePeriod;
    res.redirect('/ai/generatePaper');
})

// formal letter generated ai
app.get('/ai/generatePaper', async(req,res)=>{
    // let name = 'sehaj';
    // let address = 'ghaziabad';
    // let phone = 98893493;
    // let email = 'nadeemsiddiqui0390@gmail.com'
    // let departMentName = "cse";
    // let letterQuery = ' about education ';
    // let location = 'delhi';
    // let timePeriod = '20day';
    // let date = '23-3-2004';
    

    let promt = `Generate a formal RTI (Right to Information) application letter under the RTI Act, 2005. Include the following details in a clear and professional format:
    Sender Information:
    
    Full Name: ${name}
    
    Complete Address: ${address}
    
    Contact Number: ${phone}
    
    Email : ${email}
    
    Recipients Details:
    
    Public Information Officer (PIO) / Authority Name: ${departMentName}
    
    
    Subject: "Request for Information under RTI Act, 2005"
    
    Body of the Letter:
    
    A formal request for information regarding: ${letterQuery}
    
    Location/Area of Concern: ${location}
    
    Time Period/Duration: ${timePeriod}
    
    
    If hard copies are needed, mention: "I request that the information be provided in hard copy format."
    
    If inspection of documents is required: "I would like to inspect the relevant records before obtaining copies."
    
    Closing:
    
    "As per Section 6 of the RTI Act, I kindly request you to provide the information within 30 days of receipt of this application."
    
    "Please acknowledge receipt of this application as per Section 7(1) of the RTI Act."
    
    Attachments (if any):
    
    "Attached: Self-attested ID proof & Postal Order/DD (if applicable)."
    
    Date & Place:
    
    Date: ${date}
    
    Place: ${address}
    
    Format the letter in a professional and legally appropriate manner. and do not use square brackets`
    let newResult ="";
    try{
        const response = await openai.chat.completions.create({
            model:'gpt-4o-mini',
            messages: [{"role": "user", "content": promt},],
        });
        let result= response.choices[0].message.content;
        newResult="";
        for (let i = 0; i < result.length; i++) {
            if(result[i]=='['){
                while(result[i]!=']')i++;
                i++
            }
            newResult+=result[i];
          }
            res.render("webPages/pdf.ejs",{newResult});  
    }catch (error) {
        res.send({ error: error.message });
    }
    //     // Create a new PDF document
    //     const pdfDoc = await PDFDocument.create();
    //     const page = pdfDoc.addPage([1200, 800]);
    
    //     // Add text to the PDF
    //     page.drawText(newResult, {
    //         x: 150,
    //         y: 1350,
    //         size: 12,
    //         color: rgb(0, 0, 0),
    //     });
    
    //     // Save the PDF
    //     const pdfBytes = await pdfDoc.save();
    //     fs.writeFileSync("output.pdf", pdfBytes);


})

app.listen(8000,()=>{
    console.log('server started ');
})