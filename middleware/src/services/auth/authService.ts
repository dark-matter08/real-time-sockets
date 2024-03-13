import { APPCONFIGS } from '../../configs';
// import { User } from "../../types";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { SimpleDataService } from '../utils';
import { MailService, ResponseCode, ServiceResponse, Utils } from '../../utils';
import { User } from '../../models';
import { Liquid } from 'liquidjs';
// import axios from 'axios';

const engine = new Liquid({
  root: '/app/src/static/templates',
  extname: '.liquid',
});
export default class AuthService {
  private signToken(email: string) {
    return jwt.sign({ email: email }, APPCONFIGS.JWT.SECRET, {
      expiresIn: APPCONFIGS.JWT.EXPIRATION,
    });
  }

  public decodeToken(bearerToken: string) {
    return jwt.verify(bearerToken, APPCONFIGS.JWT.SECRET);
  }

  private createAuthToken(email: string) {
    const token = this.signToken(email);

    const cookieOptions = {
      expires: new Date(
        Date.now() +
          Number(APPCONFIGS.JWT.COOKIE_EXPIRATION) * 24 * 60 * 60 * 100
      ),
      httpOnly: true,
    };
    //set cookieOptions.secure to true on production environment

    return {
      token,
      cookieOptions,
    };
  }

  private comparePassword(password: string, encryptedPassword: string) {
    return bcrypt.compareSync(password, encryptedPassword);
  }

