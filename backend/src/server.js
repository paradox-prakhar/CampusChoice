const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
  });
}

module.exports = app;
