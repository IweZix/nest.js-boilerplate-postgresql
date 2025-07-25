/**
 * Script to generate a new module in a NestJS application.
 */

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
    console.log(`\n▶️ ${cmd}`);
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
  console.log(`\n✅ Entity file created: ${moduleNameWithoutS}.entity.ts`);

  fs.writeFileSync(
    path.join(dtoDir, `received${finaleModuleName}.dto.ts`),
    getReceivedDtoContent(finaleModuleName),
  );
  console.log(`✅ DTO file created: received${finaleModuleName}.dto.ts`);

  fs.writeFileSync(
    path.join(dtoDir, `returned${finaleModuleName}.dto.ts`),
    getReturnedDtoContent(finaleModuleName),
  );
  console.log(`✅ DTO file created: returned${finaleModuleName}.dto.ts`);

  console.log(`\n✅ Module "${moduleName}" generated in ${targetPath}`);
} catch (error) {
  console.error('❌ Error while generating module:', error.message);
}
