const { parser }  = require("@vuese/parser");
const { Render }  = require("@vuese/markdown-render");
const fs = require("fs")
const path = require('path');
const { title } = require("process");
const whiteList = ['node_modules']

class Docer {
  constructor(fileName = '') {
    this.fileName = fileName;
    this.allName = fileName.split('/')[fileName.split('/').length-1];
    this.mDName = this.allName.split('.')[0] + '.md';
  }
  async createdMD(){
    try {
      const source = fs.readFileSync(this.fileName, 'utf-8')
      const parserRes = parser(source);
      const r = new Render(parserRes);
      const renderRes = r.render();
      const markdownRes = r.renderMarkdown();
      const example = this.componentsHandler(parserRes['componentDesc'])
      markdownRes.content = markdownRes.content.replace(/^\s+|\s+$/g,'').replace(/example-start.*example-end/g, example)
      markdownRes.content = markdownRes.content.replace(/\[name\]/, this.allName)
      const absPath = path.resolve(__dirname, 'docs');
      try {
          await fs.promises.stat(absPath)
      } catch (e) {
          await fs.promises.mkdir(absPath, {recursive: true})
      }
      const data = fs.readFileSync(`${__dirname}/docs/${this.mDName}`, {flag: 'w+'});
      fs.writeFileSync(`${__dirname}/docs/${this.mDName}`, markdownRes.content)
    } catch(e) {
      console.error(e)
    }
  }
  createdLink() {
    return { title: this.allName, link: `/${this.allName.split('.')[0]}`}
  }
  componentsHandler(des) {
    const temp = (des.default.join('\n').split('example-start'));
    if(/example-end|example-start/.test(des.default.join('\n'))) {
      return ('\n```vue' + temp[1] + '```').replace(/example-end/, '')
    } 
    return '';
  }
}

const links = [];

function createdDocs(filePath = process.cwd()) {
  fs.stat(filePath,function(eror,stats){  
    if(eror){  
        console.warn('获取文件stats失败');  
        return;
    } else{  
        let  isFile = stats.isFile();//是文件  
        let  isDir = stats.isDirectory();//是文件夹  
        if (isFile) {
          if (filePath.split('.')[1] === 'vue') {
            let doc = new Docer(filePath);
            doc.createdMD();
            let link = doc.createdLink();
            links.push(link);
          }
        } else if (isDir) {
          fs.readdir(filePath,function(err,files){  
            if(err){  
                console.warn(err)
                return ; 
            }else{  
                //遍历读取到的文件列表  
                files.forEach(function(filename){  
                  if (!whiteList.includes(filename)){
                    //获取当前文件的绝对路径  
                    let filedir = path.join(filePath,filename);  
                    //根据文件路径获取文件信息，返回一个fs.Stats对象  
                    fs.stat(filedir,function(eror,stats){  
                        if(eror){  
                            console.warn('获取文件stats失败');  
                        } else{  
                          return createdDocs(filedir);
                        }  
                    })  
                  }
                });  
            }  
        });  
        }
    }  
  })
}


function creatIndex() {
  console.log(links)
  const sidebar = JSON.stringify([{
    title: 'Basic',
    children: links
  }])
  const html = `
  <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>My Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/docute@4/dist/docute.css">
  </head>
  <body>
    <div id="docute"></div>
    <script src="https://unpkg.com/docute@4/dist/docute.js"></script>
    <script>
      new Docute({
        target: '#docute',
        sidebar: ${sidebar},
      })
    </script>
  </body>
</html>
  `
  const readme = links.map(it => {
    return `[${it.title}](${it.link})`
  }).join('\n');
  fs.writeFileSync(`${__dirname}/docs/index.html`, html)
  fs.writeFileSync(`${__dirname}/docs/README.md`, readme)
}
createdDocs();

setTimeout(() => {
  creatIndex()
}, 1000)





