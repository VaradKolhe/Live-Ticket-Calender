const axios = require('axios');

const TICKETMASTER_BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

const normalizeEvent = (event) => {
  return {
    id: event.id,
    title: event.name,
    description: event.info || event.description || '',
    date: event.dates?.start?.localDate || '',
    time: event.dates?.start?.localTime || '',
    venue: event._embedded?.venues?.[0]?.name || '',
    city: event._embedded?.venues?.[0]?.city?.name || '',
    image: event.images?.find(img => img.ratio === '16_9')?.url || event.images?.[0]?.url || '',
    category: event.classifications?.[0]?.segment?.name || '',
    ticketUrl: event.url || ''
  };
};

exports.getEvents = async (queryParams) => {
  const { keyword, city, date } = queryParams;
  
  const params = {
    apikey: process.env.TICKETMASTER_API_KEY,
    size: 20,
    sort: 'date,asc'
  };

  if (keyword) params.keyword = keyword;
  if (city) params.city = city;
  if (date) {
    // format should be YYYY-MM-DDTHH:mm:ssZ for ticketmaster startDateTime if exact, 
    // but we can just pass localStartDateTime if supported, or use startDateTime.
    // For simplicity, we just pass keyword or skip complex date filtering for MVP.
    // Assuming simple keyword search for MVP.
  }

  try {
    const response = await axios.get(`${TICKETMASTER_BASE_URL}/events.json`, { params });
    const events = response.data?._embedded?.events || [];
    return events.map(normalizeEvent);
  } catch (err) {
    console.error('Ticketmaster API error:', err.response?.data || err.message);
    throw new Error('Failed to fetch events from Ticketmaster');
  }
};

exports.getEventById = async (id) => {
  try {
    const response = await axios.get(`${TICKETMASTER_BASE_URL}/events/${id}.json`, {
      params: { apikey: process.env.TICKETMASTER_API_KEY }
    });
    return normalizeEvent(response.data);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return null;
    }
    console.error('Ticketmaster API error:', err.response?.data || err.message);
    throw new Error('Failed to fetch event from Ticketmaster');
  }
};
