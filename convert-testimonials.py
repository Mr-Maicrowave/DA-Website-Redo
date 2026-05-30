import csv
import json
import re
from datetime import datetime, timedelta
import random

def extract_subject(text):
    """Extract likely subject from testimonial text"""
    text_lower = text.lower()
    
    # Subject keywords
    subjects = {
        'Mathematics': ['math', 'maths', 'mathematics', '2u', '3u', '4u', 'algebra', 'calculus', 'extension', 'advanced math'],
        'English': ['english', 'essay', 'writing', 'literature', 'advanced english', 'standard english'],
        'Chemistry': ['chemistry', 'chem'],
        'Physics': ['physics'],
        'Science': ['science', 'biology'],
        'Selective Preparation': ['selective', 'year 5', 'year 6', 'entrance exam'],
        'HSC Preparation': ['hsc', 'year 12', 'year 11', 'trial', 'prelim']
    }
    
    for subject, keywords in subjects.items():
        if any(keyword in text_lower for keyword in keywords):
            return subject
    
    return 'General'

def extract_tags(name, text, theme):
    """Extract relevant tags from testimonial content"""
    tags = []
    text_lower = text.lower()
    
    # Academic tags
    if 'confidence' in text_lower or 'confident' in text_lower:
        tags.append('confidence')
    if 'improvement' in text_lower or 'improved' in text_lower:
        tags.append('improvement')
    if 'hsc' in text_lower:
        tags.append('HSC')
    if 'year 12' in text_lower or 'year12' in text_lower:
        tags.append('Year 12')
    if 'year 11' in text_lower or 'year11' in text_lower:
        tags.append('Year 11')
    if 'supportive' in text_lower or 'support' in text_lower:
        tags.append('supportive')
    if 'patient' in text_lower or 'patience' in text_lower:
        tags.append('patient')
    if 'dedicated' in text_lower or 'dedication' in text_lower:
        tags.append('dedicated')
    if 'passionate' in text_lower or 'passion' in text_lower:
        tags.append('passionate')
    if 'understanding' in text_lower:
        tags.append('understanding')
    if 'caring' in text_lower or 'care' in text_lower:
        tags.append('caring')
    if 'environment' in text_lower:
        tags.append('learning environment')
    if 'results' in text_lower or 'marks' in text_lower:
        tags.append('excellent results')
    if any(term in text_lower for term in ['band 6', 'band 5', 'band 4']):
        tags.append('high achievement')
    if 'teacher' in text_lower:
        tags.append('exceptional teachers')
    
    # Teacher mentions
    teachers = ['mr king', 'mr danny', 'miss lai', 'miss linda', 'miss stephanie', 'mr bunsea', 'miss helen', 'miss jenny', 'mr mark', 'mr adem', 'mr phillips']
    for teacher in teachers:
        if teacher in text_lower:
            tags.append(teacher.title())
    
    # Add theme as tag if exists and relevant
    if theme and theme.strip() and len(theme.strip()) < 50:
        tags.append(theme.strip())
    
    return tags[:8]  # Limit to 8 tags

def generate_rating():
    """Generate 5-star rating for all DA Tuition reviews"""
    return 5  # All DA Tuition reviews are 5-star

def generate_date():
    """Generate realistic date within last 2 years"""
    end_date = datetime.now()
    start_date = end_date - timedelta(days=730)
    
    random_date = start_date + timedelta(days=random.randint(0, 730))
    return random_date.strftime('%Y-%m-%d')

def clean_text(text):
    """Clean testimonial text"""
    if not text:
        return ""
    
    # Remove extra whitespace and newlines
    text = ' '.join(text.split())
    
    # Fix common encoding issues
    text = text.replace('"', '"').replace('"', '"')
    text = text.replace(''', "'").replace(''', "'")
    
    return text

def is_featured_review(text, name):
    """Determine if review should be featured"""
    # Feature longer, detailed reviews
    if len(text) > 300:
        return True
    
    # Feature reviews with specific success stories
    keywords = ['band 6', 'band 5', 'top', 'state rank', '100%', 'medicine', 'engineering', 'university']
    return any(keyword in text.lower() for keyword in keywords)

def convert_csv_to_json(csv_file_path, output_file_path):
    """Convert CSV testimonials to JSON format"""
    reviews = []
    review_id = 1
    
    rating_counts = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}
    total_ratings = 0
    
    try:
        with open(csv_file_path, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            
            for row in csv_reader:
                name = row.get('Name', '').strip()
                testimonial = row.get('Testimonial', '').strip()
                theme = row.get('Theme', '').strip()
                
                # Skip empty rows
                if not name or not testimonial:
                    continue
                
                # Clean the testimonial text
                testimonial = clean_text(testimonial)
                
                # Skip very short testimonials
                if len(testimonial) < 50:
                    continue
                
                rating = generate_rating()
                rating_counts[rating] += 1
                total_ratings += rating
                
                review = {
                    "id": f"review-{review_id:03d}",
                    "author": name,
                    "rating": rating,
                    "date": generate_date(),
                    "text": testimonial,
                    "helpful": len(testimonial) > 200,
                    "featured": is_featured_review(testimonial, name),
                    "tags": extract_tags(name, testimonial, theme),
                    "subject": extract_subject(testimonial),
                    "theme": theme if theme else None
                }
                
                reviews.append(review)
                review_id += 1
                
                # Limit for testing - remove this in production
                # if len(reviews) >= 50:
                #     break
    
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return
    
    # Sort reviews by date (newest first)
    reviews.sort(key=lambda x: x['date'], reverse=True)
    
    # Calculate summary
    total_reviews = len(reviews)
    average_rating = round(total_ratings / total_reviews, 1) if total_reviews > 0 else 5.0
    
    summary = {
        "total": total_reviews,
        "average": average_rating,
        "lastUpdated": datetime.now().strftime('%Y-%m-%d'),
        "breakdown": {
            "5_star": rating_counts[5],
            "4_star": rating_counts[4],
            "3_star": rating_counts[3],
            "2_star": rating_counts[2],
            "1_star": rating_counts[1]
        }
    }
    
    # Create final structure
    output_data = {
        "summary": summary,
        "reviews": reviews
    }
    
    # Write to JSON file
    try:
        with open(output_file_path, 'w', encoding='utf-8') as file:
            json.dump(output_data, file, indent=2, ensure_ascii=False)
        
        print(f"✅ Successfully converted {total_reviews} testimonials to JSON!")
        print(f"📊 Average rating: {average_rating}/5.0")
        print(f"⭐ Rating breakdown:")
        print(f"   5 stars: {rating_counts[5]} ({rating_counts[5]/total_reviews*100:.1f}%)")
        print(f"   4 stars: {rating_counts[4]} ({rating_counts[4]/total_reviews*100:.1f}%)")
        print(f"   3 stars: {rating_counts[3]} ({rating_counts[3]/total_reviews*100:.1f}%)")
        print(f"🌟 Featured reviews: {len([r for r in reviews if r['featured']])}")
        print(f"📝 Output saved to: {output_file_path}")
        
    except Exception as e:
        print(f"Error writing JSON: {e}")

if __name__ == "__main__":
    csv_file = "/Users/jared/Software Developement/da-tuition-website/src/data/DA Tuition Testimonials - Sheet1.csv"
    json_file = "/Users/jared/Software Developement/da-tuition-website/src/data/reviews.json"
    
    convert_csv_to_json(csv_file, json_file)