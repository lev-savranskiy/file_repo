class FileRepoResponse():
    def __init__(self, is_success, result):
        self.is_success = is_success
        self.result = result

    def __str__(self):
        return "Operation succeed: {is_success} Body: {result}".format(is_success=self.is_success.__str__(),result=self.result.__str__())
