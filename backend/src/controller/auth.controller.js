export const authCallback = async (req, res, next) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

     const user = User.findOne({ clerkId: id });

     if(!user) {
      await User.create({
        clerkId: id,
        fullName: `${firstName} ${lastName}`,
        imageUrl,
      })
     }
 
     res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error in auth callback:', error);
    next(error);
  }
}