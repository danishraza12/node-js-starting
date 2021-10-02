//Built-In Modules
const fs = require('fs');
const http = require('http');
const url = require('url');
//Installed Module
const slugify = require('slugify');
//Our Module
const replaceTemplate = require('./modules/replaceTemplate');

/////////////////////////////////
// Server //////////

//Every time the server is called the callback function will be called and will be passed 'req'

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const productData = JSON.parse(data);

const slugs = productData.map((prod) =>
  slugify(prod.productName, {
    lower: true,
  })
);
console.log(slugs);

const Server = http.createServer((req, res) => {
  //destrucuture out the query and pathname property from req.url object using ES6 syntax
  const { query, pathname } = url.parse(req.url, true);

  //Overview Page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const cardsHtml = productData
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    //By using thing to be replaced inside '' it only replaces the first occurance
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);

    //Product Page
  } else if (pathname === '/product') {
    const product = productData[query.id];
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //API Page
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    //res.end can only send string values
    res.end(data);

    //Not Found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page Not found!</h1>');
  }
});

Server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
