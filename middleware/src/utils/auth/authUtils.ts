import { NextFunction, Request, Response } from "express";
import { ResponseCode } from "../response-code";
import { AuthService } from "../../services";

export default class AuthUtils {
  /**
   * Verify the user token and gets the authenticated user's email from header (only continue if valid Login)
   *
   * @param {Request} request
   * @param {Response} response
   * @param {NextFunction} next
   */
  public async verifyLoggedInUser(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const pathFragment = "/webhook";
    // Except webhook endpoints.
    if (request.path.includes(pathFragment)) return next();
    console.log(request.headers, request.cookies);
    if (!request.headers.authorization) {
      response
        .status(ResponseCode.HTTP_401_UNAUTHORIZED)
        .send({ error: "Unauthorized, token missing" });
    } else {
      const bearerToken = request.headers.authorization.split("Bearer ")[1];
      try {
        const result = new AuthService().decodeToken(bearerToken as string);
        response.locals["email"] = result["email"];
        next();
      } catch (err) {
        response
          .status(ResponseCode.HTTP_401_UNAUTHORIZED)
          .send({ error: `rejected token: ${bearerToken}` });
      }
    }
  }
}
