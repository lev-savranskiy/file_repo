import json

from dal.models.exceptions import FileRepoException
from dal.models.file import File
from dal.models.tag import Tag


class FileRepoExceptionEncoder(json.JSONEncoder):
    def default(self, o):
        return str(o)


class FileRepoResponseEncoder(json.JSONEncoder):
    def __init__(self, skipkeys=False, ensure_ascii=True, check_circular=True,
                 allow_nan=True, indent=None, separators=None,
                 default=None, sort_keys=False, **kw):
        self.encoders = kw if bool(kw) else None
        super().__init__(skipkeys=skipkeys,
                         ensure_ascii=ensure_ascii,
                         check_circular=check_circular,
                         allow_nan=allow_nan,
                         indent=indent,
                         separators=separators,
                         sort_keys=sort_keys,
                         default=default)

    def default(self, o):
        result = {'is_success': o.is_success}

        if isinstance(o.result, FileRepoException):
            result["result"] = json.loads(json.dumps(o.result, cls=FileRepoExceptionEncoder))
        elif bool(self.encoders) and o.result.__class__.__name__ in self.encoders.keys():
            result['result'] = json.loads(json.dumps(o.result, cls=self.encoders.get(o.result.__class__.__name__)))
        elif isinstance(o.result, list):
            result['result'] = []
            for item in o.result:
                if bool(self.encoders) and item.__class__.__name__ in self.encoders.keys():
                    result['result'].append(
                        json.loads(json.dumps(item, cls=self.encoders.get(item.__class__.__name__))))
                else:
                    result['result'].append(json.loads(json.dumps(item)))
        elif o.result:
            result['result'] = json.loads(json.dumps(o.result))

        return result


class FileEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, File):
            tags = []
            for tag in o.tags:
                tag_dict = {'key': tag.key, 'value': tag.value,
                             'created_date': str(tag.created_date),
                             'modified_date': str(tag.modified_date)}

                if tag.last_user:
                    tag_dict['last_user'] = tag.last_user

                tags.append(tag_dict)

            return {
                'id': o.meta.id,
                'file_name': o.file_name,
                'path': o.path,
                'modified_time': str(o.modified_time),
                'created_time': str(o.created_time),
                'tags': tags
            }

class TagEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o,  Tag):
            return {
                'last_user': o.last_user,
                'key': o.key,
                'modified_time': str(o.modified_time),
                'created_time': str(o.created_time)
            }

class UserEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, File):
            tags = []
            for tag in o.tags:
                tag_dict = {'key': tag.key,
                            'created_date': str(tag.created_date),
                             'modified_date': str(tag.modified_date)}

                if tag.last_login:
                    tag_dict['last_login'] = tag.last_login

                tags.append(tag_dict)

            return {
                'id': o.meta.id,
                'email': o.email,
                'role': o.role,
                'modified_time': str(o.modified_time),
                'created_time': str(o.created_time),
                'last_login': str(o.last_login),
                'tags': tags
            }


