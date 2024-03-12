/* eslint-disable indent */
import { AuthService } from '../../services';
import { ResponseCode, ServiceResponse } from '../../utils';
import { Body, Example, Post, Route, Tags } from 'tsoa';
import { APPCONFIGS } from '../../configs';
import { User } from '../../models';

@Route('/api/auth')
@Tags('Auth Controller')
export default class AuthController {
  @Post('/signup')
  public async signup(
    @Body() data: { email: string; password: string }
  ): Promise<ServiceResponse> {
    return new AuthService().signUp(data);
  }
  @Post('/verify')
  public async verifyEmail(
    @Body() data: { email: string; verification_code: string }
  ): Promise<ServiceResponse> {
    return new AuthService().verifyEmail(data);
  }
  @Post('/signin')
  public async signin(
    @Body() data: { deviceToken?: string; email: string; password: string }
  ): Promise<ServiceResponse> {
    return new AuthService().signIn(data);
  }
  @Post('/forgot-password')
  public async forgotPassword(
    @Body() data: { email: string }
  ): Promise<ServiceResponse> {
    return new AuthService().forgotPassword(data.email);
  }
  @Post('/resend-verification-code')
  public async resendUserVerificationCode(
    @Body() email: string
  ): Promise<ServiceResponse> {
    return new AuthService().resendUserVerificationCode(email);
  }
  @Post('/reset-password')
  public async resetPassword(
    @Body()
    data: {
      email: string;
      password: string;
    }
  ): Promise<ServiceResponse> {
    return new AuthService().resetPassword(data);
  }
  @Post('/update-password')
  public async updatePassword(
    @Body()
    data: {
      currentPassword: string;
      email: string;
      newPassword: string;
    }
  ): Promise<ServiceResponse> {
    return new AuthService().updatePassword(data);
  }
}
