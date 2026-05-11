/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require('path');

function forEachRule(rules, fn) {
  if (!rules) {
    return;
  }
  for (const rule of rules) {
    if (rule.oneOf) {
      forEachRule(rule.oneOf, fn);
    }
    fn(rule);
  }
}

module.exports = config => {
  forEachRule(config.module.rules, rule => {
    const uses = rule.use;
    if (!uses) {
      return;
    }
    const list = Array.isArray(uses) ? uses : [uses];
    for (const entry of list) {
      if (typeof entry === 'string') {
        continue;
      }
      const name = entry.loader || '';
      if (name.includes('sass-loader')) {
        entry.options = {
          ...(entry.options || {}),
          implementation: require('sass'),
        };
      }
      if (name === 'css-loader' || name.endsWith('/css-loader')) {
        const prev = entry.options || {};
        const prevModules = prev.modules;
        const mergedModules =
          prevModules &&
          typeof prevModules === 'object' &&
          !Array.isArray(prevModules)
            ? { ...prevModules, localIdentName: '[local]-[hash:base64:5]' }
            : { mode: 'local', localIdentName: '[local]-[hash:base64:5]' };
        entry.options = {
          ...prev,
          modules: mergedModules,
          localsConvention: 'camelCase',
        };
      }
    }
  });

  config.resolve.alias['static'] = path.resolve(__dirname, 'static');
  config.resolve.alias['@'] = process.env.AT_ROOT || path.resolve(__dirname);
  config.resolve.alias['@the-colors'] = process.env.COLORS_JS_FILE
    || path.resolve(__dirname, 'src/common/colors.js');

  return config;
};
