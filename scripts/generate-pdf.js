// scripts/generate-pdf.js
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePdf() {
  const liascriptFile = 'week02_.md';
  const outputDir = 'dist';
  const outputPdf = path.join(outputDir, 'week02_lesson.pdf');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Path to your Liascript file relative to the project root
  // You might need to serve this via a simple HTTP server if Liascript requires it,
  // but for basic Markdown rendering, file:// URL might work.
  // For robustness, especially with media, a simple server is better.
  const liascriptPath = `file://${path.resolve(liascriptFile)}`;

  // Launch a headless browser
  const browser = await puppeteer.launch({
    headless: true, // Use 'new' for new headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for GitHub Actions
  });
  const page = await browser.newPage();

  // Navigate to your Liascript file
  // If Liascript requires a specific serving mechanism, this might need adjustment
  // For example, if you have an index.html that loads liascript and your markdown:
  // await page.goto(`file://${path.resolve('index.html')}`, { waitUntil: 'networkidle0' });
  // await page.waitForSelector('body.liascript'); // Wait for Liascript to load

  // For a simple .md file, it might just need to be served directly
  console.log(`Navigating to: ${liascriptPath}`);
  await page.goto(liascriptPath, { waitUntil: 'networkidle0' });

  // Optional: Wait for Liascript to fully render. You might need to adjust this.
  await page.waitForTimeout(2000); // Wait 2 seconds for content to settle

  // Generate PDF
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

  await browser.close();
  console.log(`PDF generated at: ${outputPdf}`);
}

generatePdf().catch(console.error);
