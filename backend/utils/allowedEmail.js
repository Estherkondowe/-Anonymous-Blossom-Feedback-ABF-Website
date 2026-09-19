const ALLOWED_EMAILS = ['kondoweesther2@gmail.com'];

function isAllowedEmail(email) {
  if (!email) return false;
  return email.endsWith('@code-blossom.com') || ALLOWED_EMAILS.includes(email);
}

module.exports = isAllowedEmail;