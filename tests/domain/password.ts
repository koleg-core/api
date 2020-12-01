import { Password } from '../../src/domain/user/Password';

import sha256 from 'crypto-js/sha256';

export const genPassword = function(): Password {
    const hashedPassword = sha256('P@ssw0rd');
    const password:Password = new Password(hashedPassword.toString());

    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 8);

    return new Password(hashedPassword.toString(), expirationDate);
};