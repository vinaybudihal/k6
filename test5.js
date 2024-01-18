import http from 'k6/http';
import { check, sleep } from 'k6';

const testConfig = JSON.parse(open('./config.json'));

const discoverIssuer = async (issuerUrl) => {
    const url = issuerUrl + '/.well-known/openid-configuration';
    return http.get(url).json();
};

export const options = {
  vus: 10000,
  duration: '240s'
};
const getToken = async () => {
    const issuerDetails = await discoverIssuer(testConfig.OAUTH_ISSUER);
    const tokenUrl = issuerDetails.token_endpoint;
    const tokenData = {
      grant_type: 'client_credentials',
      client_id: testConfig.OAUTH_CLIENT_ID,
      client_secret: testConfig.OAUTH_CLIENT_SECRET,
      scope: testConfig.OAUTH_SCOPES,
    };
    const body = Object.entries(tokenData)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  
    let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    return http.post(tokenUrl, body, { headers: headers }).json().access_token
  };
 

export default async function () {
    console.log("ac: ", testConfig)
    const token = await getToken();
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    }
    const res = http.get('https://omcs-ssp2-pre-dev.opc.oracleoutsourcing.com/satellite-service/v1/job_types?page=1&size=50', requestOptions);
    check(res, {'status was 200': (r) => r.status == 200})
    sleep(1);
}
