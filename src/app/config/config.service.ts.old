// convict.addParser({ extension: ['yml', 'yaml'], parse: yaml.parse });

// convict.addFormat(require("convict-format-with-validator").url);
// convict.addFormat(require("convict-format-with-validator").email);

// convict.addFormat({
//   name: 'server-array',
//   validate: function(servers, schema) {
//     if (!Array.isArray(servers)) {
//       throw new Error('must be of type Array');
//     }

//     // TODO: fix validation for nested objects
//     // cf: AddFormat 'server'
//     for (let server of servers) {
//       convict(schema.server).load(server);
//     }
//   }
// });

// convict.addFormat({
//   name: 'server',
//   validate: function(server, schema) {
//     // TODO: verify that validate is executed or not
//     if (!server.activateur) {
//       throw new Error('Missing `activateur` key in server config');
//     }
//     if (!server.database_server) {
//       throw new Error('Missing `database_server` key in server config');
//     }
//       convict(schema.activateur).load(server.activateur).validate();
//       convict(schema.database_server).load(server.database_server).validate();
//   }
// });

const config = convict(schema);

// Load environment dependent configuration
// TODO remove path duplication
// TODO: dont load all files: check before if file exist and
// load only the latest
const env = config.get("env");

if(process.env.CONFIG_FILES) {
  try {
    config.loadFile(process.env.CONFIG_FILES.split(","));
    config.validate();
  } catch {
    console.log("INFO",  `${process.env.CONFIG_FILES} not found exit`);
  }

} else {
  for(const configFile of defaultConfigsPath) {
    try {
      config.loadFile(configFile);
      console.log("INFO",  `${configFile} LOADED`);
    } catch(e) {
      // TODO: Add better logs for dev/debug mode
      console.log("INFO",  `${configFile} not found skipping`);
    }
  }
}

// Perform validation
config.validate({ allowed: "strict" });

// if (env === "development") {
console.log(config.getProperties());
// }

module.exports = config;
