import { Request, Response } from "express";

export class GroupsController {
  public index(req: Request, res: Response) {
    res.json({
      message: "Hello boi"
    });
  }
}