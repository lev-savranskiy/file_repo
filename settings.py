import os

ENV = os.environ.get("PYTHON_ENV", "development")


AWS_ACCESS_KEY = 'mykey'
AWS_SECRET_KEY= 'FTrxtq/nd2QS8r86hw+SXt+RDR0A1hqgHUJ7ox5/'
AWS_REGION = 'us-east-1'
AWS_BUCKET =  'file-repo'
ELASTIC_SEARCH_HOST= 'search-file-repo-pt7akxneptgjnn2smgvr2olndm.us-east-1.es.amazonaws.com'
FILE_TYPES= [{"key": "Creative"} , {"key": "Report"}, {"key": "Text"}]