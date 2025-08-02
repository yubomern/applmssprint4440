import axios from 'axios';
export const fetchEvents = () => axios.get('http://localhost:4000/api/events');
export const createEvent = ev => axios.post('http://localhost:4000/api/events', ev);
