import hashlib

from datetime import datetime
from elasticsearch_dsl import Nested, Text, Date, Keyword, DocType, InnerObjectWrapper

class Tag(InnerObjectWrapper):
    pass


class File(DocType):
    file_name = Text()
    path = Text()
    created_time = Text()
    modified_time = Text()
    last_user = Keyword()
    tags = Nested(doc_class=Tag,
                  properties={'key': Keyword(),
                              'value': Text(),
                              'created_date': Date(),
                              'modified_date': Date(),
                              'last_user': Keyword()})

    class Meta:
        index = 'file'

    @classmethod
    def from_json(cls, json):
        file = File()

        if 'file_name' in json:
            file.file_name = json['file_name']

        if 'path' in json:
            file.path = json['path']

        if 'created_time' in json:
            file.created_time = json['created_time']

        if 'modified_time' in json:
            file.modified_time = json['modified_time']

        if 'last_user' in json:
            file.last_user = json['last_user']

        if 'tags' in json:
            for tag in json['tags']:
                if 'key' in tag and 'value' in tag:
                    key = tag['key']
                    value = tag['value']
                    last_user_tag = None

                    if 'last_user' in tag:
                        last_user_tag = tag['last_user']

                    file.add_tag(key, value, last_user_tag)

        return file

    def add_tag(self, key, value, last_user):
        tag = {'key': key, 'value': value, 'created_date': datetime.now(), 'modified_date': datetime.now()}

        if last_user:
            tag["last_user"] = last_user
        self.tags.append(tag)

    def save(self, **kwargs):
        self.created_time = datetime.now()
        self.modified_time = datetime.now()
        utf_8_path = self.path.encode('utf-8')
        self.meta.id = hashlib.sha1(utf_8_path).hexdigest()

        return super().save(**kwargs)

    def update(self, **kwargs):
        self.modified_time = datetime.now()

        return super().update(**kwargs)
