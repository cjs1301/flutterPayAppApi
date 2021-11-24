const { Request, Response } = require("express");
const axios = require("axios");
const FormData = require("form-data");

module.exports = {
    login: async (req, res) => {
        try {
            const { id, password } = req.body;
            let data = new FormData();
            data.append("id", id);
            data.append("password", password);

            let config = {
                method: "post",
                url: `${process.env.PY_API}/admin/login`,
                headers: {
                    ...data.getHeaders(),
                },
                data: data,
            };
            try {
                let result = await axios(config);
                return res
                    .status(200)
                    .send({ data: result.data.data, message: "성공" });
            } catch (error) {
                console.log(error);
                return res
                    .status(500)
                    .send({ data: null, message: error.response.data.message });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({ data: null, message: "오류" });
        }
    },
};
