const pool = require('./db');

exports.insert = async (
    purposeOfUse, weight, stepOneDosage, stepTwoDosage, stepThreeDosage, severity = null,
) => {
    let sql = `
        insert into dosages
        (purpose_of_use, severity, weight, step_one_dosage, step_two_dosage, step_three_dosage)
        VALUES ($1, $2, $3, $4, $5, $6)
    `
    await pool.pool.query(sql, [purposeOfUse, severity, weight, stepOneDosage, stepTwoDosage, stepThreeDosage]);
}