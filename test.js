const {strikes} = require('./database/guildData');
const userid = "339130669466910750";

// const strikeCheck = strikes.exists({ userID: userid });

// if (!strikeCheck) {
//     console.log('No User Exists');
// } else {
   const fUser = strikes.find({ userID: userid }).exec( (err, res) => {
    console.log(res.length);
   });
// }

