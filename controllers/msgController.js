// const messageModal = require('../model/messageModal');
// const Message = require('../model/messageModal');

// module.exports.addMessage = async (req, res, next) => {
//   try {
//     const { from, to, message } = req.body;
//     const data = await Message.create({
//       message: { text: message },
//       users: { from, to },
//       sender: from,
//     });
//     if (data) return res.json({ msg: "Message added successfully." });
//     return res.json({ msg: "Database didn't receive any message." });
//   } catch (ex) {
//     next(ex);
//   }
// };



// module.exports.getAllMessages = async (req, res, next) => {
//   try{
//     const {from,to} = req.body;
//     const messages = await messageModal.find({
//       users:{
//         $all: [from, to],

//       },

//     }).sort({$updatedAt:1});
//     const projectMessages = messages.map((msg) =>{
//       return{
//         fromSelf: msg.sender.toString() === from,
//         message: msg.message.text, 
//       }
//     });
//     res.json(projectMessages);
//   }catch(ex){
//     next(ex)
//   }
// };

const Message = require('../model/messageModal');

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;

    if (!from || !to || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const data = await Message.create({
      message: { text: message },
      users: [from, to], // Use an array for 'users' field
      sender: from,
    });

    if (data) {
      return res.status(201).json({ message: "Message added successfully." });
    } else {
      return res.status(500).json({ error: "Failed to add message." });
    }
  } catch (error) {
    console.error('Error adding message:', error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getAllMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const messages = await Message.find({
      users: { $all: [from, to] },
    }).sort({ updatedAt: 1 });

    const formattedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });

    return res.status(200).json(formattedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
