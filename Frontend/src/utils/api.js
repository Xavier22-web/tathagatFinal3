// API utility functions with error handling

// Detect if we're running on localhost or in production
const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
   window.location.hostname === '127.0.0.1' ||
   window.location.hostname === '0.0.0.0');

// Configure API base URL based on environment
const API_BASE_URL = process.env.REACT_APP_API_URL ||
  (isLocalhost ? 'http://localhost:5000' : '');

// Log the configuration for debugging
console.log('API Configuration:', {
  NODE_ENV: process.env.NODE_ENV,
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  href: typeof window !== 'undefined' ? window.location.href : 'server',
  isLocalhost,
  API_BASE_URL,
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  finalApiUrl: `${API_BASE_URL}/api/courses/student/published-courses`
});

// Development mock data
const MOCK_DATA = {
  courses: {
    success: true,
    courses: [
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'CAT 2026',
        description: 'Complete preparation package for CAT 2026',
        published: true,
        price: 9999,
        duration: '12 months'
      },
      {
        _id: '507f1f77bcf86cd799439012',
        name: 'IPMAT 2027',
        description: 'Integrated Program in Management Aptitude Test preparation',
        published: true,
        price: 7999,
        duration: '10 months'
      }
    ]
  },
  mockTests: {
    success: true,
    series: [
      {
        _id: '507f1f77bcf86cd799439013',
        title: 'CAT Mock Test Series 2024',
        description: 'Complete mock test series for CAT preparation',
        category: 'CAT',
        totalTests: 10,
        difficulty: 'Mixed',
        published: true,
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        _id: '507f1f77bcf86cd799439014',
        title: 'IPMAT Mock Test Series 2024',
        description: 'Comprehensive IPMAT preparation test series',
        category: 'IPMAT',
        totalTests: 8,
        difficulty: 'Intermediate',
        published: true,
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    ],
    data: [
      {
        _id: '507f1f77bcf86cd799439013',
        title: 'CAT Mock Test 1',
        description: 'Complete mock test for CAT preparation',
        duration: 180,
        totalQuestions: 100
      }
    ]
  },
  devLogin: {
    success: true,
    token: 'dev_token_12345',
    user: {
      id: '507f1f77bcf86cd799439011',
      email: 'dev@test.com',
      name: 'Development User',
      role: 'student'
    }
  }
};

