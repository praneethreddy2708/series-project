const { getJson } = require("serpapi");
const fs = require("fs");
const { Parser } = require("json2csv");
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

const connectToMongo = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToMongo();


// takes array of urls and return array of urls that are not in db
const getUnProcessedUrls = async (urls) => {
  try {
    const db = client.db('emails');
    const collection = db.collection('people');
    const existingUrls = await collection.find({ linkedin_url: { $in: urls } }).toArray();
    const existingUrlsSet = new Set(existingUrls.map((url) => url.linkedin_url));
    const newUrls = urls.filter((url) => !existingUrlsSet.has(url));
    return newUrls;
  } catch (error) {
    console.error('Error getting unprocessed urls:', error);
  }
}


// takes array of objects with email, name, linkedin_url and save to db
const saveEmailsToMongo = async (emailData) => {
  if (!emailData.length) return;
  const db = client.db('emails');
  const collection = db.collection('people');
  await collection.insertMany(emailData);
  console.log('Emails saved to MongoDB');
}

// Query Platforms (LinkedIn example)
async function searchPlatform(query, platform, apiKey, start=0, num=5) {
  try {
    if (platform === "linkedin") {
      const options = {
        engine: "google",
        q: `site:linkedin.com/in ${query}`,
        hl: "en",
        start,
        num, // Retrieve results in chunks
        api_key: apiKey,
      };
  
      const results = await getJson(options);
      console.log(results);
      const urls = results.organic_results.map((result) => result.link);
      return urls;
    }
  } catch (error) {
    console.error('Error searching platform:', error);
    throw error;
  }

  // Implement similar for Twitter and Instagram
}

// Extract Emails
async function extractEmails(urls, apolloApiKey) {
    if (!urls.length) return [];
    const emailData = [];
    for (url of urls) {
      const eurl = `https://api.apollo.io/api/v1/people/match?linkedin_url=${url}&reveal_personal_emails=false&reveal_phone_number=false`;
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
          'x-api-key': apolloApiKey
        }
      };
      try {
        const response = await fetch(eurl, options);
        const data = await response.json();
        if (data && data.person) {
          const { email, name } = data.person;
          emailData.push({ email, name, linkedin_url: url });
        }
      } catch (error) {
        console.error('Error extracting emails:', error);
        throw error;
      }
    }

    return emailData;
}


async function runSearchWorkflow(query, platform, serpApiKey, apolloApiKey, count) {
  try {
    let emails = [];
    let start = await client.db('emails').collection('people').countDocuments();
    while (emails.length < count) {
      const urls = await searchPlatform(query, platform, serpApiKey, start, count);
      const unProcessedUrls = await getUnProcessedUrls(urls);
      const emailData = await extractEmails(unProcessedUrls, apolloApiKey);
      await saveEmailsToMongo(emailData);
      emails = emails.concat(emailData.filter((data) => data.email));
      start += 10;
    }
    return emails;
  } catch (error) {
    console.error('Error running search workflow:', error);
    throw error;
  }
}


module.exports = { runSearchWorkflow };

