
export class SshKey {

  constructor(
        readonly privateKey: string,
        readonly publicKey: string
  ) {
    if (!privateKey && publicKey) {
      throw new Error("Invalid argument privateKey: string");
    }

    if (!publicKey && privateKey) {
      throw new Error("Invalid argument publicKey: string");
    }
  }
}