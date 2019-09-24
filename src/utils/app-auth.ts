import { isPlatform } from '@ionic/react';
import { Plugins, AppLaunchUrl } from '@capacitor/core';
import { IonicAuthorizationRequestHandler, Browser, DefaultBrowser, IAuthAction } from 'ionic-appauth';
import { IonicAuth } from './ionic-auth';
import { CapacitorBrowser, CapacitorStorage } from 'ionic-appauth/lib/capacitor';
import { CordovaSecureStorage } from 'ionic-appauth/lib/cordova';

import { AxiosRequestor } from './axios-requestor';
import { StorageBackend } from '@openid/appauth';

const { App } = Plugins;

export class IonicAppAuth extends IonicAuth  {
    private onSuccessFunc: Function = (action: IAuthAction) => {console.log(JSON.stringify(action))};
    private onFailureFunc: Function = (action: IAuthAction) => {console.log(JSON.stringify(action))};

    public static buildInstance(onSuccessFunc?: Function, onFailureFunc?: Function){
      let appAuth = new IonicAppAuth();

      if(onSuccessFunc && onFailureFunc){
        appAuth.setEventFunctions(onSuccessFunc, onFailureFunc);
      }
      return appAuth;
    }

    constructor(
        requestor = new AxiosRequestor(),
        browser : Browser = (isPlatform('mobile') && !isPlatform('mobileweb')) ? new CapacitorBrowser() : new DefaultBrowser(), 
        storage : StorageBackend = (isPlatform('mobile') && !isPlatform('mobileweb')) ? new CapacitorStorage() : new CordovaSecureStorage()
    ){
      super(browser, storage, requestor,undefined, undefined,
            (isPlatform('mobile') && !isPlatform('mobileweb')) ? new IonicAuthorizationRequestHandler(browser, storage) : new IonicAuthorizationRequestHandler(browser, storage)
      );
  
      this.addConfig();
    }
  
    public async PageLoadAsync() {
      if(isPlatform('mobile') && !isPlatform('mobileweb')){
        let appLaunchUrl : AppLaunchUrl = await App.getLaunchUrl();
        if(appLaunchUrl.url !== undefined)
          this.handleCallback(appLaunchUrl.url);
      }
      console.log("startup")
             //subscribing to auth observable for event hooks
             this.authObservable.subscribe((action : IAuthAction) => {
              console.log("sub");
              console.log(JSON.stringify(action));
             });
      this.startUpAsync();
    }
  
    private addConfig(){
      if(isPlatform('mobile') && !isPlatform('mobileweb')){
        this.authConfig = { 
          identity_client: 'appAuthCode', 
          identity_server: 'http://localhost:50281/', 
          redirect_url: 'com.appauth.demo://callback', 
          scopes: 'openid offline_access',
          usePkce: true, 
          end_session_redirect_url: 'com.appauth.demo://endSession', 
        }
      }else{
        this.authConfig = { 
          identity_client: 'appAuthCode', 
          identity_server: 'http://localhost:50281/', 
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
      // this.onSuccessFunc = onSuccessFunc;
      // this.onFailureFunc = onFailureFunc;
    }
  
    protected onSignInSuccessful(action : IAuthAction): void {
      console.log("onSignInSuccessful")
      console.log(action);
      this.onSuccessFunc(action);
    }

    protected onSignOutSuccessful(action : IAuthAction): void {
      console.log("onSignOutSuccessful")
      console.log(action);
      this.onFailureFunc(action);
    }

    protected onRefreshSuccessful(action : IAuthAction): void {
      console.log("onRefreshSuccessful")
      console.log(action);
      this.onSuccessFunc(action);
    }

    protected onSignInFailure(action : IAuthAction): void {
      console.log("onSignInFailure")
      console.log(action);
      this.onFailureFunc(action);
    }

    protected onSignOutFailure(action : IAuthAction): void {
      console.log("onSignOutFailure")
      console.log(action);
      this.onFailureFunc(action);
    }

    protected onRefreshFailure(action : IAuthAction): void {
      console.log("onRefreshFailure")
      console.log(action);
      this.onFailureFunc(action);
    }
}
