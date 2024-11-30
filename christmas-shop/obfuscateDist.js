import fs from 'fs';
import path from 'path';
import JavaScriptObfuscator from 'javascript-obfuscator';

function traverse(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      traverse(filePath);
    } else if (path.extname(file) === '.js') {
      const code = fs.readFileSync(filePath, 'utf8');
      const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, {
        compact: true,
        controlFlowFlattening: false, // sourcemap troubleshoot
        controlFlowFlatteningThreshold: 0.75,
        deadCodeInjection: false, // sourcemap troubleshoot
        deadCodeInjectionThreshold: 0.4,
        stringArrayThreshold: 0.4,
        stringArray: true,
        rotateStringArray: true,
        renameGlobals: false,
        selfDefending: true,
        debugProtection: true,
        debugProtectionInterval: 2000,
        transformObjectKeys: true,
        log: false,
      }).getObfuscatedCode();
      fs.writeFileSync(filePath, obfuscatedCode);
    }
  });
}

traverse('dist');
