import Keycloak from 'keycloak-js';

export class KeycloakService {
  public static keycloakInstance: Keycloak;

  public static init(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        KeycloakService.keycloakInstance = new Keycloak({
          url: 'http://localhost:8180',
          realm: 'Laplumevirtuelle-realm',
          clientId: 'angular-app-LPV'
        });

        await KeycloakService.keycloakInstance.init({
            onLoad: 'check-sso', 
            checkLoginIframe: false
          });

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  public static getToken(): string | undefined {
    return KeycloakService.keycloakInstance.token;
  }

  public static getRoles(): string[] {
    return KeycloakService.keycloakInstance.tokenParsed?.realm_access?.roles || [];
  }
  
  public static login(): void {
    KeycloakService.keycloakInstance.login({
      redirectUri: window.location.origin
    });
  }

  public static register(options: any): void {
    KeycloakService.keycloakInstance.register({
      redirectUri: window.location.origin + '/auth/register-success',
      ...options
    });
  }

  public static logout(): void {
    KeycloakService.keycloakInstance.logout();
  }
}