// Generic fetch wrapper with error handling and development fallback
export const fetchWithErrorHandling = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for faster development

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Try to parse JSON first, then handle errors
    let responseData;
    try {
      responseData = await response.json();
    } catch (parseError) {
      // If JSON parsing fails, create a basic error response
      responseData = {
        success: false,
        message: `HTTP ${response.status}: ${response.statusText}`
      };
    }

    if (!response.ok) {
      // Now we can safely access the response data without re-reading the stream
      const errorMessage = responseData.message || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    // Check if response data is valid
    if (!responseData || (typeof responseData === 'object' && Object.keys(responseData).length === 0)) {
      throw new Error(`HTTP ${response.status}: Empty response`);
    }

    return responseData;
  } catch (error) {
    clearTimeout(timeoutId);

    // In development, if backend is not available or returns errors, return mock data
    if (process.env.NODE_ENV === 'development' &&
        (error.name === 'AbortError' ||
         error instanceof TypeError ||
         error.message.includes('fetch') ||
         error.message.includes('HTTP 404') ||
         error.message.includes('HTTP 500') ||
         error.message.includes('Empty response'))) {

      console.warn('🔄 Backend unavailable, using mock data for:', url);

      // Return appropriate mock data based on URL
      if (url.includes('/api/courses/student/published-courses')) {
        return MOCK_DATA.courses;
      } else if (url.includes('/api/mock-tests/series')) {
        console.log('🔄 Returning mock data for mock test series');
        return MOCK_DATA.mockTests;
      } else if (url.includes('/api/admin/mock-tests/series') || url.includes('/api/admin/mock-tests/questions') || url.includes('/api/admin/mock-tests/tests')) {
        console.log('🔄 Returning mock data for admin mock test endpoints:', url);

        // Handle different admin endpoints
        if (url.includes('/series')) {
          return {
            success: true,
            series: [
              {
                _id: '1',
                title: 'CAT 2024 Foundation Series',
                description: 'Complete foundation course with 12 progressive mock tests for CAT aspirants',
                category: 'CAT',
                isPublished: true,
                actualTestCount: 12,
                enrolledCount: 1245,
                validity: 365,
                price: 3999,
                tags: ['CAT', 'Foundation', '2024', 'Beginner'],
                freeTests: 2,
                createdAt: '2024-01-15T00:00:00.000Z'
              },
              {
                _id: '2',
                title: 'CAT 2024 Advanced Series',
                description: 'Advanced level preparation with 15 challenging mock tests designed by IIM alumni',
                category: 'CAT',
                isPublished: true,
                actualTestCount: 15,
                enrolledCount: 856,
                validity: 365,
                price: 4999,
                tags: ['CAT', 'Advanced', '2024', 'IIM Level'],
                freeTests: 1,
                createdAt: '2024-02-01T00:00:00.000Z'
              },
              {
                _id: '3',
                title: 'IPMAT 2024 Complete Series',
                description: 'Comprehensive IPMAT preparation with 10 full-length tests covering all sections',
                category: 'IPMAT',
                isPublished: true,
                actualTestCount: 10,
                enrolledCount: 432,
                validity: 180,
                price: 2499,
                tags: ['IPMAT', 'Complete', '2024', 'IIM Indore'],
                freeTests: 2,
                createdAt: '2024-01-20T00:00:00.000Z'
              },
              {
                _id: '4',
                title: 'XAT 2024 Mastery Series',
                description: 'Specialized XAT preparation with 12 tests focusing on Decision Making and Essay Writing',
                category: 'XAT',
                isPublished: true,
                actualTestCount: 12,
                enrolledCount: 289,
                validity: 270,
                price: 3499,
                tags: ['XAT', 'Mastery', '2024', 'XLRI'],
                freeTests: 1,
                createdAt: '2024-02-10T00:00:00.000Z'
              },
              {
                _id: '5',
                title: 'SNAP 2024 Success Series',
                description: 'Quick and effective SNAP preparation with 10 targeted tests for top B-schools',
                category: 'SNAP',
                isPublished: false,
                actualTestCount: 10,
                enrolledCount: 156,
                validity: 150,
                price: 1999,
                tags: ['SNAP', 'Success', '2024', 'Symbiosis'],
                freeTests: 3,
                createdAt: '2024-02-15T00:00:00.000Z'
              }
            ]
          };
        } else if (url.includes('/tests')) {
          // Generate tests based on series filter
          const seriesId = new URLSearchParams(url.split('?')[1] || '').get('seriesId');

          const allTests = [];

          // CAT Foundation Series (12 tests)
          for (let i = 1; i <= 12; i++) {
            allTests.push({
              _id: `cat_foundation_${i}`,
              title: `CAT Foundation Test ${i}`,
              description: `Progressive difficulty test ${i} covering all CAT sections with detailed explanations`,
              seriesId: '1',
              duration: 180,
              totalQuestions: 100,
              difficulty: i <= 4 ? 'Easy' : i <= 8 ? 'Medium' : 'Hard',
              isActive: true,
              attemptCount: Math.floor(Math.random() * 500) + 100,
              positiveMarks: 3,
              negativeMarks: -1,
              instructions: `This is test ${i} of the CAT Foundation Series. Focus on accuracy over speed.`,
              sections: [
                { name: 'VARC', questions: 34, duration: 60 },
                { name: 'DILR', questions: 32, duration: 60 },
                { name: 'QA', questions: 34, duration: 60 }
              ],
              createdAt: `2024-01-${15 + i}T00:00:00.000Z`
            });
          }

          // CAT Advanced Series (15 tests)
          for (let i = 1; i <= 15; i++) {
            allTests.push({
              _id: `cat_advanced_${i}`,
              title: `CAT Advanced Test ${i}`,
              description: `High-difficulty test ${i} simulating actual CAT exam conditions`,
              seriesId: '2',
              duration: 180,
              totalQuestions: 100,
              difficulty: i <= 5 ? 'Medium' : 'Hard',
              isActive: true,
              attemptCount: Math.floor(Math.random() * 300) + 50,
              positiveMarks: 3,
              negativeMarks: -1,
              instructions: `Advanced test ${i} with IIM-level questions. Time management is crucial.`,
              sections: [
                { name: 'VARC', questions: 34, duration: 60 },
                { name: 'DILR', questions: 32, duration: 60 },
                { name: 'QA', questions: 34, duration: 60 }
              ],
              createdAt: `2024-02-${i}T00:00:00.000Z`
            });
          }

          // IPMAT Complete Series (10 tests)
          for (let i = 1; i <= 10; i++) {
            allTests.push({
              _id: `ipmat_complete_${i}`,
              title: `IPMAT Complete Test ${i}`,
              description: `Comprehensive IPMAT test ${i} covering Quantitative Ability and Verbal Ability`,
              seriesId: '3',
              duration: 120,
              totalQuestions: 90,
              difficulty: i <= 3 ? 'Easy' : i <= 7 ? 'Medium' : 'Hard',
              isActive: true,
              attemptCount: Math.floor(Math.random() * 200) + 30,
              positiveMarks: 4,
              negativeMarks: -1,
              instructions: `IPMAT test ${i} - Focus on both quantitative and verbal sections equally.`,
              sections: [
                { name: 'Quantitative Ability', questions: 45, duration: 60 },
                { name: 'Verbal Ability', questions: 45, duration: 60 }
              ],
              createdAt: `2024-01-${20 + i}T00:00:00.000Z`
            });
          }

          // XAT Mastery Series (12 tests)
          for (let i = 1; i <= 12; i++) {
            allTests.push({
              _id: `xat_mastery_${i}`,
              title: `XAT Mastery Test ${i}`,
              description: `XAT focused test ${i} with emphasis on Decision Making and Essay Writing`,
              seriesId: '4',
              duration: 210,
              totalQuestions: 100,
              difficulty: i <= 4 ? 'Medium' : 'Hard',
              isActive: true,
              attemptCount: Math.floor(Math.random() * 150) + 20,
              positiveMarks: 3,
              negativeMarks: -0.25,
              instructions: `XAT test ${i} - Pay special attention to Decision Making section.`,
              sections: [
                { name: 'Verbal Ability', questions: 26, duration: 65 },
                { name: 'Decision Making', questions: 21, duration: 65 },
                { name: 'Quantitative Ability', questions: 28, duration: 65 },
                { name: 'General Knowledge', questions: 25, duration: 15 }
              ],
              createdAt: `2024-02-${10 + i}T00:00:00.000Z`
            });
          }

          // SNAP Success Series (10 tests)
          for (let i = 1; i <= 10; i++) {
            allTests.push({
              _id: `snap_success_${i}`,
              title: `SNAP Success Test ${i}`,
              description: `SNAP preparation test ${i} covering all four sections with time-efficient strategies`,
              seriesId: '5',
              duration: 60,
              totalQuestions: 60,
              difficulty: i <= 3 ? 'Easy' : i <= 6 ? 'Medium' : 'Hard',
              isActive: true,
              attemptCount: Math.floor(Math.random() * 100) + 10,
              positiveMarks: 3,
              negativeMarks: -0.75,
              instructions: `SNAP test ${i} - Quick and accurate answering is key to success.`,
              sections: [
                { name: 'General English', questions: 15, duration: 15 },
                { name: 'Quantitative Ability', questions: 15, duration: 15 },
                { name: 'Analytical & Logical Reasoning', questions: 15, duration: 15 },
                { name: 'General Awareness', questions: 15, duration: 15 }
              ],
              createdAt: `2024-02-${15 + i}T00:00:00.000Z`
            });
          }

          // Filter tests by series if seriesId is provided
          let filteredTests = allTests;
          if (seriesId && seriesId !== 'all') {
            filteredTests = allTests.filter(test => test.seriesId === seriesId);
          }

          return {
            success: true,
            tests: filteredTests,
            total: filteredTests.length
          };
        } else if (url.includes('/questions')) {
          return {
            success: true,
            questions: [
              {
                _id: '1',
                questionText: 'Read the following passage and answer the question that follows. The rapid advancement of artificial intelligence...',
                section: 'VARC',
                questionType: 'Multiple Choice',
                difficulty: 'Medium',
                topic: 'Reading Comprehension',
                marks: { positive: 3, negative: -1 },
                options: ['Option A', 'Option B', 'Option C', 'Option D']
              },
              {
                _id: '2',
                questionText: 'A company manufactures two types of products A and B. The profit from product A is 40% and from product B is 60%...',
                section: 'QA',
                questionType: 'Multiple Choice',
                difficulty: 'Hard',
                topic: 'Profit and Loss',
                marks: { positive: 3, negative: -1 },
                options: ['150', '200', '250', '300']
              }
            ]
          };
        }
      } else if (url.includes('/api/dev/login')) {
        return MOCK_DATA.devLogin;
      } else if (url.includes('/api/health')) {
        return { status: 'ok', message: 'Mock health check' };
      }

      // Handle CRUD operations for admin endpoints
      if (options.method === 'POST' && url.includes('/api/admin/mock-tests/')) {
        console.log('🔄 Mock POST operation for:', url);
        return {
          success: true,
          message: 'Created successfully (demo mode)',
          data: { _id: Date.now().toString() }
        };
      } else if (options.method === 'PUT' && url.includes('/api/admin/mock-tests/')) {
        console.log('🔄 Mock PUT operation for:', url);
        return {
          success: true,
          message: 'Updated successfully (demo mode)'
        };
      } else if (options.method === 'DELETE' && url.includes('/api/admin/mock-tests/')) {
        console.log('🔄 Mock DELETE operation for:', url);
        return {
          success: true,
          message: 'Deleted successfully (demo mode)'
        };
      }

      // Default mock response
      return {
        success: true,
        message: 'Mock response - backend unavailable',
        data: []
      };
    }

    if (error.name === 'AbortError') {
      throw new Error('Request timeout - backend server may be unavailable');
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend server. Please check if the server is running.');
    }

    throw error;
  }
};

