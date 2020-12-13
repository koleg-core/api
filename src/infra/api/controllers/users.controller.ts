import { Request, Response } from "express";
import { OrganisationRepository } from "../../../domain/OrganisationRepository";

export class UsersController {
  public index(req: Request, res: Response): void {
    res.json({
      message: "Hello boi"
    });
  }
}

