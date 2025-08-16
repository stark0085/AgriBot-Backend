import { con } from '../app.js'

// app.post('/messages', auth, async (req: Request, res: Response) => {
//     try {
//       const message = await addMessage({ db }, req.body as MessageInput);
//       if (!message) throw new Error('Message creation failed');

//       // emit event to send message data to connected clients
//       io.to(message.roomId).emit('chat message', message); 
//       res.status(201).send(message);
//     } catch (err) {
//       console.error(err)
//       res.status(500).send();
//     }
//   });

export function message_post(req, res) {
    const { MarksID, Marks, SubjectID, StudentID } = req.body
    if (MarksID && Marks && SubjectID && StudentID) {
        try {
            con.query(`"INSERT INTO Marks VALUES(${MarksID}, ${StudentID},${SubjectID}, ${Marks})"`, function (err,) {
                if (err) {
                    return res.status(401).json({ code: 1, message: "Could not fetch the data", error: err.message })
                }
                else {
                    return res.status(200).json({ code: 0, message: "Data Added Successfully" })
                }
            })
        }
        catch (err) {
            res.status(500).json({ code: -1, message: 'Internal server error', error: err })
        }
    }
    else {
        return res.status(401).json({ code: 2, message: "Incomplete Student Data" })
    }
}