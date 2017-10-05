import logging
from dal.repo.user_repo import UserRepository
from dal.models.tag import Tag
from dal.models.user import User
from dal.models.response import FileRepoResponse
from dal.models.exceptions import InvalidParameterException, FileRepoException

user_repository = UserRepository()


def create_user(body):
    try:
        user = User.from_json(body)

        if not user.email:
            raise InvalidParameterException("User can't be created without email")

        #default role if missing
        if not user.role:
            user.role = 'user'

        user_repository.insert(user)
        response = FileRepoResponse(True, user)
        logging.info(response)
        return response

    except Exception as err:
        response = FileRepoResponse(False, FileRepoException(err))
        logging.error(str(response))
        return response

def update_user(body):
    try:
        user = User.from_json(body)

        if not user.email:
            raise InvalidParameterException("User can't be updated without email")

        #default role if missing
        if not user.role:
            user.role = 'user'

        user_repository.update(user)
        response = FileRepoResponse(True, user)
        logging.info(response)
        return response

    except Exception as err:
        response = FileRepoResponse(False, FileRepoException(err))
        logging.error(str(response))
        return response

def delete_user(id):
    try:
        file = user_repository.delete(id)

        response = FileRepoResponse(True, file)
        logging.info(response)
        return response

    except Exception as err:
        response = FileRepoResponse(False, FileRepoException(err))
        logging.error(str(response))
        return response


def get_all():
    try:
        users = user_repository.get_all()
        response = FileRepoResponse(True, users)
        logging.info(response)
        return response

    except Exception as err:
        response = FileRepoResponse(False, FileRepoException(err))
        logging.error(str(response))
        return response
