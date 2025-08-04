// Quick test script to verify APIs are working
const testAPIs = async () => {
  try {
    console.log('🧪 Testing APIs...\n');

    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health:', healthData.message);

    // Test 2: Study materials without auth
    console.log('\n2. Testing study materials (no auth)...');
    const materialsResponse = await fetch('http://localhost:5000/api/study-materials/student');
    const materialsData = await materialsResponse.json();
    
    if (materialsData.success) {
      console.log(`✅ Study materials: ${materialsData.data.length} materials found`);
      
      // Show first few materials
      materialsData.data.slice(0, 3).forEach((material, index) => {
        console.log(`   ${index + 1}. ${material.title} (${material.subject} - ${material.type})`);
      });
    } else {
      console.log('❌ Study materials failed:', materialsData.message);
    }

    // Test 3: Courses
    console.log('\n3. Testing courses endpoint...');
    const coursesResponse = await fetch('http://localhost:5000/api/courses/student/published-courses');
    const coursesData = await coursesResponse.json();
    
    if (coursesData.success) {
      console.log(`✅ Courses: ${coursesData.courses.length} courses found`);
    } else {
      console.log('❌ Courses failed:', coursesData.message);
    }

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// For Node.js environment
if (typeof fetch === 'undefined') {
  console.log('Note: Run this in a browser console or install node-fetch for Node.js');
} else {
  testAPIs();
}
