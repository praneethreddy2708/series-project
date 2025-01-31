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
        const serpApiKey = "214b3fbcbe44cdf69aeb81bd4c1d6a542b05f081988ee7d875405d16e9dace5a";//ca134a9c524710b19c806ffea7a4054f91559be27785d2612b03e6eb6d91f686";
        const apolloApiKey = "UPpz8GbPyNSFXmPhLLqbLw";//"XBOMKV9yi03Uu_ZeVl_2rg";//"n8Oh3zUxgolsLtbFGIZs3A";
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