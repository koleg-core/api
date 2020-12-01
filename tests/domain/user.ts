import { Organisation } from '../../src/domain/Organisation';
import { Job } from '../../src/domain/user/Job';
import { Password } from '../../src/domain/user/Password';
import { PhoneNumber } from '../../src/domain/user/PhoneNumber';
import { SshKey } from '../../src/domain/user/SshKey';
import { User } from '../../src/domain/user/User';
import { UserIdentity } from '../../src/domain/user/UserIdentity';
import { genGroupId } from './group';
import { genJob } from './job';
import { genPassword } from './password';
import { genPhoneNumber } from './phoneNumber';
import { genSshKey } from './sshKey';
import { genUserIdentity } from './userIdentity';

export const genUserId = function(organisation: Organisation):string {

    const identity:UserIdentity = genUserIdentity();
    const phoneNumber: PhoneNumber = genPhoneNumber();
    const passwordWithExpiration:Password = genPassword();
    const job:Job = genJob();
    const sshKey:SshKey = genSshKey();
    const groupId = genGroupId(organisation);

    const groupsId:string[] = [groupId];
    const birthDay:Date = new Date();
    birthDay.setMonth(birthDay.getMonth() + 8);

    const phoneNumbers:PhoneNumber[] = [phoneNumber];

    return organisation.addUser(
        identity,
        passwordWithExpiration,
        job,
        birthDay,
        groupsId,
        null,
        sshKey,
        phoneNumbers,
        null);
}