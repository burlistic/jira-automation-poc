""" Helper functions to run shell commands """

import subprocess

def cmd_return_output(command):
    """ Run the command (string) and return the output (string) """
    return subprocess.run(command.split(), check=True, text=True, capture_output=True).stdout
