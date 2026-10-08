exports.handler = () => ({status:200, body:{has_cron_secret: Object.hasOwn(process.env,'CRON_SECRET')}});
