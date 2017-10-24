
const cheerio = require('cheerio');
const request = require('request');
const trim = require('trim');
const json2csv = require('json2csv');
const changeCase = require('change-case')
const fs = require('fs')
const args = require('optimist').argv;
const help = 'TODO - add some help ';

if ((args.h)||(args.help)) {
  console.log(help);
  process.exit(0);
}

if (!args.u) {
  console.log('-u is a required field. Please provide a URL.');
  process.exit(0);
}

const grouponUrl = args.u;
if (!grouponUrl.startsWith('http')) {
  console.log('invalid URL');
  process.exit(0);
}

let content = [];
request(grouponUrl, function (error, response, html) {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);
    $('div.cui-content').each((i, element) =>{
      function pluckText(className){
        return trim($(element).find(`.${className}`).text());
      }

      function pluckAttr(className, attr){
        return $(element).find(`.${className}`).attr(attr);
      }

      const discountPrice = pluckText('cui-price-discount-same-size');
      const companyName = pluckText('cui-udc-subtitle');

      let image = pluckAttr('cui-image', 'data-high-quality')|| '';
      image = image.replace(/^\/\//, '')

      if (!discountPrice || !companyName ) return;

      content = [...content, {companyName, discountPrice, image}];
    });

    console.log(content);

    try {
      writeCsv(content)
    } catch (e) {
      console.error(e);
    };
  }
});

function writeCsv(content) {
  var result = json2csv({ data: content, fields: Object.keys(content[0])});
  // result[0] = result[0].map(field => changeCase.sentenceCase(field))
  fs.writeFile(`${args.n}.csv` || 'file.csv', result, function(err) {
    if (err) throw err;
    console.log('file saved');
  });
}
