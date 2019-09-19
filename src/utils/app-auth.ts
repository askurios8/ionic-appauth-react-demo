import { isPlatform } from '@ionic/react';
import { Plugins, AppLaunchUrl } from '@capacitor/core';
import { IonicAuth, IonicAuthorizationRequestHandler, Browser, DefaultBrowser, IAuthAction } from 'ionic-appauth';
import { CapacitorBrowser, CapacitorStorage } from 'ionic-appauth/lib/capacitor';
import { CordovaSecureStorage } from 'ionic-appauth/lib/cordova';

import { AxiosRequestor } from './axios-requestor';

const { App } = Plugins;

export class IonicAppAuth extends IonicAuth  {
    private onSuccessFunc: Function = (action: IAuthAction) => {};
    private onFailureFunc: Function = (action: IAuthAction) => {};
    private static instance: IonicAppAuth;

    public static async getInstance(onSuccessFunc?: Function, onFailureFunc?: Function) {
      if (IonicAppAuth.instance) {
        return IonicAppAuth.instance;
      }
      
      return await IonicAppAuth.buildInstance(onSuccessFunc, onFailureFunc);
    }

    public static async buildInstance(onSuccessFunc?: Function, onFailureFunc?: Function){
      let appAuth = new IonicAppAuth();

      if(onSuccessFunc && onFailureFunc){
        appAuth.setEventFunctions(onSuccessFunc, onFailureFunc);
      }
      
      await appAuth.startUpAsync();
      IonicAppAuth.instance = appAuth;

      return appAuth;
    }

    constructor(
        requestor = new AxiosRequestor(),
        browser : Browser = (isPlatform('mobile') && !isPlatform('mobileweb')) ? new CapacitorBrowser() : new DefaultBrowser(), 
        storage : CapacitorStorage = new CapacitorStorage(),
        secureStorage : CordovaSecureStorage = new CordovaSecureStorage()
    ){
      super(
        (isPlatform('mobile') && !isPlatform('mobileweb')) ? new CapacitorBrowser() : undefined,
        (isPlatform('mobile') && !isPlatform('mobileweb')) ? secureStorage : storage, 
        requestor, undefined, undefined,
        (isPlatform('mobile') && !isPlatform('mobileweb')) ? new IonicAuthorizationRequestHandler(browser, secureStorage) : new IonicAuthorizationRequestHandler(browser, storage),
      );
  
      this.addConfig();
    }
  
    public async startUpAsync() {
      this.authObservable.subscribe();

      if(isPlatform('mobile') && !isPlatform('mobileweb')){
        let appLaunchUrl : AppLaunchUrl = await App.getLaunchUrl();
        if(appLaunchUrl.url !== undefined)
          this.handleCallback(appLaunchUrl.url);
      }
      
      super.startUpAsync();
    }
  
    private addConfig(){
      if(isPlatform('mobile') && !isPlatform('mobileweb')){
        this.authConfig = { 
          identity_client: 'appAuthCode', 
          identity_server: 'http://192.168.0.152:50281/', 
          redirect_url: 'com.appauth.demo://callback', 
          scopes: 'openid offline_access',
          usePkce: true, 
          end_session_redirect_url: 'com.appauth.demo://endSession', 
        }
      }else{
        this.authConfig = { 
          identity_client: 'appAuthCode', 
          identity_server: 'http://192.168.0.152:50281/', 
          redirect_url: 'http://localhost:8100/implicit/authcallback', 
          scopes: 'openid offline_access',
          usePkce: true,
          end_session_redirect_url: 'http://localhost:8100/implicit/endsession', 
        }
      }
    }
  
    private handleCallback(callbackUrl: string): void {
      if(this.authConfig){
        if ((callbackUrl).indexOf(this.authConfig.redirect_url) === 0){
          this.AuthorizationCallBack(callbackUrl);
        }
        
        if ((callbackUrl).indexOf(this.authConfig.end_session_redirect_url) === 0){
          this.EndSessionCallBack();
        }
      }
    }

    private setEventFunctions(onSuccessFunc : Function, onFailureFunc : Function){

    }
  
    protected onSignInSuccessful(action : IAuthAction): void {
      this.onSuccessFunc(action);
    }

    protected onSignOutSuccessful(action : IAuthAction): void {
      this.onFailureFunc(action);
    }

    protected onRefreshSuccessful(action : IAuthAction): void {
      this.onSuccessFunc(action);
    }

    protected onSignInFailure(action : IAuthAction): void {
      this.onFailureFunc(action);
    }

    protected onSignOutFailure(action : IAuthAction): void {
      this.onFailureFunc(action);
    }

    protected onRefreshFailure(action : IAuthAction): void {
      this.onFailureFunc(action);
    }
}
