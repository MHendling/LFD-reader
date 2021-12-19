import {connectToDatabase} from '../../util/mongodb';

export default async function handler(req, res) {
    const { client, db } = await connectToDatabase();

    if (req.method === 'POST') {
        const insertedElement = await db.collection('curve_fitting_settings').insertOne(JSON.parse(req.body));

        return res.status(200).json(insertedElement);
    } else {
        const settings = await db.collection('curve_fitting_settings').find({}).toArray();

        return res.status(200).json(settings);
    }

}