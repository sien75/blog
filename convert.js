/**
 * For given markdown file, this js script converts img path to github url, and deletes site path.
 * With this js script, markdown file can be mounted to other platforms.
 */

const fs = require('fs');
const path = require('path');
const process = require('process');

const DEFAULT_URL_PREFIX = 'https://sien75.github.io/blog/';
const TEMP_FILE_NAME = 'temp.md';

const [ node, scriptName, markdownPath, urlPrefix = DEFAULT_URL_PREFIX ] = process.argv;

const [directory, fileName] = [path.dirname(markdownPath), path.basename(markdownPath)];

const readFile = () => {
    return fs.readFileSync(markdownPath).toString();
};

const replaceImgPath = (str) => {
    return str.replace(/\!(\[.*?\])\((.*?)\)/g, (match, p1, p2) => {
        const finalUrl = DEFAULT_URL_PREFIX + path.join(directory, p2);
        return '!' + p1 + '(' + finalUrl + ')';
    });
};

const deleteSitePath = (str) => {
    return str.replace(/[^\!]\[(.*?)\]\(.*?\)/g, (match, p1) => {
        return p1;
    });
};

const writeTempFile = (str) => {
    fs.writeFileSync(TEMP_FILE_NAME, str);
};

const fileStr = readFile();

let result = fileStr;
result = replaceImgPath(result);
result = deleteSitePath(result);

writeTempFile(result);