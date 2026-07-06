import { clerkClient } from '@clerk/express'

export const protectRoute = async (req, res, next) => {
  const { userId } = req.auth();
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized - you must be logged in' });
  }
  next();
};

export const requireAdmin = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized - you must be logged in' });
    }
    const currentUser = await clerkClient.users.getUser(userId);
    const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress?.toLowerCase();

    if (!isAdmin) {
      return res.status(403).json({ message: 'Forbidden - you must be an admin to access this resource' });
    }

    next();
  } catch (error) {
    next(error);
  }
}