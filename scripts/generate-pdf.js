// scripts/generate-pdf.js
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePdf() {
  const liascriptFile = 'week02_.md';
  const outputDir = 'dist';
  const outputPdf = path.join(outputDir, 'week02_lesson.pdf');

  console.log('Starting PDF generation script...');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    console.log(`Creating output directory: ${outputDir}`);
    fs.mkdirSync(outputDir, { recursive: true });
  } else {
    console.log(`Output directory already exists: ${outputDir}`);
  }

  // Path to your Liascript file relative to the project root
  const liascriptPath = `file://${path.resolve(liascriptFile)}`;
  console.log(`Liascript file path resolved to: ${liascriptPath}`);

  try {
    // Launch a headless browser
    console.log('Launching Puppeteer browser...');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for GitHub Actions
    });
    console.log('Browser launched successfully.');

    const page = await browser.newPage();
    console.log('New page created.');

    // Navigate to your Liascript file
    console.log(`Navigating to: ${liascriptPath}`);
    // Added a 60-second timeout for the page navigation, in case of large files or slow loading
    await page.goto(liascriptPath, { waitUntil: 'networkidle0', timeout: 60000 });
    console.log('Page navigated successfully.');

    // Optional: Wait for Liascript to fully render.
    // Replaced page.waitForTimeout with a standard JavaScript Promise for delay.
    console.log('Waiting for Liascript content to settle (2 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Standard JS delay
    console.log('Content settled.');

    // Generate PDF
    console.log(`Generating PDF to: ${outputPdf}`);
    await page.pdf({
      path: outputPdf,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      }
    });
    console.log('PDF generation complete.');

    await browser.close();
    console.log('Browser closed.');
    console.log(`PDF generated at: ${outputPdf}`);

  } catch (error) {
    // Catch any errors during the Puppeteer process and log them
    console.error('An error occurred during PDF generation:', error);
    process.exit(1); // Exit the process with an error code to fail the GitHub Action step
  }
}

// Ensure any unhandled promise rejections are also caught and log an error
generatePdf().catch(error => {
  console.error('Unhandled error in generatePdf function:', error);
  process.exit(1);
});
