import { Passport } from "passport";
import {
  Strategy as JwtStrategy,
  ExtractJwt
} from "passport-jwt";
import {
  Strategy as LocalStrategy,
  IVerifyOptions
} from "passport-local";

import { UserProperties } from '../../../domain/user/UserProperties'
import { Organisation } from "../../../domain/Organisation";
import { OrganisationRepository } from "../../../domain/OrganisationRepository";

import { Strategy } from "./strategy.enum";

export class AuthService {
  private _passport = new Passport();

  constructor(private _repository: OrganisationRepository) {
    if (!this._repository) {
      throw new Error('Invalid argument repository: OrganisationRepository is not defined.');
    }
  }

  public addAuthKind(authType: Strategy): void {
    switch (authType) {
      case Strategy.LOGIN: {
        this._passport.use(new LocalStrategy(
          (userIdentifier: string,
            password: string,
            done: (
              error: unknown,
              user?: UserProperties,
              options?: IVerifyOptions
            ) => void
          ) => {
            try {
              const organisation: Organisation = this._repository.read();
              const userId: string = organisation.getUserByIdentifier(userIdentifier);
              if (!userId) {
                return done(null, null, { message: "User not found" });
              }

              if (!organisation.verifyUserPassword(userId, password)) {
                return done(null, null, { message: "User password was invalid" });
              }

              return done(null, organisation.getUserPropertiesById(userId));
            } catch (err) {
              if (err) {
                return done(err, null, { message: "Internal servor error"});
              }
            }
          }
        ));
        break;
      }
      case Strategy.JWT: {
        const opts = {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: 'secret', // TODO find way to give secret from configs
          issuer: 'kwt issuer',
          audience: 'localhost:8080' // TODO find way to give it from config
        }
        this._passport.use(new JwtStrategy(
          opts,
          async (token, done) => {
            try {
              return done(null, token.user);
            } catch (error) {
              done(error);
            }
          }
        ))
        break;
      }
    }
  }

  public login(
    identifier: string,
    password: string,
    done: (
      error: unknown,
      user?: UserProperties,
      options?: IVerifyOptions
    ) => void): void {
    this._passport.authenticate('login', done);
  }
}