import ENV from '../config/environment';

export default function isProduction() {
  return ENV.environment === 'production';
}
