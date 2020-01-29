import axios from 'axios';

const api = axios.create({
	baseURL: 'https://usermodel-dev.ehlacademy.org/v1/gameApi',
	headers: {
		Authorization: 'Basic ZWhsX2FwaToyNzE1MDkwMA=='
	}
});

export default api;