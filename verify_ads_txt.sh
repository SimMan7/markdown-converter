#!/bin/bash

# AdSense ads.txt Verification Script
# This script verifies that your ads.txt file is properly accessible

echo "🔍 AdSense ads.txt Verification Script"
echo "======================================"

# Configuration
DOMAIN="convertmdtopdf.online"
EXPECTED_CONTENT="google.com, ca-pub-6865885814212781, DIRECT, f08c47fec0942fa0"

echo ""
echo "📋 Testing ads.txt accessibility..."
echo "Domain: $DOMAIN"
echo "Expected content: $EXPECTED_CONTENT"
echo ""

# Test 1: Check if ads.txt is accessible
echo "🧪 Test 1: Checking ads.txt accessibility..."
if command -v curl &> /dev/null; then
    RESPONSE=$(curl -s "https://$DOMAIN/ads.txt")
    if [ $? -eq 0 ]; then
        echo "✅ ads.txt is accessible via HTTPS"
        echo "📄 Content received:"
        echo "$RESPONSE"
        echo ""
        
        # Test 2: Verify content matches expected
        echo "🧪 Test 2: Verifying content..."
        if [ "$RESPONSE" = "$EXPECTED_CONTENT" ]; then
            echo "✅ Content matches expected format"
        else
            echo "❌ Content does not match expected format"
            echo "Expected: $EXPECTED_CONTENT"
            echo "Received: $RESPONSE"
        fi
    else
        echo "❌ ads.txt is not accessible via HTTPS"
        echo "Error: $RESPONSE"
    fi
else
    echo "⚠️  curl not available. Please install curl or manually test:"
    echo "   Visit: https://$DOMAIN/ads.txt in your browser"
fi

echo ""
echo "🧪 Test 3: Checking HTTP status code..."
if command -v curl &> /dev/null; then
    STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/ads.txt")
    if [ "$STATUS_CODE" = "200" ]; then
        echo "✅ HTTP status code: $STATUS_CODE (OK)"
    else
        echo "❌ HTTP status code: $STATUS_CODE (Expected: 200)"
    fi
fi

echo ""
echo "🧪 Test 4: Checking content type..."
if command -v curl &> /dev/null; then
    CONTENT_TYPE=$(curl -s -I "https://$DOMAIN/ads.txt" | grep -i "content-type" | head -1)
    echo "📄 Content-Type: $CONTENT_TYPE"
    if echo "$CONTENT_TYPE" | grep -q "text/plain"; then
        echo "✅ Content-Type is text/plain (correct)"
    else
        echo "⚠️  Content-Type may not be text/plain"
    fi
fi

echo ""
echo "📋 Manual Verification Steps:"
echo "1. Visit https://$DOMAIN/ads.txt in your browser"
echo "2. You should see: $EXPECTED_CONTENT"
echo "3. Check Google AdSense console for 'Ads.txt Not Found' warning"
echo "4. The warning should disappear within 24-48 hours"
echo ""
echo "🔗 Google AdSense Console: https://www.google.com/adsense"
echo "📚 AdSense Help: https://support.google.com/adsense/answer/7679688"
