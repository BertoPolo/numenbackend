import rateLimit from "express-rate-limit"

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  keyGenerator: function (req, res) {
    return req.ip
  },
  handler: function (req, res, next) {
    res.status(429).json({
      message: "Too many requests, please try again later.",
    })
  },
})

export default apiLimiter
