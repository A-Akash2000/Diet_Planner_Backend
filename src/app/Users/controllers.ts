import { Request, Response } from "express";
import User, { IUser } from "./Models/User";
import { UploadedFile } from "express-fileupload";
import { hashPassword, verifyPassword } from "../../utils/bcrypt";
import { generateToken } from "../../middlewares/middleware";
import { sendResponse } from "../../utils/response";
import { FilterQuery } from "mongoose";
import { sendEmail } from "../../utils/mailsevice";
import logger from "../../utils/logger";

export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      email,
      password,
      role,
    } = req.body;
    console.log({
      email,
      password,
      role,
    });

    const normalizedEmail = email.toLowerCase();
    logger.info(`Attempting to add user with email: ${normalizedEmail}`);

    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      logger.warn(`Email already exists: ${normalizedEmail}`);
      sendResponse(res, 400, {
        status: false,
        message: "Validation Failed",
        errors: [{ msg: "Email already exists", path: "email" }],
      });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const user = new User({
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    const saved = await user.save();
    logger.info(`User created: ${user} (${normalizedEmail})`);

    // await sendEmail({
    //   to: normalizedEmail,
    //   subject: "Profile Registration Successful",
    //   html: `<p>Hi ${username}, your profile has been registered successfully.</p>`,
    // });
    //logger.info(`Registration email sent to: ${normalizedEmail}`);

    sendResponse(res, 201, {
      status: true,
      data:saved,
      message: "User added successfully",
    });
  } catch (error: any) {
    logger.error("Error adding user", {
      message: error.message,
      stack: error.stack,
    });
    sendResponse(res, 500, {
      status: false,
      message: "Internal server error",
      errors: [{ msg: "Internal server error", path: "server" }],
    });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      id,
      email,
      password,
      role,
    } = req.body;

    const user = await User.findById(id);
    if (!user) {
      sendResponse(res, 404, {
        status: false,
        message: "User not found",
        errors: [{ msg: "User not found", path: "id" }],
      });
      return;
    }

    const normalizedEmail = email.toLowerCase();

    if (normalizedEmail !== user.email) {
      const existingEmail = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (existingEmail) {
        sendResponse(res, 400, {
          status: false,
          message: "Validation Failed",
          errors: [{ msg: "Email already exists", path: "email" }],
        });
        return;
      }
    }

    const hashedPassword = await hashPassword(password);



    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        email: normalizedEmail,
        password: hashedPassword,
        role
      },
      { new: true }
    );

    if (!updatedUser) {
      sendResponse(res, 500, {
        status: false,
        message: "Failed to update user",
        errors: [{ msg: "User update failed", path: "update" }],
      });
      return;
    }

    const { password: _, ...userWithoutPassword } = updatedUser.toObject();

    // await sendEmail({
    //   to: normalizedEmail,
    //   subject: "Profile Updated Successfully",
    //   html: `<p>Hi ${name}, your profile has been updated successfully.</p>`,
    // });

    sendResponse(res, 200, {
      status: true,
      message: "User updated successfully",
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    sendResponse(res, 500, {
      status: false,
      message: "Internal server error",
      errors: [{ msg: "Internal server error", path: "server" }],
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email?.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      sendResponse(res, 401, {
        status: false,
        message: "Invalid email or password",
        errors: [{ email: "Invalid email or password" }],
      });
      return;
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      sendResponse(res, 401, {
        status: false,
        message: "Invalid email or password",
        errors: [{ password: "Invalid email or password" }],
      });
      return;
    }

    const token = generateToken((user._id as string).toString());
    const { password: _, ...userWithoutPassword } = user.toObject();
    // sendEmail({
    //   to: normalizedEmail,
    //   subject: 'Profile Logged Successfully',
    //   html: `<p>Hi ${userWithoutPassword.username} Logged in successfully. if you have not done this please report to admin</p>`,
    // });
    sendResponse(res, 200, {
      status: true,
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    sendResponse(res, 500, {
      status: false,
      message: "Internal server error",
      errors: [{ error: "Internal server error" }],
    });
  }
};

export const getUserById = async (id: string) => {
  return await User.findOne({ _id: id });
};

interface GetUsersQuery {
  page?: string;
  limit?: string;
  search?: string;
  role?: string;
  deleted?: boolean; // "true" to include deleted users
  isAvailable?: boolean; // "true" to filter available users
}

export const getAllUsers = async (
  req: Request<{}, {}, {}, GetUsersQuery>,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const search = req.query.search || "";
    const role = req.query.role || "";
    const deleted = req.query.deleted;
    const isAvailable = req.query.isAvailable;

    const query: FilterQuery<IUser> = {};

    // Search by username or email
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by role
    if (role) {
      query.role = role;
    }

    // Filter by deletion status
    // if (deleted) {
    //   query.deleted = true; // Only include non-deleted users by default
    // }
    query.deleted = deleted;
    // Filter by availability
    if (isAvailable) {
      query.isAvailable = true;
    }

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('departmentId','name _id');

    const total = await User.countDocuments(query);

    sendResponse(res, 200, {
      status: true,
      message: "Users fetched successfully",
      data: users,
      total: total,
    });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    sendResponse(res, 500, {
      status: false,
      message: "Internal server error",
      errors: [{ error: "Internal server error" }],
    });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { deleted: req.params.deleted },
      { new: true }
    );

    if (!user) {
      sendResponse(res, 404, {
        status: false,
        message: "User not found",
        errors: [{ id: "No user found with the provided ID" }],
      });
      return;
    }

    sendResponse(res, 200, {
      status: true,
      message: "User marked as deleted successfully",
      user,
    });
  } catch (error: any) {
    console.error("Delete user error:", error);
    sendResponse(res, 500, {
      status: false,
      message: "Internal server error",
      errors: [{ error: "Something went wrong while deleting the user" }],
    });
  }
};

export const getCurrentUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id; // assuming user ID is in params or decoded from JWT
    console.log("userId", userId);
    const user = await User.findById(userId).select("-password");
    if (!user) {
      sendResponse(res, 404, {
        status: false,
        message: "User not found",
        errors: [{ user: "No user found with the provided ID" }],
      });
      return;
    }
    const token = "no token";
    sendResponse(res, 200, {
      status: true,
      message: "User fetched successfully",
      token,
      user: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    sendResponse(res, 500, {
      status: false,
      message: "Internal server error",
      errors: [{ error: "Internal server error" }],
    });
  }
};
