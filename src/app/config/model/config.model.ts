import convict from "convict";
// import yaml from "yaml";

// Configuration schema
const schema = {
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV",
  },
  port: {
    doc: "The port to listen.",
    format: "port",
    default: 8080,
    env: "KOLEG_PORT",
    arg: "port",
  },
  s3: {
    bucket: {
      doc: "URL to object storage service.",
      format: String,
    },
    port: {
      doc: "TCP/IP port number. This input is optional. Default value set to 80 for HTTP and 443 for HTTPs.",
      format: "port",
    },
    accessKey: {
      doc: "Access key is like user ID that uniquely identifies your account.",
      type: String
    },
    secretKey: {
      doc: "Secret key is the password to your account.",
      type: String
    },
    useSsl: {
      doc: "Set this value to 'true' to enable secure (HTTPS) access",
      type: Boolean
    }
  },
  database: {
    host: {
      doc: "Database hostname.",
      format: String,
    },
    port: {
      doc: "Database port.",
      default: 3306,
      format: "port",
    },
    user: {
      doc: "User to connect to database.",
      format: String,
      default: "_VALIDATOR",
      sensitive: true,
    },
    password: {
      doc: "Password to connect to database.",
      format: String,
      sensitive: true,
    },
    database: {
      doc:"Database used in the validator.",
      format: String,
    }
  }
};
