import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        return res.status(201).json({
            success: true,
            data: subscription,
            message: "Subscription created successfully"
        });
    } catch (error) {
        next(error);
    }
};


export const getAllSubscriptions = async (req, res, next) => {
    try {
        // Allow access only if the logged-in user's ID matches the route parameter
        if (req.user._id.toString() !== req.params.id) {
            const error = new Error("You are not authorized to view this subscription");
            error.statusCode = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.user._id });

        return res.status(200).json({
            success: true,
            data: subscriptions,
            message: "Subscriptions fetched successfully"
        });

    } catch (error) {
        next(error);
    }
};

