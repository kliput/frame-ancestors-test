const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('./example.key'),
  cert: fs.readFileSync('./example.crt')
};

const genHtml = (body) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    iframe {
      border: 1px solid black;
      width: 400px;
      height: 400x;
    }
  </style>
</head>
<body>
    ${body}
</body>
</html>`;

const server1 = https.createServer(options, (req, res) => {
  if (req.url === '/level1.html') {
    res.end(genHtml('s1-level1 <iframe src="https://public-onedata.org:8092/level2.html" frameborder="0"></iframe>'));
  }
  if (req.url === '/level1-double.html') {
    res.end(genHtml('s1-level1 (embed 2-1) <iframe src="https://public-onedata.org:8092/level2-1.html" frameborder="0"></iframe>'));
  }
});

const server2 = https.createServer(options, (req, res) => {
  if (req.url === '/level1.html') {
    res.end(genHtml('s2-level1 <iframe src="https://public-onedata.org:8092/level2.html" frameborder="0"></iframe>'));
  }
  if (req.url === '/level2.html') {
    res.end(genHtml('s2-level2 <iframe src="https://public-onedata.org:8093/level3.html" frameborder="0"></iframe>'));
  }
  if (req.url === '/level2-1.html') {
    res.end(genHtml('s2-level2-1 <iframe src="https://public-onedata.org:8092/level2.html" frameborder="0"></iframe>'));
  }
});

const server3 = https.createServer(options, (req, res) => {
  res.setHeader('content-security-policy', 'frame-ancestors https://public-onedata.org:8092');
  if (req.url === '/level3.html') {
    res.end(genHtml('s3-level3 (end)'));
  }
});

server1.listen(8091, 'public-onedata.org');
server2.listen(8092, 'public-onedata.org');
server3.listen(8093, 'public-onedata.org');
