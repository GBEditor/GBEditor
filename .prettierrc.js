/*
 * @Description: your description
 * @Module: module.name
 * @Author: Draco
 * @Email: Draco.coder@gmail.com
 * @Github: https://github.com/draco-china
 * @Date: 2019-10-21 18:20:40
 * @LastEditTime: 2019-10-21 18:42:22
 */
const fabric = require('@umijs/fabric');

module.exports = {
  ...fabric.stylelint,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  proseWrap: 'never',
};
