import { ExpressMiddlewareInterface } from 'routing-controllers';
import { Inject } from "typedi";
import { AuthService } from './auth.service';

export class CheckJwtMiddleware implements ExpressMiddlewareInterface {

  @Inject("auth.service")
  public authService: AuthService;

  public use(request: any, response: any, next?: (err?: any) => any): any {
    this.authService.checkJwt(request, response, next);
  }
}