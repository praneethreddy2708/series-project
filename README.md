# series-project
This Node.js application automates the process of:
	1.	Using SerpAPI (Google engine) to find LinkedIn profiles for a given search term (e.g., “Angel Investor”).
	2.	Collecting unique LinkedIn URLs and storing them in MongoDB.
	3.	Calling an enrichment API (Apollo.io by default, but can be replaced) to retrieve email addresses associated with each LinkedIn URL.
	4.	Finally, generating a CSV file (email, name, linkedin_url) that you can download from a simple web page.

Table of Contents
	•	Prerequisites
	•	Installation
	•	Configuration
	•	Usage
	•	File Structure
	•	Replacing Apollo.io With Another Service
	•	Troubleshooting
	•	License

 Prerequisites
	1.	Node.js (v14+ recommended)
	2.	npm or yarn
	3.	MongoDB (local or remote)
	4.	SerpAPI account (API Key)
	5.	Apollo.io account (API Key) or another email finder service
