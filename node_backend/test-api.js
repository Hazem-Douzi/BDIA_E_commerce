const http = require('http');

// Test script to verify API endpoints
const testEndpoints = [
  { path: '/health', description: 'Health Check' },
  { path: '/api/categories', description: 'Categories' },
  { path: '/api/products/featured', description: 'Featured Products' },
  { path: '/api/products/new-arrivals', description: 'New Arrivals' }
];

function testEndpoint(path, description) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            path,
            description,
            status: res.statusCode,
            success: jsonData.success,
            count: jsonData.data ? jsonData.data.length : 0
          });
        } catch (e) {
          resolve({
            path,
            description,
            status: res.statusCode,
            error: 'Invalid JSON response'
          });
        }
      });
    });

    req.on('error', (err) => {
      resolve({
        path,
        description,
        status: 'ERROR',
        error: err.message
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        path,
        description,
        status: 'TIMEOUT',
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing ShopEase API Endpoints...\n');

  for (const endpoint of testEndpoints) {
    const result = await testEndpoint(endpoint.path, endpoint.description);

    if (result.status === 200 && result.success) {
      console.log(`✅ ${result.description}: ${result.count} items`);
    } else if (result.status === 'ERROR' || result.status === 'TIMEOUT') {
      console.log(`❌ ${result.description}: ${result.error}`);
    } else {
      console.log(`⚠️  ${result.description}: Status ${result.status}`);
    }
  }

  console.log('\n📋 API Endpoints Summary:');
  console.log('🌐 Base URL: http://localhost:5000');
  console.log('📊 Health Check: GET /health');
  console.log('🏷️  Categories: GET /api/categories');
  console.log('⭐ Featured Products: GET /api/products/featured');
  console.log('🆕 New Arrivals: GET /api/products/new-arrivals');
  console.log('📦 All Products: GET /api/products?page=1&limit=10');
  console.log('🔍 Product by ID: GET /api/products/{id}');
  console.log('📂 Products by Category: GET /api/products/category/{categoryId}');
}

runTests();