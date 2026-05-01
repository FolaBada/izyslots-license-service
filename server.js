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
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>IzySlots Revenue Monitor</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background: #0f0f14;
                    color: #fff;
                    padding: 40px;
                }

                .container {
                    max-width: 900px;
                    margin: auto;
                }

                h1 {
                    color: #a855f7;
                    margin-bottom: 10px;
                }

                .status {
                    margin-bottom: 30px;
                    color: #22c55e;
                }

                .grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                }

                .card {
                    background: #1c1b24;
                    padding: 25px;
                    border-radius: 14px;
                    border: 1px solid #333;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                }

                .label {
                    color: #aaa;
                    font-size: 14px;
                    margin-bottom: 10px;
                }

                .value {
                    font-size: 28px;
                    font-weight: bold;
                }

                .profit {
                    color: ${latestRevenue.profit >= 0 ? '#22c55e' : '#ef4444'};
                }

                .updated {
                    margin-top: 30px;
                    color: #888;
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>IzySlots Revenue Monitor</h1>
                <div class="status">License service is running</div>

                <div class="grid">
                    <div class="card">
                        <div class="label">Total Bets</div>
                        <div class="value">${latestRevenue.totalBets}</div>
                    </div>

                    <div class="card">
                        <div class="label">Total Winnings</div>
                        <div class="value">${latestRevenue.totalWinnings}</div>
                    </div>

                    <div class="card">
                        <div class="label">Total Refunds</div>
                        <div class="value">${latestRevenue.totalRefunds}</div>
                    </div>

                    <div class="card">
                        <div class="label">Profit</div>
                        <div class="value profit">${latestRevenue.profit}</div>
                    </div>
                </div>

                <div class="updated">
                    Last updated: ${latestRevenue.updatedAt || 'No revenue synced yet'}
                </div>
            </div>
        </body>
        </html>
    `);
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