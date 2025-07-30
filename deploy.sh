#!/bin/bash

# 🚀 DayFlow Deployment Script
# This script helps you deploy DayFlow to free hosting platforms

echo "🌊 DayFlow Deployment Script"
echo "=============================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: DayFlow app"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "🎉 DayFlow is ready for deployment!"
echo ""
echo "📋 Next Steps:"
echo "==============="
echo ""
echo "1. 🌐 Deploy to Vercel (Recommended):"
echo "   - Go to https://vercel.com"
echo "   - Sign up with GitHub"
echo "   - Click 'New Project'"
echo "   - Import your GitHub repository"
echo "   - Your app will be live at: https://dayflow-app.vercel.app"
echo ""
echo "2. 🌐 Deploy to Netlify:"
echo "   - Go to https://netlify.com"
echo "   - Sign up with GitHub"
echo "   - Click 'New site from Git'"
echo "   - Connect your repository"
echo "   - Set build command: npm run build"
echo "   - Set publish directory: .next"
echo ""
echo "3. 🌐 Get Free Domain:"
echo "   - Go to https://freenom.com"
echo "   - Search for available domains (.tk, .ml, .ga)"
echo "   - Register a free domain"
echo "   - Connect it to your hosting provider"
echo ""
echo "4. 📊 Add Analytics (Optional):"
echo "   - Google Analytics: https://analytics.google.com"
echo "   - Vercel Analytics: Enable in Vercel dashboard"
echo ""
echo "💰 Total Cost: $0/month"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🎯 Your DayFlow app is ready for the world!" 