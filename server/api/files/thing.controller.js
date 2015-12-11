/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var fs = require('fs');
var request = require('request');
var ProcessedFile = require('./thing.model');
var txtPath = "C:\\Users\\Sriganesh\\Desktop\\Semester3\\advancedProject\\FileProcessFlask\\";
var demoPath = "C:\\Users\\Sriganesh\\workspace\\sbrad\\WebContent\\WEB-INF\\lib\\lucene_demo_sriganesh.jar";
var corePath = "C:\\Users\\Sriganesh\\workspace\\sbrad\\WebContent\\WEB-INF\\lib\\lucene-core-3.0.3-dev.jar";
var mySQlPath = "C:\\Users\\Sriganesh\\workspace\\sbrad\\WebContent\\WEB-INF\\lib\\mysql-connector-java-5.1.18-bin.jar";
var IndexPath = "C:\\Users\\Sriganesh\\Desktop\\Semester3\\advancedProject\\RRIndex_MRN";
var HtmlPath = "C:\\Users\\Sriganesh\\Desktop\\Semester3\\advancedProject\\HTMLDir";
var mainClass = "org.apache.lucene.demo.IndexFiles";

// Get the list of Files
exports.getFiles = function(req, res) {
    console.log("getFiles called");
    request('http://localhost:5000/getFiles', function(error, response, body){
       if (!error && response.statusCode == 200) {
           return res.json(200, body);
       } else{
           return res.json(404, error);
       }
    });
};

exports.upload = function(req, res){
    var body = '';
    var header = '';
    var content_type = req.headers['content-type'];
    var boundary = content_type.split('; ')[1].split('=')[1];
    var content_length = parseInt(req.headers['content-length']);
    var headerFlag = true;
    var filename = 'dummy.bin';
    var filenameRegexp = /filename="(.*)"/m;
    console.log('content-type: ' + content_type);
    console.log('boundary: ' + boundary);
    console.log('content-length: ' + content_length);

    req.on('data', function(raw) {
        console.log('received data length: ' + raw.length);
        var i = 0;
        while (i < raw.length)
            if (headerFlag) {
                var chars = raw.slice(i, i+4).toString();
                if (chars === '\r\n\r\n') {
                    headerFlag = false;
                    header = raw.slice(0, i+4).toString();
                    console.log('header length: ' + header.length);
                    console.log('header: ');
                    console.log(header);
                    i = i + 4;
                    // get the filename
                    var result = filenameRegexp.exec(header);
                    if (result[1]) {
                        filename = result[1];
                    }
                    console.log('filename: ' + filename);
                    console.log('header done');
                }
                else {
                    i += 1;
                }
            }
            else {
                // parsing body including footer
                body += raw.toString('binary', i, raw.length);
                i = raw.length;
                console.log('actual file size: ' + body.length);
            }
    });

    req.on('end', function() {
        // removing footer '\r\n'--boundary--\r\n' = (boundary.length + 8)
        body = body.slice(0, body.length - (boundary.length + 8));
        console.log('final file size: ' + body.length);
        fs.writeFileSync(txtPath + filename, body, 'utf-8');
        console.log('done');
        return res.json(200, {'answer': 'File transfer completed'});
    })
};

// Transforms the file
exports.transformFile = function(req, res) {
    console.log("transformFile called");
    request.post({url:'http://localhost:5000/transformFile', form: req.body },
        function(err, response, body){
            if (!err && response.statusCode == 200) {
                return res.json(200, body);
            } else{
                return res.json(404, err);
            }
        }
    );
};

// Deletes the file
exports.deleteFile = function(req, res) {
    console.log("deleteFile called");
    request.post({url:'http://localhost:5000/deleteFile', form: req.body},
        function(err, response, body){
            if (!err && response.statusCode == 200) {
                return res.json(200, body);
            } else{
                return res.json(404, error);
            }
        }
    );
    //return res.json(200, {'status': 'OK'});
};


exports.indexFile = function(req, res) {
    console.log("indexing file called");
    var cmd = "java";
    console.log("Starting Indexing for HTML files in " + req.body.name);
    var args = ["-cp", demoPath+";"+corePath+";"+mySQlPath, mainClass, IndexPath, HtmlPath, HtmlPath];
    var spawn = require('child_process').spawnSync;
    var child = spawn(cmd, args);
    console.log("Indexing exited with status", child.status);
    console.log("Status" + child.stdout.toString());
    if (child.status == 0) {
        res.send(200, {'status':'OK'});
    }
    else {
        res.send(404, {'status':'NOT OK'});
    }
    //res.send(200,{'status':'OK'});
};

/* Deletes a thing from the DB.
exports.destroy = function(req, res) {
    Thing.findById(req.params.id, function (err, thing) {
        if(err) { return handleError(res, err); }
        if(!thing) { return res.send(404); }
        thing.remove(function(err) {
            if(err) { return handleError(res, err); }
            return res.send(204);
        });
    });
};
*/
function handleError(res, err) {
    return res.send(500, err);
}