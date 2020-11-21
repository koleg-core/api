
export class SshKey {
    readonly privateKey: string
    readonly publicKey: string

    constructor(privateKey: string, publicKey: string) {
        if(
            privateKey
            && privateKey.length > 0
        ) {
            this.privateKey = privateKey
        } else {
            throw new Error('Invalid arguement privateKey: string')
        }
        if(
            publicKey
            && publicKey.length > 0
        ) {
            this.publicKey = publicKey
        } else {
            throw new Error('Invalid arguement publicKey: string')
        }
    }
}