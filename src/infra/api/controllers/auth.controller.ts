import { Request, Response } from "express";

export class AuthController {

  public login(req: Request, res: Response) {
    res.json({
      message: "login"
    })
  }

  public logout(req: Request, res: Response) {
    res.json({
      message: "logout"
    })
  }
}