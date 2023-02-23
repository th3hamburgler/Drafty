import { helper } from '@ember/component/helper';
import isProd from '../utils/is-production';

export default helper(function isProduction(/*params, hash*/) {
  return isProd();
});
