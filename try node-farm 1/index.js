const fs = require('fs');
const url = require('url');
const http = require('http');

const replaceHtml = function(mpage, dobj) {
    let obj = mpage.replace(/{%PRODUCTNAME%}/g, dobj.productName);
    obj = obj.replace(/{%IMAGE%}/g, dobj.image);    
    obj = obj.replace(/{%FROM%}/g, dobj.from);    
    obj = obj.replace(/{%NUTRIENTS%}/g, dobj.nutrients);    
    obj = obj.replace(/{%QUANTITY%}/g, dobj.quantity);    
    obj = obj.replace(/{%PRICE%}/g, dobj.price);    
    obj = obj.replace(/{%DESCRIPTION%}/g, dobj.description);
    obj = obj.replace(/{%ID%}/g, dobj.id);

    if (!dobj.organic) obj = obj.replace(/{%ORGANIC%}/g, 'not-organic');  
    
    return obj;
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-cards.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const data1 = JSON.parse(data);
// console.log(data1[0]);

const server = http.createServer((req, res)=>{
    const {query, pathname} = url.parse(req.url, true);
    const quer1 = Object.entries(query);
    const querys = Object.fromEntries(quer1);
    
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {'Content-type': 'text/html'});
        const clonecard = data1.map((el)=> replaceHtml(tempCard, el)).join('');
        // console.log(clonecard);
        const first = tempOverview.replace('{%CARDS%}', clonecard);
        res.end(first);
        // res.end(tempOverview);
    } else if(pathname === '/product'){
        res.writeHead(200, {'Content-type': 'text/html'});
        const second = replaceHtml(tempProduct, data1[querys.id]);
        res.end(second);
        // console.log(querys);
        // res.end(tempProduct);
    } else if(pathname === '/api'){
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);
    } else {
        res.writeHead(404);
        res.end('Can not be found');
    }
    
});

server.listen(2000, '127.0.0.1', ()=>{
    console.log('Listening to your request on port 2000');
});