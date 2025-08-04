export const handler = async () => {
  const logoutUrl = `https://us-east-1jqiahjmqa.auth.us-east-1.amazoncognito.com/logout?client_id=49pc4octfmiutv2br0cnjoda4h&logout_uri=http://localhost:3000/`;

  return {
    statusCode: 302,
    headers: {
      Location: logoutUrl,
      'Set-Cookie': 'userInfo=; Path=/; Max-Age=0;',
    },
    body: '',
  };
};
