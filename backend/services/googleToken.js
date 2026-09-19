const axios = require('axios');

class GoogleTokenError extends Error {
  constructor(message, code = 'GOOGLE_TOKEN_ERROR', status = 401) {
    super(message);
    this.name = 'GoogleTokenError';
    this.code = code;
    this.status = status;
  }
}

async function refreshAccessToken(admin) {
  if (!admin.googleRefreshToken) {
    throw new GoogleTokenError(
      'Google Forms not connected. Please connect from the dashboard.',
      'GOOGLE_FORMS_NOT_CONNECTED'
    );
  }

  const params = new URLSearchParams();
  params.append('client_id', process.env.GOOGLE_CLIENT_ID);
  params.append('client_secret', process.env.GOOGLE_CLIENT_SECRET);
  params.append('refresh_token', admin.googleRefreshToken);
  params.append('grant_type', 'refresh_token');

  let response;
  try {
    response = await axios.post('https://oauth2.googleapis.com/token', params);
  } catch (err) {
    throw new GoogleTokenError(
      'Google Forms connection expired. Please reconnect from the dashboard.',
      'GOOGLE_FORM_TOKEN_REVOKED'
    );
  }

  const { data } = response;
  admin.googleAccessToken = data.access_token;
  if (data.refresh_token) {
    admin.googleRefreshToken = data.refresh_token;
  }
  await admin.save();

  return data.access_token;
}

async function callWithGoogleToken(admin, fn) {
  if (!admin.googleAccessToken) {
    return await fn(await refreshAccessToken(admin));
  }

  try {
    return await fn(admin.googleAccessToken);
  } catch (err) {
    const status = err.response && err.response.status;
    if (status !== 401 && status !== 403) {
      throw err;
    }
    const freshToken = await refreshAccessToken(admin);
    return await fn(freshToken);
  }
}

module.exports = { callWithGoogleToken, GoogleTokenError };