import { take, map, skipWhile } from 'rxjs/operators';
import { StorageBackend } from '@openid/appauth';
import { isPlatform } from '@ionic/react';
import { Plugins } from '@capacitor/core';
import { IonicAuth, Browser, DefaultBrowser, AuthActions, IAuthAction } from 'ionic-appauth';
import { CapacitorBrowser, CapacitorStorage } from 'ionic-appauth/lib/capacitor';
import { CordovaSecureStorage } from 'ionic-appauth/lib/cordova';

import { AxiosRequestor } from './AxiosService';

const { App } = Plugins;


export class AuthService extends IonicAuth  {
  authConfig = {
    identity_client: 'examplemobile',
    identity_server: 'https://localhost:44369',
    redirect_url: isPlatform('capacitor') ? 'com.appauth.demo://callback' : window.location.origin + '/loginredirect',
    end_session_redirect_url: isPlatform('capacitor') ?  'com.appauth.demo://endSession' : window.location.origin + '/endredirect',
    scopes: 'openid offline_access',
    usePkce: true
  }

  private static authService : AuthService | undefined;

  constructor(
    requestor = new AxiosRequestor(),
    browser : Browser = (isPlatform('capacitor')) ? new CapacitorBrowser() : new DefaultBrowser(), 
    storage : StorageBackend = (isPlatform('capacitor')) ?  new CordovaSecureStorage() : new CapacitorStorage()
  ) {
    super(browser, storage, requestor);
  }

  public async startUpAsync() : Promise<void> {
    if (isPlatform('capacitor')) {
      App.addListener('appUrlOpen', (data: any) => {
        if (data.url !== undefined) {
          this.handleCallback(data.url);
        }
      });
    }

    return super.startUpAsync();
  }

  private handleCallback(callbackUrl: string): void {
    if(this.authConfig){
      if ((callbackUrl).indexOf(this.authConfig.redirect_url) === 0) {
        this.AuthorizationCallBack(callbackUrl);
      }
  
      if ((callbackUrl).indexOf(this.authConfig.end_session_redirect_url) === 0) {
        this.EndSessionCallBack();
      }
    }
  }

  public static get Instance() : AuthService {
    if (!this.authService) {
      this.authService = new AuthService();
    }

    return this.authService;
    
  }


  public isAuthenticated() : Promise<boolean> {
    return this.authObservable.pipe(skipWhile((action : IAuthAction) => action.action === AuthActions.Default),
                                    take(1),
                                    map((action: IAuthAction) => action.tokenResponse !== undefined)).toPromise();
  }
}
