const { parser }  = require("../util/parse");
const { Render }  = require("@vuese/markdown-render");
const fs = require("fs-extra")
const path = require('path');
const Log = require('log-horizon');
const { js_beautify, html_beautify } = require('js-beautify')

const logger = Log.create();

// 生成markdown
async function genMarkdown(config) {
  const { outDir, inputDir } = config;
  try {
    const res = await fs.stat(path.resolve(inputDir));
    // 是文件
    if (res.isFile()) {
      logger.error('请检查inputDIr,目录必须是文件夹,不能是文件');
      return;
    }
    // 是文件目录
    if (res.isDirectory()) {
      const files = await fs.readdir(path.resolve(inputDir));

      return files.map(async (f) => {
        const abs = path.resolve(inputDir, f);
        const source = fs.readFileSync(abs, 'utf-8')
        // 解析vue模板生成组件md
        const parserRes = parser(source);
        const r = new Render(parserRes);
        const markdownRes = r.renderMarkdown();
        // 处理vue文件里的示例
        const example = componentsExampleHandler(parserRes['componentDesc']);
        const compName = markdownRes.componentName || path.basename(abs, '.vue');
        const str = formatMarkdown(markdownRes.content, example, compName);
        // 将md文件写入固定文件夹
        await writeMDFile(str, compName, outDir);
        // 返回数据
        const groupName = markdownRes.groupName;

        return {
          compName,
          groupName,
          content: str
        }
      });
    }
  } catch(e) {
    logger.error('error: ', err);
  }
}

// 寻找文件里的示例
function componentsExampleHandler(content) {
  const temp = (content.default.join('\n').split('example:start'));
  if(/example:end|example:start/.test(content.default.join('\n'))) {
    const data = temp[1].replace(/example:end/, '') || '';
    let htmlTemplate = html_beautify(data.match(/<[^>]+>/g).join(''));
    let jsTemplate = (data.split('>').length > 0 && js_beautify(data.split('>')[data.split('>').length - 1])) || '';
    return ('\n```vue' + '\n' + htmlTemplate + '\n' + '<script>' + '\n' + jsTemplate + '\n' +  '</script>\n' + '```');
  } 
  return '';
} 

// 将示例装入mrakdowm
function formatMarkdown(content, example, compName) {
  content = content
            .replace(/^\s+|\s+$/g,'')
            .replace(/example:start.*example:end/g, example)
            .replace(/\[name\]/g, compName);
  return content;
}

// 写入md文件到固定文件夹
async function writeMDFile(str, fileName, outDir) {
  const targetDir = path.resolve(outDir + '/components');
  const target = path.resolve(targetDir, fileName + '.md');
  await fs.ensureDir(targetDir);
  await fs.outputFile(target, str);
  logger.success(`Successfully created: ${target}`);
}

module.exports = genMarkdown;