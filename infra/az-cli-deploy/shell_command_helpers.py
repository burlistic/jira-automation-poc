""" Helper functions to run shell commands """

import subprocess

def cmd_return_output(command):
    """ Run the command (string) and return the output (string) """
    return subprocess.run(command.split(), check=True, text=True, capture_output=True).stdout

def azure_login():
    """ run az login command """
    return cmd_return_output('az login')

def azure_account_set(subscription_id):
    """ Set the current subscription to use to subscription_id """
    return cmd_return_output(f'az account set --subscription {subscription_id}')
