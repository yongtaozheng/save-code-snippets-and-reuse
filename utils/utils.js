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

module.exports = {
  merge,
  getExtensionFile,
  getInput,
};
