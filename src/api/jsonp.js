/* eslint-env browser */
import qs from 'qs';

const DEFAULT_TIMEOUT = 5000;
/**
 * JSONP using fetch, and automatically resolve via res.json()
 * @see https://github.com/camsong/fetch-jsonp/blob/master/src/fetch-jsonp.js
 * @return Promise<data>
 */
export default function jsonp(url, query, options = {}) {
  let api = url;
  if (query) {
    api += `?${qs.stringify(query)}`;
  }

  const callbackFn = generateCallbackFn();
  // Find callbackFn "variables" with $ prefix: $callbackFn
  // We use %24 because it was encoded by qs.stringify method.
  if (api.indexOf('%24callbackFn') !== -1) {
    api = api.replace('%24callbackFn', callbackFn);
  }

  let timeoutId;
  const timeout = options.timeout || DEFAULT_TIMEOUT;

  return new Promise((resolve, reject) => {
    window[callbackFn] = res => {
      resolve(res);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      cleanup(callbackFn);
    };

    const jsonpScript = document.createElement('script');
    jsonpScript.setAttribute('src', api);
    jsonpScript.id = `script-${callbackFn}`;
    document.getElementsByTagName('head')[0].appendChild(jsonpScript);

    timeoutId = setTimeout(() => {
      reject(new Error(`JSONP request to ${api} timed out`));
      cleanup(callbackFn);
    }, timeout);
  });
}

function generateCallbackFn() {
  return `fetch_jsonp_${new Date().getTime()}_${Math.ceil(
    Math.random() * 100000,
  )}`;
}

function cleanup(fn) {
  window[fn] = undefined;
  const script = document.getElementById(`script-${fn}`);
  document.getElementsByTagName('head')[0].removeChild(script);
}
