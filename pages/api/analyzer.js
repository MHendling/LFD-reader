const {spawn} = require('child_process');

export default async function handler(req, res) {
    if (req.method === 'POST') {

        const paramData = req.body;

        const settings = paramData?.settings;
        const imgData = paramData?.imgData.split(',')[1];

        // TODO: add settings properly to python spawn call
        const childPython = await spawn('python', ['lfd_analyzer.py', '-f', imgData, '-s', settings]); // <-- add settings here

        childPython.stdout.on('data', (data) => {
            //res.status(200).send(data);
            res.status(200).json(JSON.stringify(data.toString()));
        });

        childPython.stderr.on('data', (data) => {
            console.error(`There was an error: ${data}`);
            res.status(500);
        });

        childPython.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });

    } else {
        // Handle any other HTTP method
        res.status(200).json({name: 'John Doe'})
    }
}