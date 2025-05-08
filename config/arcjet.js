import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/node";
import { ARC_JET } from "./env.js";

const aj = arcjet({
    key: ARC_JET,
    characteristics: ["ip.src"],
    rules: [
        shield({ mode: "LIVE" }),

        // Create a bot detection rule
        detectBot({
            mode: "LIVE",

            allow: [
                "CATEGORY:SEARCH_ENGINE",
            ],
        }),
        // Create a token bucket rate limit. Other algorithms are supported.
        tokenBucket({
            mode: "LIVE",
            refillRate: 5, 
            interval: 10, 
            capacity: 10, 
        }),
    ],
});

export default aj;