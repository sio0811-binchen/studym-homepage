import axios from 'axios';
import CryptoJS from 'crypto-js';

// Hardcoded keys for testing (from user input)
const SOLAPI_API_KEY = 'NCS2S7JFYO8QSACF';
const SOLAPI_API_SECRET = 'CX8O4YCCDLUGVN1GMLEN03CX0JFCPNK8';
const SENDER_NUMBER = '01098051011'; // Fixed sender number
const RECEIVER = '01098051011'; // Admin phone from env

const getAuthorizationHeader = () => {
    const date = new Date().toISOString();
    const salt = CryptoJS.lib.WordArray.random(16).toString();
    const signature = CryptoJS.HmacSHA256(date + salt, SOLAPI_API_SECRET).toString();

    return `HMAC-SHA256 apiKey=${SOLAPI_API_KEY}, date=${date}, salt=${salt}, signature=${signature}`;
};

async function sendTestSMS() {
    console.log('Testing Solapi SMS...');
    console.log(`To: ${RECEIVER}`);
    console.log(`From: ${SENDER_NUMBER}`);

    try {
        const response = await axios.post(
            'https://api.solapi.com/messages/v4/send',
            {
                message: {
                    to: RECEIVER,
                    from: SENDER_NUMBER,
                    text: `[Test] Debug message ${Date.now()}`, // Unique message to avoid filtering
                    type: 'SMS'
                }
            },
            {
                headers: {
                    'Authorization': getAuthorizationHeader(),
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('--- SMS SEND FAILED ---');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
            console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error Message:', error.message);
        }
        console.error('Config:', JSON.stringify(error.config, null, 2));
    }
}

sendTestSMS();
