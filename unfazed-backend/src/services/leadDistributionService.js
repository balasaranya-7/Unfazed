const Lead = require("../models/Lead");
const distributeLead = async (data) => Lead.create(data);
module.exports = { distributeLead };
