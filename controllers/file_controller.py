import logging
from dal.repo.file_repo import FileRepository
from dal.models.file import File
from dal.models.response import FileRepoResponse
from dal.models.exceptions import InvalidParameterException, FileRepoException

file_repository = FileRepository()


def create_file(body):
    try:
        file = File.from_json(body)

        if not file.file_name:
            raise InvalidParameterException("File can't be created without file_name")

        if not file.path:
            raise InvalidParameterException("File can't be created without path")

        file_repository.insert(file)
        response = FileRepoResponse(True, file)
        logging.info(response)
        return response

    except Exception as err:
        response = FileRepoResponse(False, FileRepoException(err))
        logging.error(str(response))
        return response


def get_file(id):
    try:
        file = file_repository.get(id)

        response = FileRepoResponse(True, file)
        logging.info(response)
        return response

    except Exception as err:
        response = FileRepoResponse(False, FileRepoException(err))
        logging.error(str(response))
        return response

def get_all():
    try:
        files = file_repository.get_all()
        response = FileRepoResponse(True, files)
        logging.info(response)
        return response

    except Exception as err:
        response = FileRepoResponse(False, FileRepoException(err))
        logging.error(str(response))
        return response

def search_files(body):
    try:
        files = file_repository.get_all(body)
        response = FileRepoResponse(True, files)
        logging.info(response)
        return response

    except Exception as err:
        response = FileRepoResponse(False, FileRepoException(err))
        logging.error(str(response))
        return response
