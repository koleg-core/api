import { SshKey } from '../../src/domain/user/SshKey';

export const genSshKey = function(): SshKey {
    const privateKey = `
    -----BEGIN RSA PRIVATE KEY-----
    MIICXgIBAAKBgQCYjiyDmRFQcPS9Wzj6ry4Rt1thmWbauCmXgkqMhMWkFZS9mi4m
    OzoiENsb5qxF3apy0AbAmBidxwiIQR/PwKF1sqcE9cYo8twe9cskbrhuCXEfjoNl
    S9mcAGwp1UK0FEDUnsQneHohwWAU4ZQsP9O26Z5rvJD4lCHNVkRzJVTm8wIDAQAB
    AoGBAIzAUA2ywijHruauLaoMyqKJ24P29tDBrY4eJg3zyi4Tw0IT6JRZfM9FYgMi
    Frv3QnXfvPsg2UVpB1Q/UcxqXAw8Jp3WuikpSTxZuAw3XCSeNNViNfmLBTq9Ih+A
    fEvCUHa3ymI6vBPtYEP5ujB5tT2xMG58xblzpAREDdq0BR+hAkEA6HcMMDa1Hn9e
    Ob+Yvizc4Cy6B0kPlBTj/oOxcakcqy+LtRlUi27Y4eMuaefkZ25uO4IB0J/vtp6O
    vwuzBDoK2wJBAKgADchUSj9mL/GMy37JyW09GWrUkphvZoxDts806TizJ6sC1fPe
    Hagmya+tQOkpoeasf9BNcLStA/Gr9ytGc8kCQQCt0jZ+5qlPgJWIQMeJjCosRcVk
    JTFM3MIOUZKhFn6lUgv5AlPBXsU1QpY2Ans7C8vJG1EYGj84Ih9CoxDcnDn5AkB/
    iUrtQc/7wT+0SAZUAiv/2dpp12ZSgn9/DAjD1I8YlCkREd4KfBxXgtqpmwUj/I8D
    5wBAygk9n/rWhI3nNFzBAkEAqsvqaAjNUWCvHozpmf50LvH7WX4Jh9TPLk5G1yHD
    C3jKDDFZko4uNUMBsaevlmiUeEzpniZ4goSiK18P0DCrdw==
    -----END RSA PRIVATE KEY-----
    `

    const publicKey = `
    -----BEGIN PUBLIC KEY-----
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCYjiyDmRFQcPS9Wzj6ry4Rt1th
    mWbauCmXgkqMhMWkFZS9mi4mOzoiENsb5qxF3apy0AbAmBidxwiIQR/PwKF1sqcE
    9cYo8twe9cskbrhuCXEfjoNlS9mcAGwp1UK0FEDUnsQneHohwWAU4ZQsP9O26Z5r
    vJD4lCHNVkRzJVTm8wIDAQAB
    -----END PUBLIC KEY-----
    `

    return new SshKey(privateKey, publicKey);
}