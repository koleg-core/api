export const configModel = {
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
      env: "KOLEG_S3_BUCKET",
    },
    port: {
      doc: "TCP/IP port number. This input is optional. Default value set to 80 for HTTP and 443 for HTTPs.",
      format: "port",
      env: "KOLEG_S3_PORT",
    },
    accessKey: {
      doc: "Access key is like user ID that uniquely identifies your account.",
      type: String,
      env: "KOLEG_S3_ACCESSKEY",
    },
    secretKey: {
      doc: "Secret key is the password to your account.",
      type: String,
      env: "KOLEG_S3_SECRETKEY",
    },
    useSsl: {
      doc: "Set this value to 'true' to enable secure (HTTPS) access",
      type: Boolean,
      env: "KOLEG_S3_USESSL",
    },
  },
  database: {
    enable: {
      doc: "Boolean to know if we use database or not. If false, data will stored into memory.",
      default: false,
      format: Boolean,
      env: "KOLEG_DATABASE_ENABLE",
    },
    host: {
      doc: "Database hostname.",
      format: String,
      env: "KOLEG_DATABASE_HOST",
    },
    port: {
      doc: "Database port.",
      default: 3306,
      format: "port",
      env: "KOLEG_DATABASE_PORT",
    },
    user: {
      doc: "User to connect to database.",
      format: String,
      default: "_VALIDATOR",
      sensitive: true,
      env: "KOLEG_DATABASE_USER",
    },
    password: {
      doc: "Password to connect to database.",
      format: String,
      sensitive: true,
      env: "KOLEG_DATABASE_PASSWORD",
    },
    schema: {
      doc:"Database used in the validator.",
      format: String,
      env: "KOLEG_DATABASE_SCHEMA",
    }
  }
};
