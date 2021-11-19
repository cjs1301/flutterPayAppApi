const ExcelJS = require("exceljs");
const { Request, Response } = require("express");

module.exports = async (raw, req, res) => {
    try {
        // // create a sheet with red tab colour
        // const sheet = workbook.addWorksheet("My Sheet", {
        //     properties: { tabColor: { argb: "FFC0000" } },
        // });

        // // create a sheet where the grid lines are hidden
        // const sheet = workbook.addWorksheet("My Sheet", {
        //     views: [{ showGridLines: false }],
        // });

        // // create a sheet with the first row and column frozen
        // const sheet = workbook.addWorksheet("My Sheet", {
        //     views: [{ state: "frozen", xSplit: 1, ySplit: 1 }],
        // });

        // // Create worksheets with headers and footers
        // const sheet = workbook.addWorksheet("My Sheet", {
        //     headerFooter: {
        //         firstHeader: "Hello Exceljs",
        //         firstFooter: "Hello World",
        //     },
        // });

        // // create new sheet with pageSetup settings for A4 - landscape
        // const worksheet = workbook.addWorksheet("My Sheet", {
        //     pageSetup: { paperSize: 9, orientation: "landscape" },
        // });
        console.log(req.route.path);
        let rawData;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet();
        if (req.route.path === "/admin/calculate/download") {
            rawData = [
                { header: "마을가게명", data: [] },
                { header: "총정산금액", data: [] },
                { header: "결제금액", data: [] },
                { header: "수수료", data: [] },
                { header: "공제금액", data: [] },
            ];

            for (let el of raw) {
                rawData[0].data.push(el.storeName);
                rawData[1].data.push(el.accountall ? el.accountall : 0);
                rawData[2].data.push(el.pay_money ? el.pay_money : 0);
                rawData[3].data.push(el.fees ? el.fees : 0);
                rawData[4].data.push(
                    el.deductible_money ? el.deductible_money : 0
                );
            }
            rawData.forEach((data, index) => {
                worksheet.getColumn(index + 1).values = [
                    data.header,
                    ...data.data,
                ];
            });
        }
        if (req.route.path === "/store/admin/calculate/download") {
            rawData = [
                { header: "거래일시", data: [] },
                { header: "구매자", data: [] },
                { header: "결제금액", data: [] },
                { header: "수수료 2%", data: [] },
                { header: "공제금액", data: [] },
                { header: "정산금액", data: [] },
            ];
            for (let el of raw.arr) {
                let pay_money = Math.floor(el.price);
                let fees = Math.floor(pay_money * 0.02);
                let deductible_money = pay_money - Math.floor(el.gMoney);
                rawData[0].data.push(el.createdAt);
                rawData[1].data.push(el.user.userName);
                rawData[2].data.push(pay_money);
                rawData[3].data.push(fees);
                rawData[4].data.push(deductible_money);
                rawData[5].data.push(
                    pay_money - deductible_money > 0
                        ? pay_money - fees - deductible_money
                        : 0
                );
            }

            worksheet.getRow(1).value = ["총정산 금액", raw.total];
            rawData.forEach((data, index) => {
                worksheet.getColumn(index + 1, 1).values = [
                    data.header,
                    ...data.data,
                ];
            });
        }

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
};
