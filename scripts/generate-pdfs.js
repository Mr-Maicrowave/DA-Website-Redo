import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8080; // Changed to match running dev server
const BASE_URL = `http://localhost:${PORT}`;

const routes = [
    '/',
    '/interview',
    '/reviews',
    '/find-teacher',
    '/appreciation-advice',
    '/rising-star-2024',
    '/learning-formats',
    '/hsc-excellence',
    '/tutoring-canley-heights',
    '/success-stories',
    '/faq',
    '/our-approach',
    '/why-choose-da',
    '/subjects',
    '/programs/primary-school',
    '/programs/high-school',
    '/programs/hsc',
    '/subjects/mathematics',
    '/subjects/english',
    '/subjects/science',
    '/subjects/business-studies',
    '/subjects/legal-studies'
];

async function generatePdfs() {
    console.log(`Starting PDF generation for ${routes.length} pages...`);
    console.log(`Make sure your dev server is running on ${BASE_URL}\n`);

    const browser = await puppeteer.launch({ headless: 'new' });
    const mergedPdf = await PDFDocument.create();

    try {
        const page = await browser.newPage();
        // Set viewport to a good desktop size so responsive layouts look right
        await page.setViewport({ width: 1440, height: 900 });

        for (let i = 0; i < routes.length; i++) {
            const route = routes[i];
            const url = `${BASE_URL}${route}`;
            console.log(`[${i + 1}/${routes.length}] Processing: ${url}`);

            try {
                await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

                // Optional: Wait an extra second for any animations or fonts to finish loading
                await new Promise(r => setTimeout(r, 1000));

                // Generate PDF for this page
                const pdfBuffer = await page.pdf({
                    format: 'A4',
                    printBackground: true,
                    margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
                });

                // Load the generated PDF and copy its pages to our merged PDF
                const singlePdf = await PDFDocument.load(pdfBuffer);
                const copiedPages = await mergedPdf.copyPages(singlePdf, singlePdf.getPageIndices());

                copiedPages.forEach((page) => {
                    mergedPdf.addPage(page);
                });
                console.log(`  -> Successfully captured ${route}`);
            } catch (error) {
                console.error(`  -> Failed to capture ${route}:`, error.message);
            }
        }

        // Save the merged PDF
        const outputPath = path.join(process.cwd(), 'website-printouts.pdf');
        const pdfBytes = await mergedPdf.save();
        fs.writeFileSync(outputPath, pdfBytes);

        console.log(`\n🎉 Done! All pages have been saved to: ${outputPath}`);

    } catch (error) {
        console.error('Fatal error during PDF generation:', error);
    } finally {
        await browser.close();
    }
}

generatePdfs();
