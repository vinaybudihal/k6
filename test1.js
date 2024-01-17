import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 1000,
  duration: '120s'
};

export default function () {
  const result = http.get('https://test-api.k6.io/public/crocodiles/');
  check(result, {
    'http response status code is 200': result.status === 200,
  });
}
