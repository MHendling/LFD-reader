export default async function handler(req, res) {
    if (req.method === 'POST') {

        // here should be the call to the PYTHON web api

        // https://beeceptor.com/ for easy "real" api testing
        const serverResponse = await fetch('https://lfdtest.free.beeceptor.com/api/analyzer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        // create your response object
        const response = { ...serverResponse };

        // send it back to the page
        res.status(200).json(response);
    } else {
        // Handle any other HTTP method
        res.status(200).json({ name: 'John Doe' })
    }
}