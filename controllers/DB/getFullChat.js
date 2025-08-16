import { con } from '../app.js'

export function fullChat_get(req, res) {
    try {
        con.query("SELECT * from Students LEFT JOIN Marks ON Students.StudentID = Marks.StudentID", function (err, marks) {
            if (err) {
                return res.status(401).json({ code: 1, message: "Could not fetch the data", error: err.message })
            }
            else {
                return res.status(200).json({ code: 0, message: "Marks Fetched Successfully", marks: marks })
            }
        });
    }
    catch (err) {
        res.status(500).json({ code: -1, message: 'Internal server error', error: err });
    }
}