require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

const LICENSE_KEY = process.env.LICENSE_KEY || 'izyslots-local-key';
const LICENSE_ACTIVE = process.env.LICENSE_ACTIVE === 'true';

const REVENUE_SECRET = process.env.REVENUE_SECRET || 'izyslots-revenue-secret-2026';

let latestRevenue = {
    updatedAt: null,
    totalBets: 0,
    totalWinnings: 0,
    totalRefunds: 0,
    profit: 0
};

app.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'IzySlots license service is running'
    });
});

app.get('/healthz', (req, res) => {
    res.status(200).send('OK');
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

app.post('/api/revenue/update', (req, res) => {
    const secret = req.headers['x-revenue-secret'];

    if (secret !== REVENUE_SECRET) {
        return res.status(401).json({
            status: false,
            message: 'Invalid revenue secret'
        });
    }

    latestRevenue = {
        updatedAt: new Date().toISOString(),
        totalBets: Number(req.body.totalBets || 0),
        totalWinnings: Number(req.body.totalWinnings || 0),
        totalRefunds: Number(req.body.totalRefunds || 0),
        profit: Number(req.body.profit || 0)
    };

    res.json({
        status: true,
        message: 'Revenue updated',
        data: latestRevenue
    });
});

app.get('/api/revenue', (req, res) => {
    const secret = req.headers['x-revenue-secret'];

    if (secret !== REVENUE_SECRET) {
        return res.status(401).json({
            status: false,
            message: 'Invalid revenue secret'
        });
    }

    res.json({
        status: true,
        data: latestRevenue
    });
});

app.listen(PORT, () => {
    console.log(`License service running on port ${PORT}`);
});