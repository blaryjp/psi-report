#!/usr/bin/env node

(function(process)
{

    'use strict';

    var url = require('url');
    var exec = require('child_process').exec;
    var colors = require('colors');
    var argv = require('yargs').argv;
    var os = require('os');

    var Crawler = require('./crawler.js');
    var PSI = require('./psi.js');
    var Report = require('./report.js');

    if (typeof argv._[0] === 'undefined')
    {
        console.log(colors.red('Please provide a valid base URL'));
        process.exit();
    }

    var baseurl = url.parse(argv._[0].search(/https?:\/\//) !== -1 ? argv._[0] : 'http://' + argv._[0]);

    var crawler = new Crawler(baseurl);
    crawler.crawl(function(urls)
    {
        var psi = new PSI(urls);
        psi.crawl(function(results)
        {
            var report = new Report(results);
            report.build(function(path)
            {
                console.log(colors.green('Report built.') + ' (' + path + ')');
                if (os.platform() === 'darwin')
                {
                    exec('open ' + path);
                }
            });
        });
    });

})(process);
