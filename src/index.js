const genMarkdown = require('./lib/generateMarkDown.js');
const fs = require('fs-extra');
const path = require('path');
const JoyCon = require('joycon')

async function getDocute() {
    const { data } = await getConfig();
    // 生成文档
    const componentsPromise = await genMarkdown(data);
    const componentsRes = await Promise.all(componentsPromise);
    const components = componentsRes.filter(_ => _);
    // 组装links数据
    const links = components.map(({ compName }) => ({
        title: compName,
        link: `/components/${compName}`
    }));

    const groupsStr = JSON.stringify([{
        title: 'Basic',
        children: links
    }]);
    // 格式化模板
    formatTemplate(groupsStr, '学区宝组件库', './docs');
}

// 读取配置
async function getConfig() {
    const joycon = new JoyCon();
    const result = await joycon.load(['hjtDocs.config.js']);
    return result;
}

// 生成html文件
async function formatTemplate(groupsStr, title, outDir) {
    fs.readFile(
        path.resolve(__dirname, './template/index.html'), 
        { encoding: 'utf-8' }, 
        function(err, template) {
            // 处理模板
            template = template
                .replace(/<%= title %>/g, title)
                .replace(/<%= groupsStr %>/g, groupsStr);

            const targetDir = path.resolve(outDir);
            const target = path.resolve(targetDir, 'index.html');
            fs.outputFile(target, template);
        }
    );
    
}


getDocute();