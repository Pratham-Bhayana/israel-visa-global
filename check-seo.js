#!/usr/bin/env node

/**
 * SEO Validation Script
 * Checks for common SEO issues in the React application
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
};

let totalIssues = 0;
let totalWarnings = 0;
let totalPassed = 0;

// File paths
const indexHtml = path.join(__dirname, 'frontend', 'public', 'index.html');
const sitemapXml = path.join(__dirname, 'frontend', 'public', 'sitemap.xml');
const robotsTxt = path.join(__dirname, 'frontend', 'public', 'robots.txt');
const pagesDir = path.join(__dirname, 'frontend', 'src', 'pages');

console.log('\n🔍 SEO Validation Report\n');
console.log('='.repeat(50));

// Check 1: index.html meta tags
console.log('\n📄 Checking index.html...');
if (fs.existsSync(indexHtml)) {
  const content = fs.readFileSync(indexHtml, 'utf8');
  
  // Check for essential meta tags
  if (content.includes('<meta name="description"')) {
    log.success('Meta description found');
    totalPassed++;
  } else {
    log.error('Meta description missing');
    totalIssues++;
  }
  
  if (content.includes('rel="canonical"')) {
    log.success('Canonical link found');
    totalPassed++;
  } else {
    log.error('Canonical link missing');
    totalIssues++;
  }
  
  if (content.includes('property="og:')) {
    log.success('Open Graph tags found');
    totalPassed++;
  } else {
    log.error('Open Graph tags missing');
    totalIssues++;
  }
  
  if (content.includes('name="twitter:card"')) {
    log.success('Twitter Card tags found');
    totalPassed++;
  } else {
    log.error('Twitter Card tags missing');
    totalIssues++;
  }
  
  if (content.includes('application/ld+json')) {
    log.success('Schema.org structured data found');
    totalPassed++;
  } else {
    log.error('Schema.org structured data missing');
    totalIssues++;
  }
  
  // Check for placeholder URLs
  if (content.includes('yourdomain.com')) {
    log.warning('Placeholder "yourdomain.com" found - needs replacement');
    totalWarnings++;
  } else {
    log.success('No placeholder URLs found');
    totalPassed++;
  }
} else {
  log.error('index.html not found');
  totalIssues++;
}

// Check 2: sitemap.xml
console.log('\n🗺️  Checking sitemap.xml...');
if (fs.existsSync(sitemapXml)) {
  log.success('sitemap.xml exists');
  totalPassed++;
  
  const content = fs.readFileSync(sitemapXml, 'utf8');
  if (content.includes('<urlset')) {
    log.success('Valid sitemap format');
    totalPassed++;
  } else {
    log.error('Invalid sitemap format');
    totalIssues++;
  }
} else {
  log.error('sitemap.xml not found');
  totalIssues++;
}

// Check 3: robots.txt
console.log('\n🤖 Checking robots.txt...');
if (fs.existsSync(robotsTxt)) {
  log.success('robots.txt exists');
  totalPassed++;
  
  const content = fs.readFileSync(robotsTxt, 'utf8');
  if (content.includes('User-agent:')) {
    log.success('Valid robots.txt format');
    totalPassed++;
  } else {
    log.error('Invalid robots.txt format');
    totalIssues++;
  }
  
  if (content.includes('Sitemap:')) {
    log.success('Sitemap reference found in robots.txt');
    totalPassed++;
  } else {
    log.warning('Sitemap reference missing in robots.txt');
    totalWarnings++;
  }
} else {
  log.error('robots.txt not found');
  totalIssues++;
}

// Check 4: React pages
console.log('\n📑 Checking React pages...');
if (fs.existsSync(pagesDir)) {
  const pages = fs.readdirSync(pagesDir).filter(file => file.endsWith('.js'));
  
  log.info(`Found ${pages.length} page files`);
  
  let pagesWithHelmet = 0;
  let pagesWithH1 = 0;
  
  pages.forEach(page => {
    if (page.includes('.backup') || page.includes('_new')) return;
    
    const content = fs.readFileSync(path.join(pagesDir, page), 'utf8');
    
    if (content.includes('from \'react-helmet-async\'') || content.includes('from "react-helmet-async"')) {
      pagesWithHelmet++;
    }
    
    if (content.includes('<h1') || content.includes('<H1')) {
      pagesWithH1++;
    }
  });
  
  const validPages = pages.filter(p => !p.includes('.backup') && !p.includes('_new')).length;
  
  if (pagesWithHelmet === validPages) {
    log.success(`All ${validPages} pages use React Helmet`);
    totalPassed++;
  } else {
    log.warning(`Only ${pagesWithHelmet}/${validPages} pages use React Helmet`);
    totalWarnings++;
  }
  
  if (pagesWithH1 >= validPages * 0.8) {
    log.success(`${pagesWithH1}/${validPages} pages have H1 tags`);
    totalPassed++;
  } else {
    log.error(`Only ${pagesWithH1}/${validPages} pages have H1 tags`);
    totalIssues++;
  }
} else {
  log.error('Pages directory not found');
  totalIssues++;
}

// Check 5: Environment variables
console.log('\n🔐 Checking environment configuration...');
const envExample = path.join(__dirname, 'frontend', '.env.example');
const env = path.join(__dirname, 'frontend', '.env');

if (fs.existsSync(env)) {
  const content = fs.readFileSync(env, 'utf8');
  
  if (content.includes('REACT_APP_SITE_URL')) {
    log.success('REACT_APP_SITE_URL configured');
    totalPassed++;
    
    if (content.includes('yourdomain.com')) {
      log.warning('REACT_APP_SITE_URL uses placeholder - needs actual domain');
      totalWarnings++;
    }
  } else {
    log.warning('REACT_APP_SITE_URL not set');
    totalWarnings++;
  }
} else {
  log.warning('.env file not found - using defaults');
  totalWarnings++;
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 Summary:\n');
console.log(`${colors.green}✓ Passed:${colors.reset} ${totalPassed}`);
console.log(`${colors.yellow}⚠ Warnings:${colors.reset} ${totalWarnings}`);
console.log(`${colors.red}✗ Issues:${colors.reset} ${totalIssues}`);

if (totalIssues === 0 && totalWarnings === 0) {
  console.log(`\n${colors.green}🎉 Perfect! All SEO checks passed!${colors.reset}\n`);
} else if (totalIssues === 0) {
  console.log(`\n${colors.yellow}⚠️  SEO implementation is good, but address warnings before production.${colors.reset}\n`);
} else {
  console.log(`\n${colors.red}❌ Critical SEO issues found. Please fix before deployment.${colors.reset}\n`);
}

// Action items
if (totalWarnings > 0 || totalIssues > 0) {
  console.log('📝 Action Items:\n');
  
  if (totalWarnings > 0) {
    console.log('1. Replace placeholder "yourdomain.com" with actual domain');
    console.log('2. Set REACT_APP_SITE_URL in .env file');
    console.log('3. Update Twitter handle if changed from @IsraelVisaApp');
  }
  
  if (totalIssues > 0) {
    console.log('4. Fix missing meta tags in index.html');
    console.log('5. Ensure all pages have H1 tags');
    console.log('6. Add Helmet to pages missing SEO tags');
  }
  
  console.log('\nFor detailed instructions, see: SEO_IMPLEMENTATION_GUIDE.md\n');
}

console.log('='.repeat(50) + '\n');

process.exit(totalIssues > 0 ? 1 : 0);
