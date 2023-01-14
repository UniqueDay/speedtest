import fetch from 'node-fetch'
import https from 'https'
import { resolve4 } from 'dns/promises'
const agent = new https.Agent({
    keepAlive: true,
})

// await agent.createConnection();

const host = process.argv[2]
const ips = await resolve4(host);
const iterations = 20

for (const ip of ips){
    const times = []
    for (let i = 0; i < iterations; i++) {
        const start = performance.now()
        await fetch(`https://${ip}`, {
            agent,
            redirect: 'manual',
            headers: { host: host },
        })
        const delta = performance.now() - start
        console.log(delta)
        times.push(delta)
    }
    console.log("times", meanMedianMode(times));
}


function meanMedianMode(array) {
    return {
        mean: getMean(array),
        median: getMedian(array),
        mode: getMode(array),
    }
}

function getMean(array) {
    var sum = 0
    array.forEach(num => {
        sum += num
    })
    var mean = sum / array.length
    return mean
}

function getMedian(array) {
    array.sort(function (a, b) {
        return a - b
    })
    var median

    if (array.length % 2 !== 0) {
        median = array[Math.floor(array.length / 2)]
    } else {
        var mid1 = array[array.length / 2 - 1]
        var mid2 = array[array.length / 2]
        median = (mid1 + mid2) / 2
    }
    return median
}

function getMode(array) {
    var modeObj = {}
    array.forEach(num => {
        if (!modeObj[num]) modeObj[num] = 0
        modeObj[num]++
    })

    var maxFreq = 0
    var mode = []
    var modes = []

    for (var num in modeObj) {
        if (modeObj[num] > maxFreq) {
            modes = [num]
            maxFreq = modeObj[num]
        } else if (modeObj[num] === maxFreq) modes.push(num)
    }

    if (modes.length === Object.keys(modeObj).length) modes = []

    return modes
}
