const fs = require("fs");
const colors = require("colors");
const { sites } = require("./config");

const deleteIfExists = (path, type) => {
  if (fs.existsSync(path)) {
    try {
      fs.rmSync(path, { recursive: type === "folder", force: true });
      console.log(`${type === 'file' ? 'Файл:' : 'Папка:'} ${path} успешно удал${type === 'file' ? 'ён' : 'ена'}.`.green);
    } catch (error) {
      console.log(`Ошибка при удалении ${type === 'file' ? 'файла' : 'папки'} ${path}: ${error.message}`.red);
    }
  } else {
    console.log(`${type === 'file' ? 'Файл:' : 'Папка:'} ${path} не существует.`.yellow);
  }
};

const checkNodeVersion = () => {
  const [major, minor] = process.version.slice(1).split('.').map(Number);
  if (major < 14 || (major === 14 && minor < 14)) {
    console.log(`Версия Node.js должна быть не ниже 14.14.0!`.bgBrightRed);
    process.exit();
  }
};

const createIfNotExists = (path, type, message) => {
  if (!fs.existsSync(path)) {
    if (type === "file") {
      fs.writeFileSync(path, message);
    } else {
      fs.mkdirSync(path, { recursive: type === "folder" });
    }
    console.log(`Создан${type === 'file' ? '' : 'а'}: ${path}`.green);
  } else {
    console.log(`${type === 'folder' ? 'Папка:' : 'Файл:'} ${path} уже существует.`.yellow);
  }
};

const loadScripts = () => {
  const scriptsDir = "./utils";
  const scripts = fs.readdirSync(scriptsDir);
  scripts.forEach((script) => {
    global[script.slice(0, -3)] = require(`./utils/${script}`);
  });
};

const processSites = () => {
  sites.forEach((site) => {
    if (site.enabled) {
      const siteFolder = `./images/${site.name}`;
      createIfNotExists(siteFolder, "folder", `Папка для ${site.name}`);
      const siteScript = `./scripts/${site.name}.js`;
      if (!fs.existsSync(siteScript)) {
        console.log(`Для сайта ${site.name} нет скрипта!`.bgBrightRed);
      } else {
        require(siteScript)(site);
      }
    }
  });
};

const initialize = () => {
  checkNodeVersion();
  if (process.argv[2] === "delete") {
    deleteIfExists("./FoundLinks.txt", "file");
    deleteIfExists("./images", "folder");
    process.exit();
  } else {
    createIfNotExists("./images", "folder", "Папка для изображений");
    createIfNotExists("./FoundLinks.txt", "file", "Здесь будут найденные ссылки на картинки!\n");
    loadScripts();
    processSites();
  }
};

initialize();