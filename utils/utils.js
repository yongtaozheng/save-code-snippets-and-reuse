const fs = require("fs");
const path = require("path");
const vscode = require("vscode");

function merge(a, b) {
  const merged = {
    snippets: [],
  };

  // 先将a中的代码片段添加到merged对象的snippets数组中
  merged.snippets.push(...a.snippets);

  // 创建一个map用于快速查找已添加的代码片段名称
  const nameMap = new Map();
  merged.snippets.forEach((snippet) => {
    nameMap.set(snippet.name, true);
  });

  // 遍历b中的代码片段，通过map判断是否已存在，若不存在则添加到merged对象中
  b.snippets.forEach((snippetB) => {
    if (!nameMap.has(snippetB.name)) {
      merged.snippets.push(snippetB);
      nameMap.set(snippetB.name, true);
    }
  });

  return merged;
}

async function getExtensionFile(context, fileName) {
  const filePath = path.join(context.extensionPath, fileName);
  let gitConfigData = {};
  if (fs.existsSync(filePath)) {
    gitConfigData = JSON.parse(fs.readFileSync(filePath, "utf8") || "{}");
  }
  return gitConfigData;
}

async function getInput(name, value = "") {
  const inputVal = await vscode.window.showInputBox({
    placeHolder: `请输入${name}`,
    value,
  });
  return inputVal;
}

// 获取当前编辑的文件名，根据参数判断是否需要不带文件扩展名
function getCurrentFileName(needExtension = false) {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const fileName = path.basename(
      editor.document.fileName,
      needExtension ? "" : path.extname(editor.document.fileName)
    );
    return fileName;
  }
  return null;
}

function keywordReplace(str) {
  const fileName = getCurrentFileName();
  const fileNameWithExt = getCurrentFileName(true);
  str = str.replace(/(【【fileName】】)|(【【文件名】】)/g, fileName);
  str = str.replace(
    /(【【fileNameWithExt】】)|(【【文件名带扩展名】】)/g,
    fileNameWithExt
  );
  return str;
}

module.exports = {
  merge,
  getExtensionFile,
  getInput,
  getCurrentFileName,
  keywordReplace,
};
