import { Result } from "core/result";
import { Guard } from "core/guard";

export class SshKey {

  constructor(
        readonly privateKey: string,
        readonly publicKey: string
  ) {
    // TODO: move it into dedicated parent class valueObject
    Object.freeze(this);
  }

  // TODO: we stop working here
  public static factory(privateKey: string, publicKey: string): Result<SshKey> {
    const privateKeyGuardResult = Guard.againstNullOrUndefined(privateKey, "privateKey");
    if(!privateKeyGuardResult.succeeded) {
      return Result.fail<SshKey>(privateKeyGuardResult.message);
    }
    const publicKeyGuardResult = Guard.againstNullOrUndefined(publicKey, "publicKey");
    if(!publicKeyGuardResult.succeeded) {
      return Result.fail<SshKey>(publicKeyGuardResult.message);
    }
    const publicKeyKeyLenghtGuardResult = Guard.againstZeroSize(publicKey, "publicKey");
    if(!publicKeyKeyLenghtGuardResult.succeeded) {
      return Result.fail<SshKey>(publicKeyKeyLenghtGuardResult.message);
    }
    const privateKeyLenghtGuardResult = Guard.againstZeroSize(privateKey, "privateKey");
    if(!privateKeyLenghtGuardResult.succeeded) {
      return Result.fail<SshKey>(privateKeyLenghtGuardResult.message);
    }

    return Result.ok<SshKey>(new SshKey(privateKey, publicKey));
  }

}
