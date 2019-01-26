#!/usr/bin/env node

const http = require("http");
const finalhandler = require("finalhandler");
const serveStatic = require("serve-static");
const puppeteer = require("puppeteer");
const webpack = require("webpack");
const minimist = require("minimist");
const assert = require("assert").strict;
const configs = require("./webpack.config");

const argv = minimist(process.argv.slice(2));

let browser;
let server;

async function compile({ debug }) {
  for (const c of configs) {
    const config = {
      ...c,
      plugins: [
        ...c.plugins,
        new webpack.DefinePlugin({
          "process.__GRPC_SERVER_ADDRESS__":
            argv.address || JSON.stringify("localhost:50051"),
          "process.__GRPC_INSECURE__": argv.insecure || false
        })
      ]
    };

    const compiler = webpack(config);
    await new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) {
          return reject(err);
        }

        if (stats.hasErrors() || stats.hasWarnings()) {
          return reject(
            new Error(
              stats.toString({
                errorDetails: true,
                warnings: true
              })
            )
          );
        }

        if (debug) {
          console.log(stats.toString());
        }

        return resolve(stats);
      });
    });
  }
}

async function checkNode() {
  const { main } = require("./dist/bundle.node");
  const result = await main();
  assert.strictEqual(result.status, 1);
}

async function checkWeb() {
  const serve = serveStatic(__dirname);
  server = http.createServer((req, res) => {
    const done = finalhandler(req, res);
    serve(req, res, done);
  });
  server.listen();
  await new Promise(resolve => server.on("listening", resolve));

  browser = await puppeteer.launch({
    dumpio: argv.debug
  });
  const page = await browser.newPage();
  await page.goto(`http://localhost:${server.address().port}`);
  const gwhcHandle = await page.evaluateHandle(async () => {
    return await window.Gwhc.main();
  });
  const result = await gwhcHandle.jsonValue();
  assert.strictEqual(result.status, 1);
}

const main = async () => {
  await compile({ debug: argv.debug });
  await checkNode();
  await checkWeb();
};

main()
  .catch(e => {
    process.exitCode = 1;
    console.error(e);
  })
  .finally(async () => {
    if (browser) {
      await browser.close();
    }
    if (server && server.address().port) {
      server.close();
    }
  });
