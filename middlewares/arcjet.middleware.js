import aj from '../config/arcjet.js';

const arcJetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, { requested: 1 });

        if (decision.isDenied) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ error: "Rate limit exceeded" });
            }
            if (decision.reason.isBot()) {
                return res.status(403).json({ error: "You are a bot" });
            }
            return res.status(403).json({ error: "Access denied" });
        }

        next(); // Allow request

    } catch (error) {
        console.log(`Arcjet error: ${error}`);
        next(error);
    }
}

export default arcJetMiddleware;