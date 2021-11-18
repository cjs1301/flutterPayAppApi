const ExcelJS = require("exceljs");
const { Request, Response } = require("express");

module.exports = async (raw, res) => {
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
        console.log(raw);
        const rawData = [
            { header: "마을가게명", data: [] },
            { header: "총정산금액", data: [] },
            { header: "결제금액", data: [] },
            { header: "수수료", data: [] },
            { header: "공제금액", data: [] },
        ];
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet();
        for (let el of raw) {
            rawData[0].data.push(el.storeName);
            rawData[1].data.push(el.accountall ? el.accountall : 0);
            rawData[2].data.push(el.pay_money ? el.pay_money : 0);
            rawData[3].data.push(el.fees ? el.fees : 0);
            rawData[4].data.push(el.deductible_money ? el.deductible_money : 0);
        }

        rawData.forEach((data, index) => {
            worksheet.getColumn(index + 1).values = [data.header, ...data.data];
        });
        worksheet.getColumn("A");
        res.setHeader("Content-Type", "application/vnd.openxmlformats");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "Report.xlsx"
        );
        await workbook.xlsx.write(res);
        return res.end();
    } catch (error) {
        console.log(error);
        throw error;
    }
};
