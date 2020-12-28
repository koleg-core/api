import {
  IsDefined,
  IsString
} from "class-validator";

import { SshKey } from "domain/user/SshKey";

export class SshKeyApiModel {

  @IsDefined()
  @IsString()
  public readonly privateKey: string;
  @IsDefined()
  @IsString()
  public readonly publicKey: string

  constructor(
    privateKey: string,
    publicKey: string
  ) {
    // IMPORTANT:
    // The class validator fill object after creation,
    // then this constructor is here to external manipulations.
    // For the same reason, we can't throw error into constructor
    // for missing properties.

    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  public static toSshKeyModel(sshKey: SshKey): SshKeyApiModel {
    return new SshKeyApiModel(
      sshKey.privateKey,
      sshKey.publicKey
    );
  }

  public toSshKey(): SshKey {
    return new SshKey(
      this.privateKey,
      this.publicKey
    );
  }
}
