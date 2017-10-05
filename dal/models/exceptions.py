import sys
import traceback

class InvalidParameterException(Exception):
    def __init__(self, message):
        self.message = message

    def __str__(self):
        return self.message

class FileRepoException:
    def __init__(self, exception):
        self.type, self.value, self.stacktrace = sys.exc_info()
        self.underline_exception = exception

    def __str__(self):
        return str(traceback.format_exception(self.type, self.value, self.stacktrace))