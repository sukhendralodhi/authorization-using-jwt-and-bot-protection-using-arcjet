import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { createSubscription, getAllSubscriptions } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

// subscriptionRouter.get('/', authorize, getAllSubscriptions);

subscriptionRouter.get('/:id', (req, res) => res.send({ title: "GET subscription details" }));

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', (req, res) => res.send({ title: "Update subscription" }));

subscriptionRouter.delete('/:id', (req, res) => res.send({ title: "Delete subscription" }));

subscriptionRouter.get('/user/:id', authorize, getAllSubscriptions);

subscriptionRouter.put('/:id/cancel', (req, res) => res.send({ title: "Cancel subscription" }));

subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({ title: "GET all upcoming subscriptions" }));

export default subscriptionRouter;