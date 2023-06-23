const Job = require("./job");
const Contract = require("./contract");
const Profile = require("./profile");

Job.associate({ Contract });
Contract.associate({ Job, Profile });
Profile.associate({ Contract });

module.exports = { Job, Contract, Profile };