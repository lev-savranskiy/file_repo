import hashlib
from dal.models.file import Tag
from datetime import datetime
from elasticsearch_dsl import Nested, Text, Date, Keyword, DocType, InnerObjectWrapper



class User(DocType):
    email = Text()
    role = Text()
    created_time = Date()
    modified_time = Date()
    last_login =  Text()
    tags = Nested(doc_class=Tag,
                  properties={'key': Keyword(),
                              'created_date': Date(),
                              'modified_date': Date(),
                              'last_user': Keyword()})

    class Meta:
        index = 'user'

    @classmethod
    def from_json(cls, json):
        user = User()

        if 'email' in json:
            user.email = json['email']

        if 'role' in json:
            user.role = json['role']

        if 'created_time' in json:
            user.created_time = json['created_time']

        if 'modified_time' in json:
            user.modified_time = json['modified_time']

        if 'last_login' in json:
            user.last_user = json['last_login']

        if 'tags' in json:
            for tag in json['tags']:
                if 'key' in tag and 'value' in tag:
                    key = tag['key']
                    value = tag['value']
                    user.add_tag(key, value)

        return user

    def add_tag(self, key, last_user):
        tag = {'key': key, 'created_date': datetime.now(), 'modified_date': datetime.now()}

        self.tags.append(tag)

    def save(self, **kwargs):
        self.created_time = datetime.now()
        self.modified_time = datetime.now()
        utf_8_email = self.email.encode('utf-8')
        self.meta.id = hashlib.sha1(utf_8_email).hexdigest()

        return super().save(**kwargs)

    def update(self, **kwargs):
        self.modified_time = datetime.now()

        return super().update(**kwargs)
