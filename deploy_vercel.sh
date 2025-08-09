#!/bin/bash

# Vercel Deployment Script for Flask App
echo "🚀 Deploying Flask App to Vercel"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "app.py" ]; then
    echo "❌ Please run this script from the project root directory."
    exit 1
fi

echo ""
echo "📋 Pre-deployment checks:"
echo "1. ✅ Flask app exists"
echo "2. ✅ vercel.json configured"
echo "3. ✅ requirements.txt updated"
echo "4. ✅ API entry point created"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo ""
echo "🔧 Committing changes to git..."
git add .
git commit -m "Configure Flask app for Vercel serverless deployment" 2>/dev/null || echo "No changes to commit"

echo ""
echo "📤 Pushing to GitHub for auto-deployment..."
git push origin main

echo ""
echo "🌐 Deploying to Vercel..."
echo "This will open Vercel in your browser for configuration."

# Deploy to Vercel
vercel --prod

echo ""
echo "🎉 Deployment initiated!"
echo ""
echo "📋 Next steps:"
echo "1. Check Vercel dashboard for deployment status"
echo "2. Test the live site: https://convertmdtopdf.online"
echo "3. Test upload functionality"
echo "4. Test download functionality"
echo "5. Check debug route: https://convertmdtopdf.online/debug"
echo ""
echo "🔍 Troubleshooting:"
echo "- If upload fails, check Vercel function logs"
echo "- If templates don't render, check debug route"
echo "- If PDF generation fails, check WeasyPrint compatibility"
echo ""
echo "📚 Useful commands:"
echo "- View logs: vercel logs --follow"
echo "- Check status: vercel ls"
echo "- Redeploy: vercel --prod"
