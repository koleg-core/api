import { v4 as uuid } from 'uuid'

import { Password } from './Password'
import { PhoneNumber } from './PhoneNumber'
import { SshKey } from './SshKey'
import { UserIdentity } from './UserIdentity'

class User {
  private _uuid: string
  private _firstname: string
  private _identity: UserIdentity
  private _currentPassword: Password
  private _passwordHistory: Password[]
  private _birthDate: Date
  private _phoneNumbers: PhoneNumber[]
  private _imgUrl: string
  private _sshKey: SshKey
  private _job: string
  private _creationDate: Date
  private _updateDate: Date
  private _expirationDate: Date

  constructor(
    identity: UserIdentity,
    password: Password,
    birthDate: Date,
    phoneNumbers: PhoneNumber[],
    imgUrl: string = null,
    sshKey: SshKey,
    job: string,
    expirationDate: Date = null
  ) {
    const now = new Date()
    this._uuid = uuid()
    this._identity = identity
    this._currentPassword = password
    this._passwordHistory.push(this._currentPassword)
    this._birthDate = birthDate
    this._phoneNumbers = phoneNumbers
    this._imgUrl = imgUrl
    this._sshKey = sshKey
    this._job = job
    this._birthDate = birthDate
    this._updateDate = now
    this._creationDate = now
    this._expirationDate = expirationDate // null mean that user don't expire
  }
  get updateDate() {return this._updateDate}
  private _update() {
    const now = new Date()
    this._updateDate = now
  }

  get identity() { return this._identity }
  set identity(identity: UserIdentity) {
    if(identity) {
      this._identity = identity
      this._update()
    }
    throw new Error('Invalid arguement identity: UserIdentity')
  }

  get password() { return this._currentPassword }
  set password(password: Password) {
    if(
      password
      && !this._isPasswordAlreadyUsed(password)
    ) {
      this._passwordHistory.push(this._currentPassword)
      this._currentPassword = password
      this._update()
    }
    throw new Error('Invalid arguement mappassword: Password')
  }

  get job() { return this._job }
  set job(job: string) {
    this._job = job
  }

  get sshKey() { return this._sshKey }
  set sshKey(sshKey: SshKey) {
    this._sshKey = sshKey
    this._update()
  }

  private _isPasswordAlreadyUsed(password: Password): boolean {
    for(let i = 0; this._passwordHistory.length > i; i++) {
      const histPasword: Password = this._passwordHistory[i]
      if(histPasword.hasSameValue(password) === true) {
        return true
      }
    }
    return false
  }

  public isExpired(): boolean {
    const now = new Date()
    if( this._expirationDate && this._expirationDate < now) {
      return true
    }
    return false
  }

  public canLogin(
    password: string,
    declinedIdentity: string
  ): boolean {
    if(
      this.identity.control(declinedIdentity)
      && this.password.isValid(password)
      && !this.isExpired()
    ) {
      return true
    }
    return false
  }

  public putPhoneNumber(phoneNumber: PhoneNumber): number {
    if(!phoneNumber) {
      throw new Error('Invalid arguement phoneNumber: is null')
    }

    let registeredPhoneNumber: PhoneNumber

    for(let i = 0; this._phoneNumbers.length > i; i++) {
      registeredPhoneNumber = this._phoneNumbers[i]
      if(
        phoneNumber
        && phoneNumber.value === registeredPhoneNumber.value
      ) {
        registeredPhoneNumber = phoneNumber
        this._update()
        return 0
      }
    }
    this._phoneNumbers.push(phoneNumber)
    this._update()
    return 1
  }

  public removePhoneNumber(phoneNumber: PhoneNumber): number {
    if(!phoneNumber) {
      throw new Error('Invalid arguement phoneNumber: is null')
    }

    let registeredPhoneNumber: PhoneNumber

    for(let i = 0; this._phoneNumbers.length > i; i++) {
      registeredPhoneNumber = this._phoneNumbers[i]

      if(phoneNumber.value === registeredPhoneNumber.value ) {
        this._phoneNumbers.splice(i, 1)
        this._update()
        return 0
      }
    }
    return -1
  }
}