// Script to update all API URLs in frontend files
// Run with: node update-api-urls.js

const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'client', 'src', 'pages');

const filesToUpdate = [
  'Signup.jsx',
  'Dashboard.jsx',
  'Shop.jsx',
  'ProductDetail.jsx',
  'AddProduct.jsx',
  'EditProduct.jsx',
  'MyProducts.jsx',
  'Cart.jsx',
  'Checkout.jsx',
  'Payment.jsx',
  'Orders.jsx',
  'OrderDetail.jsx',
  'SellerProfile.jsx'
];

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if API_URL import already exists
    if (!content.includes('import API_URL from')) {
      // Find the last import statement
      const importRegex = /import .+ from .+;/g;
      const imports = content.match(importRegex);
      
      if (imports && imports.length > 0) {
        const lastImport = imports[imports.length - 1];
        content = content.replace(
          lastImport,
          lastImport + '\nimport API_URL from "../config/api";'
        );
      }
    }
    
    // Replace all hardcoded URLs
    content = content.replace(
      /"http:\/\/localhost:6969/g,
      '`${API_URL}'
    );
    
    // Fix the closing quotes
    content = content.replace(
      /`\$\{API_URL\}\/api\/([^`"]+)"/g,
      '`${API_URL}/api/$1`'
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`❌ Error updating ${path.basename(filePath)}:`, error.message);
  }
}

console.log('🚀 Starting API URL updates...\n');

filesToUpdate.forEach(file => {
  const filePath = path.join(pagesDir, file);
  if (fs.existsSync(filePath)) {
    updateFile(filePath);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log('\n✨ Done! Please review the changes before committing.');
console.log('\n📝 Next steps:');
console.log('1. Update client/.env with your Render backend URL');
console.log('2. Test locally to ensure everything works');
console.log('3. Deploy to Render');
