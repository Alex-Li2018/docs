const genMarkdown = require('./lib/generateMarkDown.js');
const fs = require('fs-extra');
const path = require('path');
const JoyCon = require('joycon')

async function getDocute() {
    const { data } = await getConfig();
    if (!data.inputDir || !data.inputDir.length) {
        return;
    }

    const componentsDirPromise = data.inputDir.map(async (item) => {
        // 生成文档
        const componentsPromise = await genMarkdown({
            outDir: data.outDir, 
            inputDir: item
        });
        const componentsRes = await Promise.all(componentsPromise);
        const arr = componentsRes.filter(_ => _);
        return arr;
    });

    const componentsDir = await Promise.all(componentsDirPromise);
    const components = componentsDir.reduce(function(total, current) {
        return total.concat(current);
    }, []);
    
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
    formatTemplate(groupsStr, '学区宝组件库', data.outDir);
    // reame.md
    formatReadme(links, data.outDir); 
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

// 生成readme文档
function formatReadme(links, outDir) {
    const str = links
        .map(item => `[${item.title}](${item.link})`)
        .join('\n');
    const targetDir = path.resolve(outDir);
    const readmeTarget = path.resolve(targetDir, 'readme.md');
    fs.outputFile(readmeTarget, str);
}


getDocute();