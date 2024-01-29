import http from 'k6/http';
import { check } from 'k6';

export const options = {
    vus: 100,
    duration: '20s'
};

export default function () {
    const result = http.get('https://omcs-ssp2-pre-dev.opc.oracleoutsourcing.com/user-microservice/health');
    check(result, {
    'http response status code is 200': result.status === 200,
    });
}
