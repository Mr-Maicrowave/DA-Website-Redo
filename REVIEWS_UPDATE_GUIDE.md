# Google Reviews Update Guide

This guide explains how to update your website's Google Reviews monthly using the static data system.

## Overview

Your website now uses a static reviews system that displays all your Google Reviews without relying on third-party services. Reviews are stored in `/src/data/reviews.json` and automatically displayed throughout your website.

## Monthly Update Process (10 minutes)

### Method 1: Chrome Extension (Recommended)

1. **Install Phantom - GMB Audit Tool**
   - Go to Chrome Web Store
   - Search for "Phantom - GMB Audit Tool"
   - Click "Add to Chrome"

2. **Export Your Reviews**
   - Navigate to your Google Business Profile reviews page
   - Click the Phantom extension icon
   - Click "Export Reviews"
   - Wait for the tool to scrape all reviews (this may take 10-15 minutes for 450+ reviews)
   - Download the CSV file

3. **Convert CSV to JSON**
   - Use the provided conversion script (see below)
   - Or manually format the data to match the existing structure

4. **Update Website**
   - Replace the content of `/src/data/reviews.json`
   - Deploy your website
   - Verify reviews display correctly

### Method 2: Google Takeout (Alternative)

1. **Export via Google Takeout**
   - Go to [takeout.google.com](https://takeout.google.com)
   - Deselect all services
   - Select only "Google Business Profile"
   - Create export and download

2. **Extract Reviews**
   - Upload to [saijogeorge.com/export-google-reviews](https://saijogeorge.com/export-google-reviews)
   - Download clean CSV file

3. **Follow steps 3-4 from Method 1**

## Data Structure

Your reviews JSON file follows this structure:

```json
{
  "summary": {
    "total": 450,
    "average": 5.0,
    "lastUpdated": "2024-07-21",
    "breakdown": {
      "5_star": 442,
      "4_star": 7,
      "3_star": 1,
      "2_star": 0,
      "1_star": 0
    }
  },
  "reviews": [
    {
      "id": "unique-review-id",
      "author": "Customer Name",
      "rating": 5,
      "date": "2024-07-15",
      "text": "Review content...",
      "helpful": true,
      "featured": false,
      "tags": ["mathematics", "confidence"],
      "subject": "Mathematics"
    }
  ]
}
```

## CSV to JSON Conversion Script

Create a simple script to convert your CSV export to the required JSON format:

```javascript
// Place this in a file called convert-reviews.js
const fs = require('fs');
const csv = require('csv-parser');

const reviews = [];
let totalReviews = 0;
let ratingSum = 0;
const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

fs.createReadStream('reviews.csv')
  .pipe(csv())
  .on('data', (row) => {
    const review = {
      id: `review-${totalReviews + 1}`,
      author: row['Author Name'] || row['author'],
      rating: parseInt(row['Rating'] || row['rating']),
      date: row['Date'] || row['date'],
      text: row['Review Text'] || row['text'],
      helpful: row['Review Text'].length > 100,
      featured: Math.random() > 0.8, // Mark 20% as featured
      tags: extractTags(row['Review Text']),
      subject: guessSubject(row['Review Text'])
    };
    
    reviews.push(review);
    totalReviews++;
    ratingSum += review.rating;
    breakdown[review.rating]++;
  })
  .on('end', () => {
    const output = {
      summary: {
        total: totalReviews,
        average: Math.round((ratingSum / totalReviews) * 10) / 10,
        lastUpdated: new Date().toISOString().split('T')[0],
        breakdown: {
          '5_star': breakdown[5],
          '4_star': breakdown[4],
          '3_star': breakdown[3],
          '2_star': breakdown[2],
          '1_star': breakdown[1]
        }
      },
      reviews: reviews.sort((a, b) => new Date(b.date) - new Date(a.date))
    };
    
    fs.writeFileSync('reviews.json', JSON.stringify(output, null, 2));
    console.log(`Converted ${totalReviews} reviews to JSON format`);
  });

function extractTags(text) {
  // Simple keyword extraction
  const keywords = ['mathematics', 'english', 'science', 'physics', 'chemistry', 'confidence', 'HSC', 'improvement'];
  return keywords.filter(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  );
}

function guessSubject(text) {
  const subjects = {
    'mathematics': ['math', 'maths', 'mathematics', 'algebra', 'calculus'],
    'english': ['english', 'writing', 'literature', 'essay'],
    'science': ['science', 'biology', 'chemistry', 'physics'],
    'physics': ['physics'],
    'chemistry': ['chemistry']
  };
  
  for (const [subject, keywords] of Object.entries(subjects)) {
    if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
      return subject.charAt(0).toUpperCase() + subject.slice(1);
    }
  }
  return 'General';
}
```

## Features of the Static Reviews System

### ✅ **Homepage Integration**
- Reviews carousel showing featured reviews
- Star rating badge in hero section
- SEO-friendly structured data

### ✅ **Advanced Features**
- Search and filter functionality
- Pagination for large datasets
- Featured review highlighting
- Subject-based categorization
- Responsive design

### ✅ **Performance Benefits**
- Fast loading (no external API calls)
- Works offline
- No rate limiting
- Better SEO scores

## Troubleshooting

**Issue: Reviews not displaying**
- Check `/src/data/reviews.json` file exists
- Verify JSON format is valid
- Check browser console for errors

**Issue: Build errors**
- Ensure all review objects have required fields
- Validate JSON syntax using jsonlint.com
- Check date format is YYYY-MM-DD

**Issue: Styling problems**
- Reviews inherit your existing DA Tuition styling
- Check `/src/index.css` for custom review styles
- Verify Tailwind classes are working

## Support

For technical issues with the reviews system, the main files to check are:
- `/src/data/reviews.json` - Your reviews data
- `/src/components/StaticGoogleReviews.tsx` - Main reviews component
- `/src/utils/reviewHelpers.ts` - Helper functions
- `/src/components/GoogleReviews.tsx` - Homepage integration

## Next Steps

1. **Set Monthly Reminder**: Add a calendar reminder for the first of each month
2. **Test the Process**: Try exporting a small sample first
3. **Backup Data**: Keep copies of your reviews JSON files
4. **Monitor Website**: Check that reviews display correctly after updates

Your 450+ five-star reviews are now a powerful, fast-loading social proof system with complete control and zero ongoing costs!