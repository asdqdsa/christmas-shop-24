// obfuscatorPlugin.js
import JavaScriptObfuscator from 'javascript-obfuscator';

export default function obfuscatorPlugin() {
  return {
    name: 'vite-obfuscator',
    transform(code, id) {
      if (id.endsWith('.js')) {
        return JavaScriptObfuscator.obfuscate(code, {
          sourceMap: true,
          compact: true,
          controlFlowFlattening: true, // sourcemap troubleshoot
          controlFlowFlatteningThreshold: 0.75,
          deadCodeInjection: true, // sourcemap troubleshoot
          deadCodeInjectionThreshold: 0.4,
          stringArrayThreshold: 0.4,
          stringArray: true,
          rotateStringArray: true,
          renameGlobals: true,
          selfDefending: true,
          debugProtection: false,
          debugProtectionInterval: 2000,
          transformObjectKeys: true,
          log: false,
        }).getObfuscatedCode();
      }
      return {
        code: JavaScriptObfuscator.code,
        map: JavaScriptObfuscator.map,
      };
    },
  };
}
