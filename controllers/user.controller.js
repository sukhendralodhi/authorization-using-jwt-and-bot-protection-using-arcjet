import User from "../models/user.model.js";

export const getUsers = async (req, res, next) => {
    try {
        // gett all the available users 
        const users = await User.find();

        // if user don't exist 
        if (!users) {
            const error = new Error("No users found");
            error.statusCode = 404;
            throw error;
        }
        // sucess message return after getting al the users 
        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users
        });
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        // getting id from params 
        const { id } = req.params;
        // finding user in database using id 
        const user = await User.findById(id).select('-password');
        //if user does not exist in database
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        // success message after getting user 
        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user
        })
    } catch (error) {
        next(error);
    }
}
