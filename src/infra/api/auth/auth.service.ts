import { Passport } from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer"
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

    private _checkAuth(token: string): boolean {
        const organisation: Organisation = this._repository.read()
        return organisation.isTokenValid(token);
    }

    public addAuthKind(authType: Strategy): void {
        if (authType === Strategy.BEARER) {
            this._passport.use(new BearerStrategy(
                (token, done) => {
                    if (this._checkAuth(token))
                        done(null);
                    else
                        done("Error: nobody owns this token");
                }
                // (token, done) => {
                // User.findOne({ token: token }, function (err, user) {
                //   if (err) { return done(err); }
                //   if (!user) { return done(null, false); }
                //   return done(null, user, { scope: 'all' });
                // });
                // }
            ));
        }
    }
}