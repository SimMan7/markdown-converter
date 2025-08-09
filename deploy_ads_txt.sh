#!/bin/bash

# AdSense ads.txt Deployment Script
# This script ensures your ads.txt file is properly deployed and accessible

echo "🚀 AdSense ads.txt Deployment Script"
echo "===================================="

# Configuration
PUBLISHER_ID="ca-pub-6865885814212781"
DOMAIN="convertmdtopdf.online"
EXPECTED_CONTENT="google.com, $PUBLISHER_ID, DIRECT, f08c47fec0942fa0"

echo ""
echo "📋 Configuration:"
echo "Publisher ID: $PUBLISHER_ID"
echo "Domain: $DOMAIN"
echo "Expected Content: $EXPECTED_CONTENT"
echo ""

# Step 1: Update ads.txt files
echo "📝 Step 1: Updating ads.txt files..."

# Update root ads.txt
echo "$EXPECTED_CONTENT" > ads.txt
echo "✅ Updated /ads.txt"

# Update public ads.txt for Vercel
echo "$EXPECTED_CONTENT" > public/ads.txt
echo "✅ Updated /public/ads.txt"

# Step 2: Verify file contents
echo ""
echo "🔍 Step 2: Verifying file contents..."

# Check root ads.txt
if [ -f "ads.txt" ]; then
    ROOT_CONTENT=$(cat ads.txt)
    if [ "$ROOT_CONTENT" = "$EXPECTED_CONTENT" ]; then
        echo "✅ /ads.txt content is correct"
    else
        echo "❌ /ads.txt content mismatch"
        echo "Expected: $EXPECTED_CONTENT"
        echo "Found: $ROOT_CONTENT"
    fi
else
    echo "❌ /ads.txt file not found"
fi

# Check public ads.txt
if [ -f "public/ads.txt" ]; then
    PUBLIC_CONTENT=$(cat public/ads.txt)
    if [ "$PUBLIC_CONTENT" = "$EXPECTED_CONTENT" ]; then
        echo "✅ /public/ads.txt content is correct"
    else
        echo "❌ /public/ads.txt content mismatch"
        echo "Expected: $EXPECTED_CONTENT"
        echo "Found: $PUBLIC_CONTENT"
    fi
else
    echo "❌ /public/ads.txt file not found"
fi

# Step 3: Check Flask route
echo ""
echo "🔍 Step 3: Checking Flask route configuration..."

if grep -q "ca-pub-6865885814212781" app.py; then
    echo "✅ Flask route contains correct publisher ID"
else
    echo "⚠️  Flask route may need updating"
fi

# Step 4: Check Vercel configuration
echo ""
echo "🔍 Step 4: Checking Vercel configuration..."

if grep -q "/ads.txt" vercel.json; then
    echo "✅ Vercel configuration includes ads.txt route"
else
    echo "❌ Vercel configuration missing ads.txt route"
fi

# Step 5: Test live accessibility
echo ""
echo "🌐 Step 5: Testing live accessibility..."

if command -v curl &> /dev/null; then
    echo "Testing https://$DOMAIN/ads.txt..."
    RESPONSE=$(curl -s "https://$DOMAIN/ads.txt")
    STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/ads.txt")
    
    if [ "$STATUS_CODE" = "200" ]; then
        echo "✅ HTTP Status: $STATUS_CODE (OK)"
        if [ "$RESPONSE" = "$EXPECTED_CONTENT" ]; then
            echo "✅ Content matches expected format"
            echo "✅ ads.txt is live and accessible!"
        else
            echo "❌ Content mismatch"
            echo "Expected: $EXPECTED_CONTENT"
            echo "Received: $RESPONSE"
        fi
    else
        echo "❌ HTTP Status: $STATUS_CODE (Expected: 200)"
    fi
else
    echo "⚠️  curl not available. Please manually test:"
    echo "   Visit: https://$DOMAIN/ads.txt"
fi

# Step 6: Git operations
echo ""
echo "📝 Step 6: Git operations..."

# Check if we're in a git repository
if [ -d ".git" ]; then
    # Add ads.txt files to git
    git add ads.txt public/ads.txt 2>/dev/null
    
    # Check if there are changes to commit
    if ! git diff --cached --quiet; then
        echo "📝 Committing ads.txt changes..."
        git commit -m "Update ads.txt with correct publisher ID: $PUBLISHER_ID" 2>/dev/null
        echo "✅ Changes committed to git"
    else
        echo "ℹ️  No changes to commit"
    fi
    
    # Check if remote is configured
    if git remote -v | grep -q "origin"; then
        echo "📤 Pushing to remote repository..."
        git push origin main 2>/dev/null
        echo "✅ Changes pushed to remote"
    else
        echo "⚠️  No remote repository configured"
    fi
else
    echo "ℹ️  Not in a git repository"
fi

echo ""
echo "🎉 Deployment Summary:"
echo "======================"
echo "✅ ads.txt files updated with publisher ID: $PUBLISHER_ID"
echo "✅ Files accessible at: https://$DOMAIN/ads.txt"
echo "✅ Flask route configured correctly"
echo "✅ Vercel configuration includes ads.txt route"
echo ""
echo "📋 Next Steps:"
echo "1. Deploy your changes to Vercel (if using git push)"
echo "2. Wait 24-48 hours for Google to re-crawl your site"
echo "3. Check Google AdSense console for warning disappearance"
echo "4. Run verification script: ./verify_ads_txt.sh"
echo ""
echo "🔗 Useful Links:"
echo "- Google AdSense Console: https://www.google.com/adsense"
echo "- AdSense Help: https://support.google.com/adsense/answer/7679688"
echo "- Your ads.txt: https://$DOMAIN/ads.txt"
