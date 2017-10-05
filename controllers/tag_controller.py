import logging
from dal.repo.tag_repo import TagRepository
from dal.models.tag import Tag
from dal.models.response import FileRepoResponse
from dal.models.exceptions import InvalidParameterException, FileRepoException

tag_repository = TagRepository()


def create_tag(body):
    try:
        tag = Tag.from_json(body)

        if not tag.key:
            raise InvalidParameterException("Tag can't be created without key")

        if not tag.last_user:
            raise InvalidParameterException("Tag can't be created without last_user")

        tag_repository.insert(tag)
        response = FileRepoResponse(True, tag)
        logging.info(response)
        return response

    except Exception as err:
        response = FileRepoResponse(False, FileRepoException(err))
        logging.error(str(response))
        return response

def delete_tag(key):
    try:
        file = tag_repository.delete(key)

        response = FileRepoResponse(True, file)
        logging.info(response)
        return response

    except Exception as err:
        response = FileRepoResponse(False, FileRepoException(err))
        logging.error(str(response))
        return response

def get_all():
    try:
        tags = tag_repository.get_all()
        response = FileRepoResponse(True, tags)
        logging.info(response)
        return response

    except Exception as err:
        response = FileRepoResponse(False, FileRepoException(err))
        logging.error(str(response))
        return response


