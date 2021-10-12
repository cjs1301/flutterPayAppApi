const { Request, Response } = require("express");
const axios = require("axios");
const user = require("../../models/index.js").user;

module.exports = {
    oauth: async (req, res) => {
        const { title, content } = req.body;
        await axios.get(
            "/oauth/authorize?client_id={REST_API_KEY}&redirect_uri={REDIRECT_URI}&response_type=code"
        );
    },
};
