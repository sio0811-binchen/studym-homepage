// Log Railway server IP before starting the app
import axios from 'axios';

axios.get('https://api.ipify.org?format=json')
    .then(response => {
        console.log('🚨====================================🚨');
        console.log('🔥 현재 Railway 서버 IP:', response.data.ip);
        console.log('🚨====================================🚨');
    })
    .catch(error => console.error('IP 확인 실패:', error));
