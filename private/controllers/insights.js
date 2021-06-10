const express = require('express');
var router = express.Router();
const axios = require('axios');

router.use(function (req, res, next) {
    // .. some logic here .. like any other middleware
    next()
});

router.get('/', async (req, res) => {
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
            },
            date: new Date(response.data.analysisUTCTimestamp).toLocaleDateString(),
            time: new Date(response.data.analysisUTCTimestamp).toLocaleTimeString()

            
        }
        res.json(data)
        return

      } catch (error) {
        console.error(error);
        res.json({error: 'err!!!'})

      }
});

module.exports = router;