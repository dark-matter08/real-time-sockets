import express from 'express';
import { AuthController } from '../../controllers';
import { ResponseCode } from '../../utils';
export default class authRoutes {
  public router: express.Router;
  private authController: AuthController;

  constructor() {
    this.router = express.Router();
    this.registerRoutes();
    this.authController = new AuthController();
  }

  protected registerRoutes(): void {
    this.router.post('/signup', async (req, res, _next) => {
      try {
        const userResponse = await this.authController.signup(req.body);
        if (!userResponse.errorMessage) {
          return res
            .status(ResponseCode.HTTP_201_CREATED)
            .send(userResponse.data);
        }
        return res.status(userResponse.statusCode || 500).send({
          error: userResponse.errorMessage,
        });
      } catch (error) {
        console.log(error);

        return res.status(ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR).send({
          error: 'An internal error occurs during the signing up.',
        });
      }
    });
    this.router.post('/verify', async (req, res, _next) => {
      try {
        const verification = await this.authController.verifyEmail(req.body);
        if (!verification.errorMessage) {
          return res
            .status(ResponseCode.HTTP_201_CREATED)
            .send(verification.data);
        } else {
          return res.status(verification.statusCode || 401).send({
            error: verification.errorMessage,
          });
        }
      } catch (error) {
        return res.status(ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR).send({
          error: 'An internal error occurs during verification code.',
        });
      }
    });
    this.router.post('/signin', async (req, res, _next) => {
      try {
        const userResponse = await this.authController.signin(req.body);
        if (!userResponse.errorMessage) {
          return res.send(userResponse.data);
        }
        return res.status(userResponse.statusCode || 401).send({
          error: userResponse.errorMessage,
        });
      } catch (error) {
        console.log(error);
        return res.status(ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR).send({
          error: 'Signin error, please try again',
        });
      }
    });
    this.router.post('/resend-verification-code', async (req, res, _next) => {
      try {
        const result = await this.authController.resendUserVerificationCode(
          req.body.email
        );
        if (!result.errorMessage) {
          return res.send(result.data);
        } else {
          return res.status(result.statusCode || 401).send({
            error: result.errorMessage,
          });
        }
      } catch (error) {
        console.log(error);
        return res.status(ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR).send({
          error: 'An error occurs while resending verification code.',
        });
      }
    });
    this.router.post('/forgot-password', async (req, res, _next) => {
      try {
        const result = await this.authController.forgotPassword(req.body);
        if (!result.errorMessage) {
          return res.send(result.data);
        } else {
          return res.status(result.statusCode || 401).send({
            error: result.errorMessage,
          });
        }
      } catch (error) {
        console.log(error);
        return res.status(ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR).send({
          error: 'An internal error occurs.',
        });
      }
    });
    this.router.post('/reset-password', async (req, res, _next) => {
      try {
        const response = await this.authController.resetPassword(req.body);
        if (response.errorMessage) {
          return res
            .status(response.statusCode || 401)
            .send({ error: response.errorMessage });
        }
        return res.send(response.data);
      } catch (error) {
        return res.status(ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR).send({
          error: 'An error occurred while trying to reset your password',
        });
      }
    });
    this.router.post('/update-password', async (req, res, _next) => {
      try {
        const data = {
          currentPassword: req.body.currentPassword,
          email: req.body.email,
          newPassword: req.body.newPassword,
        };
        const response = await this.authController.updatePassword(data);
        if (response.errorMessage) {
          return res
            .status(response.statusCode || 401)
            .send({ error: response.errorMessage });
        }
        return res.send(response.data);
      } catch (error) {
        return res.status(ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR).send({
          error: 'Error updating password, please try again',
        });
      }
    });
  }
}
