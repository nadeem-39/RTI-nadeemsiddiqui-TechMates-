require('dotenv').config()
const express = require('express');
const app = express();
const OpenAI = require('openai');
const path = require('path');
const ejsMate = require('ejs-mate');

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
    res.render('home.ejs',{result:null});
})

app.post('/chat',async(req,res)=>{
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

app.listen(8000,()=>{
    console.log('server started ');
})