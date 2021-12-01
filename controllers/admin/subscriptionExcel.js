const ExcelJS = require("exceljs");
const { Request, Response } = require("express");
const subscription = require("../../models/index.js").subscription;
const user = require("../../models/index.js").user;

module.exports = {
    down: async (req, res) => {
        try {
            let subList = await subscription.findAll({
                where: {
                    state: "약정충전진행",
                },
                include: [
                    {
                        model: user,
                    },
                ],
                order: [["updatedAt", "DESC"]],
            });
            let result = [];
            if (subList.length !== 0) {
                for (let el of subList) {
                    let find = await subscription.findAll({
                        where: {
                            userId: el.user.id,
                        },
                        order: [["updatedAt", "DESC"]],
                    });
                    if (find.length !== 0) {
                        if (find[0].state === "약정충전진행") {
                            result.push(el);
                        }
                    }
                }
            }
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet();
            let rawData = [
                { header: "아이디", data: [] },
                { header: "이름(닉네임)", data: [] },
                { header: "전화번호", data: [] },
                { header: "이메일", data: [] },
                { header: "금액", data: [] },
            ];
            for (let el of result) {
                rawData[0].data.push(el.user.idValue);
                rawData[1].data.push(el.user.userName);
                rawData[2].data.push(el.user.phoneNumber);
                rawData[3].data.push(el.user.email);
            }
            rawData.forEach((data, index) => {
                worksheet.getColumn(index + 1).values = [
                    data.header,
                    ...data.data,
                ];
            });
            res.setHeader("Content-Type", "application/vnd.openxmlformats");
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "Report.xlsx"
            );
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    up: async (req, res) => {
        let transaction = null;
        try {
            transaction = await user.sequelize.transaction();
            const workbook = new ExcelJS.Workbook();
            const worksheet = await workbook.xlsx.load(req.file.buffer);
            let data = [];
            let i = 0;
            worksheet.eachSheet((sheet) => {
                sheet.eachRow((row) => {
                    data[i] = row.values;
                    i++;
                });
            });
            console.log(data);
            for (let i = 1; i < data.length; i++) {
                let find = await user.findOne({
                    where: {
                        idValue: data[i][1],
                    },
                });
                if (!find) {
                    await transaction.rollback();
                    return res.status(400).send({
                        data: null,
                        message: "없는 사용자가 포함되어 있습니다",
                    });
                }
                let userSub = await subscription.findAll({
                    where: {
                        userId: find.id,
                    },
                    order: [["updatedAt", "DESC"]],
                });
                if (userSub.length !== 0) {
                    await transaction.rollback();
                    return res.status(400).send({
                        data: null,
                        message: "사용자가 약정충전 진행 상태가 아닙니다.",
                    });
                }
                if (userSub[0].state !== "약정충전진행") {
                    await transaction.rollback();
                    return res.status(400).send({
                        data: null,
                        message: "사용자가 약정충전 진행 상태가 아닙니다.",
                    });
                }
                find.gMoney += data[i][-1];
                await find.save();
            }
            await transaction.commit();
            return res
                .status(200)
                .send({ data: null, message: "모든대상 충전 완료" });
        } catch (error) {
            await transaction.rollback();
            console.log(error);
            return res.status(500).send({ data: error, message: "오류" });
        }
    },
};
