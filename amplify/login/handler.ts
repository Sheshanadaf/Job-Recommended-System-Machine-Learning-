import { Issuer, generators } from 'openid-client';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

let client: any;

const issuerUrl = 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_JQiAhJMQA';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Discover and initialize the client if not already done
  if (!client) {
    const issuer = await Issuer.discover(issuerUrl);
    client = new issuer.Client({
      client_id: '49pc4octfmiutv2br0cnjoda4h',
      client_secret: 'm9iq9u2ng22h10ncjolkptc1cbg7nu21f8bdou0jm96ubflk7oh', // Replace securely
      redirect_uris: ['http://localhost:3001/callback'],
      response_types: ['code'],
    });
  }

  // Generate security parameters
  const nonce = generators.nonce();
  const state = generators.state();

  // Generate the authorization URL
  const authUrl = client.authorizationUrl({
    scope: 'openid email profile',
    nonce,
    state,
  });

  return {
    statusCode: 302,
    headers: {
      Location: authUrl,
      'Set-Cookie': [
        `nonce=${nonce}; Path=/; HttpOnly; SameSite=Lax`,
        `state=${state}; Path=/; HttpOnly; SameSite=Lax`,
      ].join(','),
    },
    body: '',
  };
};
