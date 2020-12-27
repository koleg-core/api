import { Organisation } from "domain/organisation";
import { Job } from "domain/user/Job";
import { Password } from "domain/user/Password";
import { PhoneNumber } from "domain/user/PhoneNumber";
import { SshKey } from "domain/user/SshKey";
import { StatelessUser } from "domain/user/StatelessUser";
import { UserIdentity } from "domain/user/UserIdentity";
import { genGroupId } from "./group";
import { genJob } from "./job";
import { genPassword } from "./password";
import { genPhoneNumber } from "./phoneNumber";
import { genSshKey } from "./sshKey";
import { genUserIdentity } from "./userIdentity";



export const genStatelessUser = (
  organisation: Organisation,
): StatelessUser => {
  const identity:UserIdentity = genUserIdentity();
  const phoneNumber: PhoneNumber = genPhoneNumber();
  const passwordWithExpiration:Password = genPassword();
  const job:Job = genJob();
  const sshKey:SshKey = genSshKey();
  const groupId = genGroupId(organisation);

  const groupsId: string[] = [groupId];
  const birthDay:Date = new Date();
  birthDay.setMonth(birthDay.getMonth() - 8);


  const phoneNumbers:PhoneNumber[] = [phoneNumber];

  const statelessUser: StatelessUser = new StatelessUser(
    null,
    null,
    null,
    identity,
    passwordWithExpiration,
    birthDay,
    null,
    phoneNumbers,
    groupsId,
    job,
    null,
    null,
    sshKey,
    null
  );
  return statelessUser;
};
