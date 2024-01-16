import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 100,
  duration: '20s'
};

export default function () {
  const result = http.get('https://test-api.k6.io/public/crocodiles/');
  check(result, {
    'http response status code is 200': result.status === 200,
  });
}
