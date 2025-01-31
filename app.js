const express = require('express');
const bodyParser = require('body-parser');
const { runSearchWorkflow } = require('./index.js');
const fs = require('fs'); 
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/process', async (req, res) => {
    try {
        const serpApiKey = "SERPAPI_API_KEY";
        const apolloApiKey = "Apollo_API_KEY";
        //const { bio } = req.body;
        const data = await runSearchWorkflow(req.body.bio, "linkedin", serpApiKey, apolloApiKey, 5);


        res.json(data || {});
    } catch (error) {
        console.error('Error generating email:', error);
        res.status(500).send('Error generating email');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});