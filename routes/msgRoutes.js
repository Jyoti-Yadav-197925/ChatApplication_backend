// const express = require("express");
// const { addMessage, getAllMessages } = require("../controllers/msgController");

// const router = express.Router();

// router.post("/addmsg/", addMessage);
// router.post("/getmsg/", getAllMessages);

// module.exports = router;


const express = require("express");
const { addMessage, getAllMessages } = require("../controllers/msgController");

const router = express.Router();

router.post("/addmsg", addMessage); // Updated route paths
router.post("/getmsg", getAllMessages);

module.exports = router;
