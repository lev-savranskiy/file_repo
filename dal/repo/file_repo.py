from elasticsearch import Elasticsearch,RequestsHttpConnection
from elasticsearch_dsl.query import Q
from requests_aws4auth import AWS4Auth
from dal.models.file import File
from settings import AWS_ACCESS_KEY,AWS_SECRET_KEY,AWS_REGION,ELASTIC_SEARCH_HOST

class FileRepository(object):

    def __init__(self):
        # Open Connection to ES
        awsauth = AWS4Auth(AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, 'es')
        self.es = Elasticsearch(
            hosts=[{'host': ELASTIC_SEARCH_HOST, 'port': 443}],
            http_auth=awsauth,
            use_ssl=True,
            verify_certs=True,
            connection_class=RequestsHttpConnection)

        # Make sure File Index is configured properly
        File.init(using=self.es)

    def search_by_tags(self, text):
        response = File.search(using=self.es).query('nested', path='tags', query=Q('match', tags__value=text)).execute()
        return response

    def get_all(self):
        response = list(File.search(using=self.es).query('match_all').execute())
        return response

    def search_files(self, text):
        #todo
        response = list(File.search(using=self.es).query('match_all').execute())
        return response

    def insert(self, item):
        item.save(using=self.es)

    def update(self, item):
        item.update(using=self.es)

    def get(self, id):
        file = File.get(id, using=self.es, ignore=[404])
        return file