  private hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    return hash;
  }

  public async signUp(data: {
    email: string;
    password: string;
  }): Promise<ServiceResponse> {
    const { email, password } = data;
    const userByEmail = await this.getUserByEmail(email);

    console.log(userByEmail);

    if (userByEmail) {
      return {
        errorMessage: 'There is already a user with this email',
        statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
      };
    }

    const hashedPassword = this.hashPassword(password);

    const tokenObj = this.createAuthToken(email);

    let code: any, signedCode: any;
    try {
      const result = await new Utils().generateOTP(5);
      code = result.code;
      signedCode = result.signedCode;
    } catch (error) {
      console.log(error);
      return {
        errorMessage:
          'There was an error while trying to generate the otp code.',
        statusCode: ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR,
      };
    }

    // Sends User verification mail
    const text: string = await engine.renderFile('account-verification', {
      otpcode: code,
    });

    const mailResult = await new MailService().sendMail(
      email,
      APPCONFIGS.MAIL.OTP_SUBJECT as string,
      text
    );

    if (!mailResult?.sent === false) {
      console.log(mailResult.error);
      return {
        errorMessage:
          'Error sending verification email, please try again later',
        statusCode: ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR,
      };
    }

    const userObject: User = data;
    userObject.password = hashedPassword;
    userObject.is_verified = false;
    userObject.verification_code = signedCode;

    try {
      const userData = await new SimpleDataService<User>('User').add(
        userObject
      );
      return {
        data: {
          user: userData,
          token: tokenObj.token,
          cookieOptions: tokenObj.cookieOptions,
        },
      };
    } catch (error) {
      return {
        errorMessage: 'request body is not well defined',
        statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
      };
    }
  }

  public async getUserByEmail(email: string) {
    const user = await new SimpleDataService<User>('User').readByQuery({
      filter: {
        email: { _eq: email },
      },

      limit: -1,
    });

    if (!user) {
      return null;
    }

    return user.length > 0 ? user[0] : undefined;
  }

  public async verifyEmail(data: {
    email: string;
    verification_code: string;
  }): Promise<ServiceResponse> {
    const user = await this.getUserByEmail(data.email);

    if (!user) {
      return {
        errorMessage: 'There is no account in our system with this email',
        statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
      };
    }

    if (user['is_verified']) {
      return {
        errorMessage: 'This account has already been verified',
        statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
      };
    }

    try {
      const equal = this.comparePassword(
        data.verification_code,
        user['verification_code']
      );

      console.log(equal);

      if (equal) {
        user['is_verified'] = true;
        const updateUser = await new SimpleDataService<User>('User').update(
          user
        );

        return {
          data: {
            user: updateUser,
            verified: true,
          },
        };
      } else {
        return {
          errorMessage: 'Invalid verification code',
          statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
        };
      }
    } catch (error) {
      return {
        errorMessage: 'Invalid payload format',
        statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
      };
    }
  }

  public async signIn(data: {
    deviceToken?: string;
    email: string;
    password: string;
  }): Promise<ServiceResponse> {
    const user = await this.getUserByEmail(data.email);

    if (!user) {
      return {
        errorMessage: 'There is no account in our system with this email',
        statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
      };
    }

    // if (user.is_google_auth) {
    //   return {
    //     errorMessage: 'This email was registered with google authentication',
    //     statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
    //   };
    // }

    // if (user.is_apple_auth) {
    //   return {
    //     errorMessage: 'This email was registered with apple authentication',
    //     statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
    //   };
    // }

    const equal = this.comparePassword(data.password, user['password']);
    console.log(equal);

    if (!equal) {
      return {
        errorMessage: 'Incorrect email and password combination',
        statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
      };
    }

    let currentDevices = user['devices'];
    let newDevicesList;

    if (!currentDevices) {
      currentDevices = [];
    }

    if (currentDevices?.length >= 5) {
      currentDevices = [];
    }

    if (currentDevices.filter((x) => x === data.deviceToken).length !== 0) {
      newDevicesList = currentDevices;
    } else {
      if (data.deviceToken) {
        newDevicesList = [...currentDevices, data.deviceToken];
      } else {
        newDevicesList = currentDevices;
      }
    }

    user['devices'] = newDevicesList;

    const new_user = await new SimpleDataService<User>('User').update(user);

    if (!user) {
      return {
        errorMessage: 'There is no account in our system with this email',
        statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
      };
    }

    const tokenObj = this.createAuthToken(user['email']);
    return {
      data: {
        user: new_user,
        token: tokenObj.token,
        cookieOptions: tokenObj.cookieOptions,
      },
    };
  }

  public async forgotPassword(email: string): Promise<ServiceResponse> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      return {
        errorMessage: 'There is no account in our system with this email',
        statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
      };
    }

    let code: any, signedCode: any;
    try {
      const result = await new Utils().generateOTP(5);
      code = result.code;
      signedCode = result.signedCode;
    } catch (error) {
      console.log(error);
      return {
        errorMessage:
          'There was an error while trying to generate the otp code.',
        statusCode: ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR,
      };
    }

    // Sends User verification mail
    const text: string = await engine.renderFile('account-verification', {
      otpcode: code,
    });

    const mailResult = await new MailService().sendMail(
      email,
      APPCONFIGS.MAIL.OTP_SUBJECT as string,
      text
    );

    if (!mailResult?.sent === false) {
      console.log(mailResult.error);
      return {
        errorMessage:
          'Error sending verification email, please try again later',
        statusCode: ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR,
      };
    }

    let updatedUser: User;

    user['verification_code'] = signedCode;
    user['is_verified'] = false;

    try {
      updatedUser = await new SimpleDataService<User>('User').update(user);

      if (!updatedUser) {
        return {
          errorMessage: 'There was an error sending reset token for password',
          statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
        };
      } else {
        return {
          data: { user: updatedUser },
        };
      }
    } catch (error) {
      return {
        errorMessage: 'request body is not well defined',
        statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
      };
    }
  }

  public async resendUserVerificationCode(
    email: string
  ): Promise<ServiceResponse> {
    const user: User | undefined = await this.getUserByEmail(email);
    if (!user) {
      return {
        errorMessage: 'There is no account in our system with this email',
        statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
      };
    }

    if (user?.is_verified) {
      return {
        errorMessage: 'This account has already been verified',
        statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
      };
    }
    user.is_verified = false;

    let code: any, signedCode: any;
    try {
      const result = await new Utils().generateOTP(5);
      code = result.code;
      signedCode = result.signedCode;
    } catch (error) {
      console.log(error);
      return {
        errorMessage:
          'There was an error while trying to generate the otp code.',
        statusCode: ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR,
      };
    }
    // Sends User verification mail
    const text: string = await engine.renderFile('account-verification', {
      otpcode: code,
    });

    const mailResult = await new MailService().sendMail(
      email,
      APPCONFIGS.MAIL.OTP_SUBJECT as string,
      text
    );

    if (!mailResult?.sent === false) {
      console.log(mailResult.error);
      return {
        errorMessage:
          'Error sending verification email, please try again later',
        statusCode: ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR,
      };
    }

    user.verification_code = signedCode;
    const updatedUser = await new SimpleDataService<User>('User').update(user);

    try {
      if (!updatedUser) {
        return {
          errorMessage: 'There was an error sending reset token for password',
          statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
        };
      } else {
        return {
          data: { user: updatedUser },
        };
      }
    } catch (error) {
      return {
        errorMessage: 'request body is not well defined',
        statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
      };
    }
  }

  public async resetPassword(data: {
    email: string;
    password: string;
  }): Promise<ServiceResponse> {
    const user = await this.getUserByEmail(data.email);
    if (!user) {
      return {
        errorMessage: 'There is no account in our system with this email',
        statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
      };
    }

    if (!user['is_verified']) {
      return {
        errorMessage: 'User email has not been verified',
        statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
      };
    }

    const hashedPassword = this.hashPassword(data.password);

    user['password'] = hashedPassword;

    const tokenObj = this.createAuthToken(user['email']);

    const userData = await new SimpleDataService<User>('User').update(user);

    return {
      data: {
        user: userData,
        token: tokenObj.token,
        cookieOptions: tokenObj.cookieOptions,
      },
    };
  }

  public async updatePassword(data: {
    currentPassword: string;
    email: string;
    newPassword: string;
  }): Promise<ServiceResponse> {
    const { currentPassword, newPassword, email } = data;

    const user = await this.getUserByEmail(email);

    if (!user) {
      return {
        statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
        errorMessage: 'User with the email not found',
      };
    }

    if (!this.comparePassword(currentPassword, user?.['password'])) {
      return {
        errorMessage: 'your current password is incorrect',
        statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
      };
    }

    const hashedPassword = this.hashPassword(newPassword);

    user['password'] = hashedPassword;

    const tokenObj = this.createAuthToken(user?.['email']);

    const userData = await new SimpleDataService<User>('User').update(user);

    return {
      data: {
        user: userData,
        token: tokenObj.token,
        cookieOptions: tokenObj.cookieOptions,
      },
    };
  }
}
