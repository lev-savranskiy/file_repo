from elasticsearch import Elasticsearch,RequestsHttpConnection
from elasticsearch_dsl.query import Q
from requests_aws4auth import AWS4Auth
from dal.models.tag import Tag
from settings import AWS_ACCESS_KEY,AWS_SECRET_KEY,AWS_REGION,ELASTIC_SEARCH_HOST

class TagRepository(object):

    def __init__(self):
        # Open Connection to ES
        awsauth = AWS4Auth(AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, 'es')
        self.es = Elasticsearch(
            hosts=[{'host': ELASTIC_SEARCH_HOST, 'port': 443}],
            http_auth=awsauth,
            use_ssl=True,
            verify_certs=True,
            connection_class=RequestsHttpConnection)

        # Make sure Tag Index is configured properly
        Tag.init(using=self.es)



    def get_all(self):
        response = list(Tag.search(using=self.es).query('match_all').execute())
        return response

    def delete(self, item):
        item.delete(using=self.es)

    def insert(self, item):
        item.save(using=self.es)

    def update(self, item):
        item.update(using=self.es)


