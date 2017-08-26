var http = require('http');
var querystring = require('querystring');
var url = require('url');
var fs = require('fs');
var download = require('download-file');
var wkhtmltox = require("wkhtmltox");
var converter = new wkhtmltox();

var server = http.createServer(function(req, res) {
  res.writeHead(200);
  var params = querystring.parse(url.parse(req.url).query);
  res.end('Salut tout le monde !');
  if ('postid' in params) {
    console.log("Post id : " + params['postid']);
    //var html = fs.readFileSync('https://www.biennaleurbana.com/post/'+params['postid'], 'utf8');
    //var options = { format: 'Letter' };

      var urly = 'https://www.biennaleurbana.com/post/'+params['postid']

      var options = {
        directory: "./images/cats/",
        filename: params['postid']+".html"
      }

      download(urly, options, function(err){
        if (err) throw err
        console.log("meow");
        //
        // htmlToPDF = HTMLToPDF('./images/cats/'+params['postid']+'.html',
        //   './images/cats/'+params['postid']+'.pdf'
        // )

        converter.wkhtmltopdf   = '/opt/local/bin/wkhtmltopdf';
        converter.wkhtmltoimage = '/opt/local/bin/wkhtmltoimage';

        // Convert to pdf.
        // Function takes (inputStream, optionsObject), returns outputStream.
        converter.pdf(fs.createReadStream('./images/cats/'+params['postid']+'.html'), { pageSize: "letter" })
            .pipe(fs.createWriteStream("foo.pdf"));

        // Convert to image.
        // Function takes (inputStream, optionsObject), returns outputStream.
        converter.image(fs.createReadStream('./images/cats/'+params['postid']+'.html'), { format: "jpg" })
            .pipe(fs.createWriteStream("foo.jpg"));

        converter.image(fs.createReadStream('./images/cats/'+params['postid']+'.html'), { format: "png" })
            .pipe(fs.createWriteStream("foo.png"));
      })
  }
});
server.listen(8080);
