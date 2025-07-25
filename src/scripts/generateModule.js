// src/scripts/generateModule.js

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const {
  getEntityContent,
  getReceivedDtoContent,
  getReturnedDtoContent,
} = require('./template');

const moduleName = process.argv[2];

const rootDir = path.resolve(__dirname, '../../');
const modulePath = path.join(rootDir, 'src/modules', moduleName);

if (!moduleName) {
  console.error('❌ Veuillez fournir un nom de module.');
  console.error('Exemple : npm run generate-module users');
  process.exit(1);
}

// Génération dans le bon dossier (ex: /modules/users)
const targetPath = `modules/${moduleName}`;

// remove s at the end of the module name if it exists
const moduleNameWithoutS =
  moduleName.charAt(0).toLowerCase() + moduleName.slice(1).replace(/s$/, '');

const moduleNameWithUpperCase =
  moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

// remove 's' at the end of the module name if it exists
const finaleModuleName = moduleNameWithUpperCase.endsWith('s')
  ? moduleNameWithUpperCase.slice(0, -1)
  : moduleNameWithUpperCase;

const createCommands = [
  `nest g module ${targetPath}`,
  `nest g controller ${targetPath}`,
  `nest g service ${targetPath}`,
];

try {
  createCommands.forEach((cmd) => {
    console.log(`▶️ ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });
  });

  if (!fs.existsSync(modulePath)) {
    fs.mkdirSync(modulePath, { recursive: true });
  }

  const dtoDir = path.join(modulePath, 'DTO');
  if (!fs.existsSync(dtoDir)) {
    fs.mkdirSync(dtoDir);
  }

  fs.writeFileSync(
    path.join(modulePath, `${moduleNameWithoutS}.entity.ts`),
    getEntityContent(finaleModuleName),
  );
  fs.writeFileSync(
    path.join(dtoDir, `received${finaleModuleName}.dto.ts`),
    getReceivedDtoContent(finaleModuleName),
  );
  fs.writeFileSync(
    path.join(dtoDir, `returned${finaleModuleName}.dto.ts`),
    getReturnedDtoContent(finaleModuleName),
  );

  console.log(`✅ Module "${moduleName}" généré dans ${targetPath}`);
} catch (error) {
  console.error('❌ Erreur pendant la génération du module :', error.message);
}
