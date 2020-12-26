
export class SshKey {

  constructor(
        readonly privateKey: string,
        readonly publicKey: string
  ) {
    if (!privateKey) {
      throw new Error('Invalid arguement privateKey: string')
    }

    if (!publicKey) {
      throw new Error('Invalid arguement publicKey: string')
    }
  }
}