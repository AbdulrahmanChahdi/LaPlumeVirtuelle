import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'http://localhost:8180/realms/Laplumevirtuelle-realm',
  redirectUri: window.location.origin + '/dashboard',
  clientId: 'angular-client', // le client-id configuré dans Keycloak
  responseType: 'code',
  scope: 'openid profile email',
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
};
