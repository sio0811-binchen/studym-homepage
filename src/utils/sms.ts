import axios from 'axios';

export const sendAligoSMS = async (receiver: string, msg: string) => {
    const formData = new FormData();
    formData.append('key', import.meta.env.VITE_ALIGO_APIKEY);
    formData.append('userid', import.meta.env.VITE_ALIGO_ID);
    formData.append('sender', import.meta.env.VITE_ALIGO_SENDER);
    formData.append('receiver', receiver);
    formData.append('msg', msg);
    // formData.append('testmode_yn', 'Y'); // Uncomment for test mode

    try {
        const response = await axios.post('https://apis.aligo.in/send/', formData);
        if (response.data.result_code !== '1') {
            console.error('Aligo API Error:', response.data);
            throw new Error(response.data.message || 'SMS Send Failed');
        }
        return response.data;
    } catch (error) {
        console.error('Aligo SMS Error:', error);
        throw error;
    }
};
