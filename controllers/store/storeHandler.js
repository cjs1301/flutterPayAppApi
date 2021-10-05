const { Request, Response } = require("express");
const bcrypt = require("bcrypt");
const transaction = require("../../models/index.js").transaction;

module.exports = {
    info: async (req, res) => {},
    search: async (req, res) => {},
    uploadAndEdit: async (req, res) => {
        const { name, introduction, ownerName } = req.body;
    },
    delete: async (req, res) => {},
};
