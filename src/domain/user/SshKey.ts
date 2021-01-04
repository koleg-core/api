
export class SshKey {

  constructor(
        readonly privateKey: string,
        readonly publicKey: string
  ) {
    if (!privateKey) {
      throw new Error("Invalid argument privateKey: string");
    }

    if (!publicKey) {
      throw new Error("Invalid argument publicKey: string");
    }
  }
}