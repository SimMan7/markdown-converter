def handler(request):
    """Vercel serverless function handler for ads.txt"""
    ads_content = "google.com, ca-pub-6865885814212781, DIRECT, f08c47fec0942fa0"
    
    return ads_content, 200, {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600'
    }
