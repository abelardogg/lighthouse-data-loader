const express = require('express');
var router = express.Router();
const axios = require('axios');
const fs = require('fs');

router.use(function (req, res, next) {
    // .. some logic here .. like any other middleware
    next()
});

router.get('/performance', async (req, res) => {
    const strategy = req.query.strategy;
    const url = req.query.url

    if(!strategy){
        res.json({error: 'strategy param is required (should be desktop or mobile)'})
    } else if(!url){
        res.json({error: 'url param is required'})
    }

    try {
        const response = await axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&strategy=${strategy}`);
        
        const generalScore = response.data.lighthouseResult.categories.performance.score;
        const lighthouseData = response.data.lighthouseResult.audits;
        const data = {
            msDate: new Date(response.data.analysisUTCTimestamp).getTime(),
            date: new Date(response.data.analysisUTCTimestamp).toLocaleDateString(),
            time: new Date(response.data.analysisUTCTimestamp).toLocaleTimeString(),
            url: url,
            device: strategy,
            score: generalScore,
            lighthouseAuditsResult: {
                'estimated-input-latency': lighthouseData['estimated-input-latency'],
                'first-contentful-paint': lighthouseData['first-contentful-paint'],
                'largest-contentful-paint': lighthouseData['largest-contentful-paint'],
                'first-meaningful-paint': lighthouseData['first-meaningful-paint'],
                'total-blocking-time': lighthouseData['total-blocking-time'],
                'max-potential-fid': lighthouseData['max-potential-fid'],
                'cumulative-layout-shift': lighthouseData['cumulative-layout-shift'],
                'server-response-time': lighthouseData['server-response-time'],
                'interactive': lighthouseData['interactive'],
                'first-cpu-idle': lighthouseData['first-cpu-idle'],
                'mainthread-work-breakdown': lighthouseData['mainthread-work-breakdown'],
                'bootup-time': lighthouseData['bootup-time'],
                'network-rtt': lighthouseData['network-rtt'],
                'speed-index': lighthouseData['speed-index']
            }
        }
        res.json(data)
        return

      } catch (error) {
        console.error(error);
        res.json({error: 'err!!!'})

      }
});

router.post('/save/performance/register', async (req, res) => {
    const filename = req.body.filename;
    const data = req.body.data;

    if(!filename){
        res.json({error: 'filename param is required'})
    }

    try {
        fs.writeFileSync(`db/${filename}`, JSON.stringify(data));
        // try {
        //     const data = fs.readFileSync(`data/${filename}`, 'utf8')
        //     debugger
        //     content = data;
        //     res.json({f: content})

        //   } catch (err) {
        //     console.error(err)
        //   }

        res.json({message: `${filename} saved`})

    } catch (error) {
        res.json({error: 'error while creating file'})
        
    }

});

module.exports = router;