// Check if backend is available
export const checkBackendHealth = async () => {
  try {
    await fetchWithErrorHandling(`${API_BASE_URL}/api/health`);
    return true;
  } catch (error) {
    console.warn('Backend health check failed:', error.message);
    return false;
  }
};

// API endpoints
export const API_ENDPOINTS = {
  AUTO_LOGIN: `${API_BASE_URL}/api/v1/auto-login`,
  PUBLISHED_COURSES: `${API_BASE_URL}/api/courses/student/published-courses`,
  MY_COURSES: `${API_BASE_URL}/api/user/student/my-courses`,
  IIM_PREDICTOR: (userId) => `${API_BASE_URL}/api/v2/iim-predictor/${userId}`,
};

// Helper function to retry API calls
const retryApiCall = async (apiCall, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      console.log(`API call attempt ${attempt} failed:`, error.message);

      if (attempt === maxRetries) {
        throw error;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};

// Course API functions
export const fetchPublishedCourses = async () => {
  const apiCall = async () => {
    console.log('Fetching courses from:', API_ENDPOINTS.PUBLISHED_COURSES);
    const data = await fetchWithErrorHandling(API_ENDPOINTS.PUBLISHED_COURSES);
    console.log('Courses fetched successfully:', data);
    return data;
  };

  try {
    // In production (non-localhost), retry API calls as backend might be starting up
    if (!isLocalhost) {
      return await retryApiCall(apiCall, 3, 2000);
    } else {
      return await apiCall();
    }
  } catch (error) {
    console.error('Error fetching published courses:', error);
    console.error('API_BASE_URL:', API_BASE_URL);
    console.error('NODE_ENV:', process.env.NODE_ENV);
    throw error;
  }
};

export const fetchMyCourses = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    const data = await fetchWithErrorHandling(API_ENDPOINTS.MY_COURSES, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    return data;
  } catch (error) {
    console.error('Error fetching my courses:', error);
    throw error;
  }
};

