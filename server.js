require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

const LICENSE_KEY = process.env.LICENSE_KEY || 'izyslots-local-key';
const LICENSE_ACTIVE = process.env.LICENSE_ACTIVE === 'true';

app.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'IzySlots license service is running'
    });
});

app.get('/api/license/check', (req, res) => {
    const key = req.headers['x-license-key'];

    if (key !== LICENSE_KEY) {
        return res.status(401).json({
            active: false,
            message: 'Invalid license key'
        });
    }

    return res.json({
        active: LICENSE_ACTIVE,
        message: LICENSE_ACTIVE ? 'License active' : 'License inactive'
    });
});

app.listen(PORT, () => {
    console.log(`License service running on port ${PORT}`);
});