import rateLimit from 'express-rate-limit'

export const CreateAccountLimiter = rateLimit({
  windowMs: 30000, // 1 hour
  max: 20, // Limit each IP to 5 create account requests per `window` (here, per hour)
  message: {
    error: 'RATELIMIT: Você realizou muitas requisições, tente novamente em 30 segundos!'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
