import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subscription name is required"],
        trim: true,
        minLength: [3, "Name must be at least 3 characters long"],
        maxLength: [100, "Name must be at most 50 characters"],
    },
    price: {
        type: Number,
        required: [true, "Subscription price is required"],
        min: [0, "Price must be at least 0"],
    },
    currency: {
        type: String,
        required: [true, "Subscription currency is required"],
        enum: ["USD", "EUR", "GBP", "INR"],
        default: "USD",
    },
    frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
        type: String,
        enum: ["entertainment", "education", "news", "other"],
        required: [true, "Subscription category is required"],
    },
    paymentMethod: {
        type: String,
        required: [true, "Payment method is required"],
        trim: true,
    },
    status: {
        type: String,
        enum: ["active", "cancelled", "expired"],
        default: "active",
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"],
        validate: {
            validator: function (value) {
                return value <= new Date();
            },
            message: "Start date must be in the past or present",
        },
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: "Renewal date must be after start date",
        },
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
        index: true,
    }

}, {
    timestamps: true,
});

subscriptionSchema.pre("save", function (next) {
    if (this.startDate && this.frequency) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };

        // Set renewal date only if it's not provided or needs updating
        if (!this.renewalDate) {
            const renewalDate = new Date(this.startDate);
            renewalDate.setDate(renewalDate.getDate() + renewalPeriods[this.frequency]);
            this.renewalDate = renewalDate;
        }
    }

    if (this.renewalDate && this.renewalDate < new Date()) {
        this.status = "expired";
    }

    next();
});


const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;