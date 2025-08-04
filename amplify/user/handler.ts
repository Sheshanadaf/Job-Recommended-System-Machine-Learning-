import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const cookies = parseCookies(event.headers.Cookie || event.headers.cookie || '');

  if (cookies.userInfo) {
    try {
      const user = JSON.parse(decodeURIComponent(cookies.userInfo));
      return {
        statusCode: 200,
        body: JSON.stringify({
          authenticated: true,
          user,
        }),
      };
    } catch (error) {
      console.error('Failed to parse userInfo cookie:', error);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid userInfo cookie format' }),
      };
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ authenticated: false }),
  };
};

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};

  cookieHeader.split(';').forEach((cookie) => {
    const [key, ...valueParts] = cookie.trim().split('=');
    if (key && valueParts.length > 0) {
      cookies[key] = decodeURIComponent(valueParts.join('='));
    }
  });

  return cookies;
}
