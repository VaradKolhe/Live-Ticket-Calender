const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: Object.values(err.errors).map(val => val.message).join(', ') });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({ error: 'Duplicate record found.' });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format.' });
  }

  res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = errorHandler;
