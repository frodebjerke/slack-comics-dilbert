///configurations
///slack incoming webhook channel
var channelUrl = process.env.CHANNEL;
var channelName = '#dilbert';
var channelUsername = 'dilbert';
var messagePretext = 'Your daily dose of office humor ';
var messageTitle = 'Daily Dilbert';
var slack = require('slack-notify')(channelUrl);
var request = require('request');
var cheerio = require('cheerio');
var endpoint = 'http://dilbert.com';
var cronTime = '00 00 11 * * 1-7';
var timeZone = 'America/New_York';
var port = process.env.PORT || 80;
////end configurations
var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('index.html');
var CronJob = require('cron').CronJob;
var job = new CronJob({
	cronTime: cronTime,
	onTick: function() {
		request(endpoint, function(error, response, body) {
			if (error && response.statusCode != 200) {
				return console.log('ERROR ', response.statusCode) 
			}
			try {
				$ = cheerio.load(body);
			} catch (e) {
				return console.log('ERROR ', e)
			}
			var src = $('img.img-comic').first().attr('src');
			console.log(src);
			var payload = {
				channel: channelName,
				username: channelUsername,
				"attachments": [{
					"fallback": "Required plain-text summary of the attachment.",
					"color": "#36a64f",
					"pretext": messagePretext,
					"title": messageTitle,
					"image_url": src
				}]
			}

			slack.send(payload, function() {
				console.log("Slack message sent");
			});
		});


	},
	start: true,
	timeZone: timeZone
});
job.start();
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(index);
}).listen(port);



