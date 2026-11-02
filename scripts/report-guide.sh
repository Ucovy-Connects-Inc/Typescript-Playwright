#!/bin/bash

# GitHub Actions Test Report Checker
# This script helps you understand where to find your test reports

echo "🎭 PLAYWRIGHT TEST REPORTS GUIDE"
echo "=================================="
echo ""

echo "📍 WHERE TO FIND YOUR REPORTS AFTER GITHUB ACTIONS RUNS:"
echo ""

echo "1. 📊 MAIN REPORTS (Download from GitHub):"
echo "   ├─ Go to: GitHub.com → Your Repo → Actions → Your workflow run"
echo "   ├─ Scroll down to 'Artifacts' section"
echo "   ├─ Download: '📊-MANAGEMENT-REPORT-[environment]-[browser]'"
echo "   └─ Extract ZIP and open:"
echo "      ├─ allure-report/index.html (Beautiful dashboard)"
echo "      ├─ playwright-report/index.html (Detailed results)"
echo "      └─ EXECUTIVE_SUMMARY.md (Management summary)"
echo ""

echo "2. 🔍 QUICK STATUS CHECK:"
echo "   ├─ Go to: GitHub.com → Your Repo → Actions"
echo "   ├─ Click on your latest workflow run"
echo "   └─ Check if all steps have ✅ (green checkmarks)"
echo ""

echo "3. 🐛 IF TESTS FAILED:"
echo "   ├─ Download the report artifact anyway"
echo "   ├─ Check test-results/ folder for:"
echo "   │  ├─ Screenshots of failures"
echo "   │  ├─ Videos of test runs"
echo "   │  └─ Trace files for debugging"
echo "   └─ Open playwright-report/index.html for detailed failure analysis"
echo ""

echo "4. 🌐 SHARE WITH MANAGEMENT:"
echo "   ├─ Send them the EXECUTIVE_SUMMARY.md file"
echo "   ├─ Or extract the ZIP and show allure-report/index.html"
echo "   └─ Beautiful charts and pass/fail percentages included!"
echo ""

echo "🚀 NEXT STEPS:"
echo "   1. Push your latest changes to GitHub"
echo "   2. Go to Actions tab → Run workflow"
echo "   3. Select environment (qa/dev/prod) and browser"
echo "   4. Wait for completion and download artifacts"