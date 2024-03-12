import express from 'express';
import { AuthController } from '../../controllers';
import { ResponseCode } from '../../utils';
export default class authRoutes {
  public router: express.Router;

  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  protected registerRoutes(): void {
    this.router.post('/signup', async (req, res, next) => {
      try {
        const userResponse = await new AuthController().signup(req.body);
        if (!userResponse.errorMessage) {
          return res
            .status(ResponseCode.HTTP_201_CREATED)
            .send(userResponse.data);
        }
        res.status(userResponse.statusCode || 500).send({
          error: userResponse.errorMessage,
        });
      } catch (error) {
        res.status(ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR).send({
          error: 'An internal error occurs during the signing up.',
        });
      }
    });
    this.router.post('/verify', async (req, res, next) => {
      try {
        const verification = await new AuthController().verifyEmail(req.body);
        if (!verification.errorMessage) {
          return res
            .status(ResponseCode.HTTP_201_CREATED)
            .send(verification.data);
        } else {
          res.status(verification.statusCode || 401).send({
            error: verification.errorMessage,
          });
        }
      } catch (error) {
        res.status(ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR).send({
          error: 'An internal error occurs during verification code.',
        });
      }
    });
    this.router.post('/signin', async (req, res, next) => {
      try {
        const userResponse = await new AuthController().signin(req.body);
        if (!userResponse.errorMessage) {
          return res.send(userResponse.data);
        }
        res.status(userResponse.statusCode || 401).send({
          error: userResponse.errorMessage,
        });
      } catch (error) {
        console.log(error);
        res.status(ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR).send({
          error: 'Signin error, please try again',
        });
      }
    });
    this.router.post('/resend-verification-code', async (req, res, next) => {
      try {
        const result = await new AuthController().resendUserVerificationCode(
          req.body.email
        );
        if (!result.errorMessage) {
          return res.send(result.data);
        } else {
          res.status(result.statusCode || 401).send({
            error: result.errorMessage,
          });
        }
      } catch (error) {
        console.log(error);
        res.status(ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR).send({
          error: 'An error occurs while resending verification code.',
        });
      }
    });
    this.router.post('/forgot-password', async (req, res, next) => {
      try {
        const result = await new AuthController().forgotPassword(req.body);
        if (!result.errorMessage) {
          return res.send(result.data);
        } else {
          res.status(result.statusCode || 401).send({
            error: result.errorMessage,
          });
        }
      } catch (error) {
        console.log(error);
        res.status(ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR).send({
          error: 'An internal error occurs.',
        });
      }
    });
    this.router.post('/reset-password', async (req, res, next) => {
      try {
        const response = await new AuthController().resetPassword(req.body);
        if (response.errorMessage) {
          return res
            .status(response.statusCode || 401)
            .send({ error: response.errorMessage });
        }
        res.send(response.data);
      } catch (error) {
        res.status(ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR).send({
          error: 'An error occurred while trying to reset your password',
        });
      }
    });
    this.router.post('/update-password', async (req, res, next) => {
      try {
        const data = {
          currentPassword: req.body.currentPassword,
          email: req.body.email,
          newPassword: req.body.newPassword,
        };
        const response = await new AuthController().updatePassword(data);
        if (response.errorMessage) {
          return res
            .status(response.statusCode || 401)
            .send({ error: response.errorMessage });
        }
        res.send(response.data);
      } catch (error) {
        res.status(ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR).send({
          error: 'Error updating password, please try again',
        });
      }
    });
  }
}
