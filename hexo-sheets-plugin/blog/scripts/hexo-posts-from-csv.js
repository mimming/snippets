const request = require('request');
const https = require('https');
const parse = require('csv-parse');
const _ = require('lodash');
const fs = require('hexo-fs');
require('should');
const rp = require('request-promise-native');
const url = require('url');


function parseCsvFile(rawCsv) {
  return new Promise((resolve, reject) => {
    let entries = [];

    parse(rawCsv, function (err, parsedSheet) {
      if (err) {
        reject(err);
      }

      // first row is going to be headers
      const header = parsedSheet.shift();
      parsedSheet.forEach((row) => {
        // take keys from each field after that, and stuff them into a big ole object
        const rowObject = _.zipObject(header, row);
        entries.push(rowObject);
      });
      resolve(entries);
    });
  });
}

function checkImageCache(entries) {
  // TODO: do this with a bunch of promises in parallel
  return new Promise((resolve, reject) => {
    entries.forEach((entry) => {
      entry.should.have.property('imageurl');
      entry.should.have.property('slug');
      entry.should.not.have.property('localimage');

      // TODO: deal with urls that do not parse
      const imageUrl = url.parse(entry.imageurl);
      const imageFilename = imageUrl.pathname.split('/').pop();

      // TODO: figure out if this is the safest way to construct local image paths
      // Construct the local image path
      const localPath = `${hexo.config.source_dir}/images/${entry.slug}_${imageFilename}`;
      const relativeUrl = `/images/${entry.slug}_${imageFilename}`;

      // stat each image as a jpg, then as png, see if it exists
      try {
        fs.statSync(localPath);
        // if exists, add localimage to entry
        entry['localimage'] = relativeUrl;
      } catch (error) {
        // Do nothing!  Pass the entry through
      }
    });
    resolve(entries);
  });
}

function downloadImages(entries) {
  return new Promise((resolve, reject) => {
    //TODO: download in parallel
    entries.forEach(entry => {
      entry.should.have.property('imageurl');
      entry.should.have.property('slug');

      if (entry.localimage) {
        hexo.log.info(`${entry.slug} localimage cached, skipping`);
      } else {
        hexo.log.info(`${entry.slug} -- downloading image`);

        // TODO: this is copy/pasted from checkImageCache, maybe move to function
        // TODO: deal with urls that do not parse
        const imageUrl = url.parse(entry.imageurl);
        const imageFilename = imageUrl.pathname.split('/').pop();
        const localPath = `${hexo.config.source_dir}/images/${entry.slug}_${imageFilename}`;
        const relativeUrl = `/images/${entry.slug}_${imageFilename}`;

        request(entry.imageurl).pipe(fs.createWriteStream(localPath));

        entry['localimage'] = relativeUrl;
      }
    });
    resolve(entries);
  });
}

function generatePosts(entries) {
  return new Promise((resolve, reject) => {
    entries.forEach(entry => {
      // Assertions about the post objects
      entry.should.have.property('slug');
      entry.should.have.property('localimage');

      // TODO make sure I have all the stuff I need to make a post
      hexo.post.create(entry, true);
      hexo.log.info(`Created a post with slug ${entry.slug}`);
    });
  });
}


hexo.extend.migrator.register('google-sheet', function (args) {
  //TODO move this to a config
  const sheetCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT5a7YTs_8AuqbAqF87vdDzUVkN9SVcgkC5qEk-Scn_fd8hKSKwDD_k70z9Phhtx-pVxdtxrDnvwJwe/pub?output=csv';

  // fetch csv file
  return rp(sheetCsvUrl)
  // parse the CSV
      .then(respBody => parseCsvFile(respBody))
      // check image cache, set localImage values for already cached images
      .then(entries => checkImageCache(entries))
      // download all of the images that don't yet have a localImage
      .then(entries => downloadImages(entries))
      // generate the posts
      .then(entries => generatePosts(entries))
      .catch(error => {
        console.log("generation failed because...");
        console.log(error);
      });
});

