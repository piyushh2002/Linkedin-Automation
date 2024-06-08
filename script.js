const puppeteer = require("puppeteer");
let {id,pass} = require("./secret");
let tab;
let dataFile = require("./data");


const email = "your_email@example.com";
const password = "your_password";
const jobSearchQuery = "Software Engineer";
const applicationData = {
    coverLetter: "I am interested in applying for the Software Engineer position at your company...",
    resumePath: "/path/to/your/resume.pdf",
    additionalQuestions: {
        question1: "Answer 1",
        question2: "Answer 2"
    }
};

async function main() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.linkedin.com/login');

    // Login
    await page.waitForSelector('#username');
    await page.type('#username', email);
    await page.type('#password', password);
    await page.click('.btn__primary--large');
    await page.waitForNavigation();

    // Search for jobs
    await page.goto('https://www.linkedin.com/jobs');
    await page.waitForSelector('#jobs-search-box-keyword-id-ember117');
    await page.type('#jobs-search-box-keyword-id-ember117', jobSearchQuery);
    await page.click('.jobs-search-box__submit-button');

    // Find and apply to job listings
    await page.waitForSelector('.jobs-search-results');
    const jobListings = await page.$$('.job-card-container');
    for (const jobListing of jobListings) {
        const applyButton = await jobListing.$('.jobs-apply-button');
        if (applyButton) {
            await applyButton.click();
            await page.waitForNavigation();

            // Fill out application form
            await page.waitForSelector('.job-card-container');
            await page.type('#cover-letter-input', applicationData.coverLetter);
            await page.attachFile('#file-browse-input', applicationData.resumePath);
            // Fill out additional questions if any
            if (applicationData.additionalQuestions) {
                await page.type('#question1', applicationData.additionalQuestions.question1);
                await page.type('#question2', applicationData.additionalQuestions.question2);
            }

            // Submit application
            await page.click('.jobs-apply-form__submit-button');
            // Wait for confirmation or error message
            await page.waitForTimeout(3000); // Adjust timeout as needed
            // Go back to job search results
            await page.goBack();
        }
    }

    // Close browser
    await browser.close();
}

main();
