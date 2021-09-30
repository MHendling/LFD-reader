const {spawn} = require('child_process');

export default async function handler(req, res) {
    if (req.method === 'POST') {

        const childPython = await spawn('python', ['hello.py']);

        childPython.stdout.on('data', (data) => {
            console.log(`You say goodbye, I say ${data}`)
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