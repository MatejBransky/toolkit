const path = require('path');
const fs = require('fs');

module.exports = function watchWorkspaces(rootPath) {
  return {
    name: '@matejbransky/vite-plugin-watch-source',

    config: (userConfig) => {
      const modifiedConfig = {
        ...userConfig,
        alias: {
          ...Object.fromEntries(
            getPackages(rootPath).map((pkg) => [
              pkg.name,
              path.join(pkg.name, pkg.source),
            ])
          ),
          ...userConfig.alias,
        },
      };

      console.log('Automatic aliases:', modifiedConfig.alias);

      return modifiedConfig;
    },
  };
};

function getPackages(rootPath) {
  const rootPkg = require(path.resolve(
    process.cwd(),
    rootPath,
    'package.json'
  ));

  const folders = rootPkg.workspaces.flatMap((workspace) => {
    if (workspace.includes('/*')) {
      const folderWithWorkspaces = workspace.replace('/*', '');
      const workspacesFolders = fs.readdirSync(
        path.resolve(process.cwd(), rootPath, folderWithWorkspaces)
      );
      return workspacesFolders.map((folderName) =>
        path.join(folderWithWorkspaces, folderName)
      );
    }
    return workspace;
  });

  const folderPaths = folders.map((folder) =>
    path.resolve(process.cwd(), rootPath, folder)
  );

  const packages = folderPaths
    .map((folderPath) => {
      try {
        return require(path.resolve(folderPath, 'package.json'));
      } catch (e) {
        return null;
      }
    })
    .filter((pkg) => pkg.source);

  return packages;
}
