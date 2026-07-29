// import http from 'k6/http';
// import { check, sleep } from 'k6';
// import { Rate, Trend } from 'k6/metrics';

// const errorRate = new Rate('errors');
// const responseTimeTrend = new Trend('response_time');

// export const options = {
//   stages: [
//     { duration: '30s', target: 20 },
//     { duration: '1m', target: 20 },
//     { duration: '30s', target: 50 },
//     { duration: '1m', target: 50 },
//     { duration: '30s', target: 0 },
//   ],
//   thresholds: {
//     http_req_duration: ['p(95)<2000'],
//     errors: ['rate<0.05'],
//   },
// };

// const BASE_URL = 'https://www.automationexercise.com';

// const browserHeaders = {
//   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
//   'Accept': 'application/json, text/plain, */*',
//   'Accept-Language': 'en-US,en;q=0.9',
// };

// export default function () {
//   const res = http.get(`${BASE_URL}/api/productsList`, { headers: browserHeaders });

//   if (__ITER === 0 && __VU === 1) {
//     console.log(`Status: ${res.status}`);
//     console.log(`Content-Type: ${res.headers['Content-Type']}`);
//     console.log(`Body (first 300 chars): ${res.body.substring(0, 300)}`);
//   }

//   const success = check(res, {
//     'status is 200': (r) => r.status === 200,
//     'response has products': (r) => {
//       try {
//         const body = JSON.parse(r.body);
//         return Array.isArray(body.products) && body.products.length > 0;
//       } catch {
//         return false;
//       }
//     },
//   });

//   errorRate.add(!success);
//   responseTimeTrend.add(res.timings.duration);

//   sleep(1);
// }

//RUN USING MOCK SERVER LOCALLY
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const responseTimeTrend = new Trend('response_time');

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 50 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    errors: ['rate<0.05'],
  },
};

// const BASE_URL = 'http://localhost:4000';
const BASE_URL = __ENV.MOCK_API_URL || 'http://localhost:4000';

export default function () {
  const res = http.get(`${BASE_URL}/api/productsList`);

  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'response has products': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body.products) && body.products.length > 0;
      } catch {
        return false;
      }
    },
  });

  errorRate.add(!success);
  responseTimeTrend.add(res.timings.duration);
  sleep(1);
}