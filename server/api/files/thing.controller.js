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
var Thing = require('./thing.model');

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
        fs.writeFileSync('C:\\Users\\Sriganesh\\Desktop\\Semester3\\advancedProject\\FileProcessFlask\\' + filename, body, 'utf-8');
        console.log('done');
        // res.redirect('back');
        return res.json(200, {'answer': 'File transfer completed'});
    })
};

// Transforms the file
exports.transformFile = function(req, res) {
    console.log("transformFile called");
    request.post({url:'http://localhost:5000/transformFile', form: req.body},
        function(err, response, body){
            if (!err && response.statusCode == 200) {
                return res.json(200, body);
            } else{
                return res.json(404, error);
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

// Deletes a thing from the DB.
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

function handleError(res, err) {
    return res.send(500, err);
}