const express = require('express')
const app = express()
const cors = require('cors')

const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigin = ['http://localhost:8081', 'http://localhost:8080'];
        if (allowedOrigin.includes(origin)) {
            callback(null, true);
        } else {
            console.log(origin)
            callback(new Error('Not allowed by CORS'));
        }
    },
};

let generateArray = () => {
    const amountIterations = 20000
    let currentIteration = 0, min = 0, max = 100
    const array = []


    while (currentIteration < amountIterations) {
        const randomInt = randomNormal(50, 25)
        array.push(randomInt)
        currentIteration++
    }

    return array
}
function randomNormal(mean = 0, standardDeviation = 1) {
    const u1 = Math.random();
    const u2 = Math.random();

    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return (z0 * standardDeviation + mean) > 100 || (z0 * standardDeviation + mean) < 1 ? randomNormal(mean, standardDeviation) : Math.round(z0 * standardDeviation + mean);
}
function getFrequencyArray(array) {
    const partialFrequenciesArray = array.reduce((accum, current) => {
        accum[current - 1] = (accum[current - 1] || 0) + 1
        return accum;
    }, [])

    for (let i = 0; i < partialFrequenciesArray.length; i++) {
        if (partialFrequenciesArray[i] === undefined)
            partialFrequenciesArray[i] = 0
    }
    return partialFrequenciesArray
};

const startTime = performance.now()
let array = generateArray()
let freqArray = getFrequencyArray(array)
const elapsedTime = performance.now() - startTime
console.log(`Elapsed time: ${elapsedTime}`)
app.use(cors())

app.get('/gaussian-dist', (req, res) => {
    res.json({ rawData: array, freqArray: freqArray })
})

const PORT = 5000
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})