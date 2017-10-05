from datetime import datetime
from elasticsearch_dsl import  Text, Date, Keyword, DocType, InnerObjectWrapper, Search

class Tag(DocType):
    key = Text()
    created_time = Date()
    modified_time = Date()
    last_user = Keyword()

    class Meta:
        index = 'tag'

    @classmethod
    def from_json(cls, json):
        tag = Tag()

        if 'key' in json:
            tag.key = json['key']

        if 'created_time' in json:
            tag.created_time = json['created_time']

        if 'modified_time' in json:
            tag.modified_time = json['modified_time']


        if 'last_user' in json:
            tag.last_user = json['last_user']

        return tag


    def save(self, **kwargs):
        self.created_time = datetime.now()
        self.modified_time = datetime.now()

        return super().save(**kwargs)

    def update(self, **kwargs):
        self.modified_time = datetime.now()

        return super().update(**kwargs)

    def delete(self, **kwargs):

        return super().delete(**kwargs)