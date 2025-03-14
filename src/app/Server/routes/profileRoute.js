const express = require('express');
const { GetProfile, savedProfile } = require('../controller/ProfileController');


const profileRouter = express.Router();

profileRouter.get('/get-profile', GetProfile);
profileRouter.post('/saved-profile', savedProfile);

module.exports = profileRouter;