// Mock Test API functions
export const startMockTest = async (testId) => {
  try {
    const authToken = localStorage.getItem('authToken');
    console.log('🚀 Starting mock test with token:', authToken ? 'Present' : 'Missing');

    if (!authToken) {
      throw new Error('Authentication required. Please log in to start the test.');
    }

    console.log('Making API call to:', `${API_BASE_URL}/api/mock-tests/test/${testId}/start`);

    const data = await fetchWithErrorHandling(`${API_BASE_URL}/api/mock-tests/test/${testId}/start`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    console.log('✅ Mock test started successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Error starting mock test:', error);
    throw error;
  }
};

export const devLogin = async () => {
  try {
    const data = await fetchWithErrorHandling(`${API_BASE_URL}/api/dev/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (data.success && data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Development user logged in successfully');
    }

    return data;
  } catch (error) {
    console.error('Error with dev login:', error);
    throw error;
  }
};

// Safe fetch wrapper that prevents body stream errors
export const safeFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);

    let data;
    let parseSuccess = false;

    try {
      data = await response.json();
      parseSuccess = true;
    } catch (parseError) {
      console.warn('Failed to parse response as JSON:', parseError);
      data = {
        success: false,
        message: `Server returned ${response.status}: ${response.statusText}`
      };
    }

    return {
      response,
      data,
      parseSuccess,
      ok: response.ok,
      status: response.status,
      statusText: response.statusText
    };
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
