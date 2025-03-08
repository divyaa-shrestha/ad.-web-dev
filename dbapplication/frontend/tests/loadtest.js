import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10, // Simulate 10 users
  duration: '30s', // Run the test for 30 seconds
};

export default function () {
  // Send a GET request to the app's URL
  const response = http.get('http://localhost:3000');

  // Check if the response status is 200
  check(response, {
    'status is 200': (r) => r.status === 200,
  });

  // Simulate user think time
  sleep(1);
}