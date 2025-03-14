const Profile = require("../../model/post/profile");

const GetProfile = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const profile = await Profile.findOne({ userId });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

}
const savedProfile = async (req, res) => {
    try {
        const { userId } = req.query; 
        const profileData = req.body; 

        if (!userId || !profileData) {
            return res.status(400).json({ message: 'User ID and profile data are required' });
        }

        const profile = await Profile.findOneAndUpdate(
            { userId },
            profileData,
            { new: true, upsert: true } 
        );

        res.status(200).json({ message: 'Profile saved successfully', profile });
    } catch (error) {
        console.error('Error saving profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
module.exports = { savedProfile, GetProfile }