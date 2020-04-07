module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (process.env.NODE_ENV === 'test') {
      console.error(err);
    }
    if (err.status >= 500) console.log('Error handler:', err);
    ctx.status = err.status || 500;
    ctx.body = {
      status: 'failed',
      message: err.message || 'Internal server error',
    };
  }
};
