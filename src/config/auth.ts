export default function AuthConfig(time?: string) {
  return {
    secret: process.env.AUTHCONFIG_SECRET,
    expiresIn: time,
  }
};
