const request = require('request');
//TODO: refactor away
const https = require('https');
const parse = require('csv-parse');
const _ = require('lodash');
const fs = require('hexo-fs');
require('should');


function fetchCsv(sheetCsvUrl) {
  https.get(sheetCsvUrl, (res) => {
    const {statusCode} = res;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
    } else if (!/^text\/csv/.test(contentType)) {
      error = new Error(`Invalid content-type. Expected text/csv but received ${contentType}`);
    }
    if (error) {
      hexo.log.error(error.message);
      // consume response data to free up memory
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => {
      rawData += chunk;
    });
    res.on('end', () => {
      // All went well? Parse the CSV
      parseCsv(rawData);
    });
  }).on('error', (e) => {
    hexo.log.error(`Could not fetch sheet CSV: ${e.message}`);
  });
}


function parseCsv(rawCsv) {
  parse(rawCsv, {comment: '#'}, function (err, parsedSheet) {
    // first row is going to be headers
    const header = parsedSheet.shift();

    parsedSheet.forEach((row) => {
      // take keys from each field after that, and stuff them into a big ole object

      const rowObject = _.zipObject(header, row);

      // call a generation function, for each post
      // generatePost(rowObject)
      //TODO: refactor - only download if not already local image for our slug
      downloadImages(rowObject);

    });
  });
}

function downloadImages(postObject) {
  //TODO this method should probably not care about postObject structure, hexo config
  postObject.should.have.property('imageurl');
  postObject.should.have.property('slug');

  const imagePath = `${hexo.config.source_dir}/images`;
  const imageFilename = `${imagePath}/${postObject.slug}.jpg`;


  //TODO: check to see if it already exists
  hexo.log.info('Downloading image file', imageFilename);

  request(postObject.imageurl).pipe(fs.createWriteStream(imageFilename));

  const imageRelativeUrl = `/images/${postObject.slug}.jpg`;
  postObject['localimage'] = imageRelativeUrl;
  generatePost(postObject);

}

function generatePost(postObject) {

  // Assertions about the post objects
  postObject.should.have.property('title');
  postObject.should.have.property('slug');
  postObject.should.have.property('localimage');


  // TODO make sure I have all the stuff I need to make a post
  hexo.post.create(postObject, true);
  hexo.log.info(`Created a post with slug ${postObject.slug}`);

}

hexo.extend.migrator.register('google-sheet', function (args) {
  // slurp down that csv file
  const sheetCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT5a7YTs_8AuqbAqF87vdDzUVkN9SVcgkC5qEk-Scn_fd8hKSKwDD_k70z9Phhtx-pVxdtxrDnvwJwe/pub?output=csv';

  fetchCsv(sheetCsvUrl);
});

