#!/bin/bash

# MarkdownConverter Deployment Script
# This script helps set up the GitHub repository and Vercel deployment

echo "🚀 MarkdownConverter Deployment Script"
echo "======================================"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "app.py" ]; then
    echo "❌ Please run this script from the project root directory."
    exit 1
fi

echo ""
echo "📋 Prerequisites:"
echo "1. GitHub account"
echo "2. Vercel account (sign up at vercel.com)"
echo "3. Domain: convertmdtopdf.online (from GoDaddy)"
echo ""

read -p "Do you have all prerequisites? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please set up the prerequisites and run this script again."
    exit 1
fi

echo ""
echo "🔧 Setting up Git repository..."

# Initialize git if not already done
if [ ! -d ".git" ]; then
    git init
    echo "✅ Git repository initialized"
fi

# Add all files
git add .

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "ℹ️  No changes to commit"
else
    git commit -m "Initial commit - MarkdownConverter ready for deployment"
    echo "✅ Changes committed"
fi

echo ""
echo "📝 Next steps:"
echo ""
echo "1. Create a new repository on GitHub:"
echo "   - Go to github.com"
echo "   - Click 'New repository'"
echo "   - Name it 'markdown-converter'"
echo "   - Don't initialize with README (we already have one)"
echo ""
echo "2. Connect your local repository to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/markdown-converter.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Deploy to Vercel:"
echo "   - Go to vercel.com"
echo "   - Click 'New Project'"
echo "   - Import your GitHub repository"
echo "   - Configure settings:"
echo "     * Framework Preset: Other"
echo "     * Root Directory: ./"
echo "     * Build Command: (leave empty)"
echo "     * Output Directory: (leave empty)"
echo "     * Install Command: pip install -r requirements.txt"
echo ""
echo "4. Set environment variables in Vercel:"
echo "   - SENDGRID_API_KEY=your_sendgrid_api_key"
echo "   - SESSION_SECRET=your_session_secret_key"
echo "   - DATABASE_URL=your_postgresql_database_url"
echo ""
echo "5. Add custom domain:"
echo "   - In Vercel project settings, go to 'Domains'"
echo "   - Add: convertmdtopdf.online"
echo "   - Follow Vercel's DNS instructions for GoDaddy"
echo ""
echo "🎉 Your MarkdownConverter will be live at convertmdtopdf.online!"
echo ""
echo "📋 AdSense ads.txt Setup:"
echo "✅ ads.txt file created with publisher ID: ca-pub-6865885814212781"
echo "✅ File will be accessible at: https://convertmdtopdf.online/ads.txt"
echo "✅ Both Flask app and Vercel static serving configured"
echo ""
echo "🔍 To verify ads.txt is working:"
echo "   curl https://convertmdtopdf.online/ads.txt"
echo "   or visit: https://convertmdtopdf.online/ads.txt in your browser"
echo ""
echo "📚 For detailed instructions, see README.md" 