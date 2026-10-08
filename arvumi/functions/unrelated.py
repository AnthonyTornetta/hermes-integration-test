import os
def handler(request):
    return {'status':200, 'body':{'has_cron_secret':'CRON_SECRET' in os.environ}}
