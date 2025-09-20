#!/bin/bash

echo "🚀 Downloading all 25 pages from Raw Essex..."

# Create directory for HTML files
mkdir -p /tmp/raw-essex-pages

# Download all 25 pages
for page in {1..25}; do
    echo "📄 Downloading page $page..."
    curl -s "https://www.rawessex.co.uk/collections/all?page=$page" > "/tmp/raw-essex-pages/page-$page.html"
    sleep 1  # Be respectful to the server
done

echo "✅ Downloaded all 25 pages to /tmp/raw-essex-pages/"