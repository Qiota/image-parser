const fetch = require("node-fetch");
const fs = require("fs");
const colors = require("colors");

module.exports = async (config) => {
    await start(config);
};

async function start(config) {
    try {
        const rand = random(config.min, config.max, config.characters);
        const resp = await fetch(`${config.baseUrl}${rand}.png`, {
            redirect: "follow",
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.97 Safari/537.36 Vivaldi/1.94.1008.34",
            },
        });

        if (resp.ok) {
            await saveImage(config, resp);
            appendToFoundLinks(resp.url);
            console.log(colors.bgGreen(`[+]`) + ` ${colors.white.bold(resp.url)}`);
        } else {
            console.log(colors.bgRed(`[-]`) + ` ${colors.white.bold(config.baseUrl)}${rand}`);
        }

        await sleep(config.speed);
        return start(config);
    } catch (error) {
        console.error(colors.red(`Ошибка: ${error.message}`));
        await sleep(config.speed);
        return start(config);
    }
}

async function saveImage(config, response) {
    const filePath = `./images/${config.name}/${response.url.slice(config.baseUrl.length)}`;
    const fileStream = fs.createWriteStream(filePath);
    return new Promise((resolve, reject) => {
        response.body.pipe(fileStream);
        response.body.on("error", reject);
        fileStream.on("finish", resolve);
    });
}

function appendToFoundLinks(url) {
    if (fs.existsSync("./FoundLinks.txt") && fs.statSync("./FoundLinks.txt").isFile()) {
        fs.appendFileSync("./FoundLinks.txt", url + "\n");
    } else {
        console.log(colors.red("Ошибка: ./FoundLinks.txt не существует или не является файлом."));
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
