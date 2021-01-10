/* eslint-disable camelcase */

export const configModel = {
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV",
  },
  api: {
    port: {
      doc: "The port that api listen",
      format: "port",
      default: 8080,
      env: "KOLEG_API_PORT",
    },
    jwt_secret: {
      doc: "JWT secret used to encrypt api session token.",
      format: String,
      env: "KOLEG_API_JWT_SECRET",
      default: "25b041fe8615a8c8755ef5f6d5f447c8"
    },
    session_duration: {
      doc: "Time validity for api session.",
      format: String,
      env: "KOLEG_API_SESSION_DURATION",
      default: "10h"
    },
    page_size: {
      doc: "Number of item return per query page.",
      format: Number,
      env: "KOLEG_API_PAGE_SIZE",
      default: 20
    },
  },
  s3: {
    bucket: {
      doc: "URL to object storage service.",
      format: "url",
      env: "KOLEG_S3_BUCKET",
    },
    endpoint: {
      doc: "Host of s3 server.",
      format: String,
      env: "KOLEG_S3_ENDPOINT",
    },
    port: {
      doc: "TCP/IP port number. This input is optional. Default value set to 80 for HTTP and 443 for HTTPs.",
      format: "port",
      env: "KOLEG_S3_PORT",
    },
    access_key: {
      doc: "Access key is like user ID that uniquely identifies your account.",
      type: String,
      env: "KOLEG_S3_ACCESSKEY",
    },
    secret_key: {
      doc: "Secret key is the password to your account.",
      type: String,
      env: "KOLEG_S3_SECRETKEY",
    },
    use_ssl: {
      doc: "Set this value to 'true' to enable secure (HTTPS) access",
      type: Boolean,
      env: "KOLEG_S3_USESSL",
    },
    region: {
      doc: "S3 region.",
      type: String,
      env: "KOLEG_S3_REGION",
    },
    path_style: {
      doc: "Enable S3 path style.",
      type: Boolean,
      env: "KOLEG_S3_PATH_STYLE",
      default: false,
    },
    api_version: {
      doc: "S3 api version",
      type: String,
      env: "KOLEG_S3_API_VERSION",
      default: "v4",
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

/* eslint-enable camelcase */
