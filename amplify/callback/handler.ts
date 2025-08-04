import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Issuer } from 'openid-client';

let client: any;

const issuerUrl = 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_JQiAhJMQA';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const queryStringParameters = event.queryStringParameters || {};
  const cookieHeader = event.headers?.cookie || event.headers?.Cookie || '';
  const cookies = parseCookies(cookieHeader);

  if (!client) {
    const issuer = await Issuer.discover(issuerUrl);
    client = new issuer.Client({
      client_id: '49pc4octfmiutv2br0cnjoda4h',
      client_secret: 'm9iq9u2ng22h10ncjolkptc1cbg7nu21f8bdou0jm96ubflk7oh',
      redirect_uris: ['http://localhost:3001/callback'],
      response_types: ['code'],
    });
  }

  try {
    const params = client.callbackParams({ query: queryStringParameters });
    const tokenSet = await client.callback('http://localhost:3001/callback', params, {
      nonce: cookies['nonce'] ?? '',
      state: cookies['state'] ?? '',
    });

    const userInfo = await client.userinfo(tokenSet.access_token);

    return {
      statusCode: 302,
      headers: {
        Location: 'https://frontend.d3kca8kpvd2vf.amplifyapp.com/home',
        'Set-Cookie': `userInfo=${encodeURIComponent(JSON.stringify(userInfo))}; Path=/; HttpOnly`,
      },
      body: '',
    };
  } catch (err) {
    console.error('Callback error:', err);
    return {
      statusCode: 302,
      headers: {
        Location: 'https://frontend.d3kca8kpvd2vf.amplifyapp.com/',
      },
      body: '',
    };
  }
};

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.split('=');
    if (name && rest.length > 0) {
      cookies[name.trim()] = decodeURIComponent(rest.join('='));
    }
  });
  return cookies;
}
