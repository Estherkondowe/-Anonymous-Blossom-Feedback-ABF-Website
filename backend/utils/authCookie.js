const isProd = process.env.NODE_ENV === 'production';

function authCookieOptions() {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  };
}

function setAuthToken(res, token) {
  res.cookie('token', token, authCookieOptions());
}

function clearAuthToken(res) {
  res.clearCookie('token', { ...authCookieOptions(), maxAge: undefined });
}

module.exports = { authCookieOptions, setAuthToken, clearAuthToken };