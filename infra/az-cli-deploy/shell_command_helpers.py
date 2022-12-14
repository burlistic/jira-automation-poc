""" Helper functions to run shell commands """

import subprocess

def cmd_return_output(command, capture_output=True):
    """ Run the command (string) and return the output (string) """
    return subprocess.run(command.split(), check=True, text=True, capture_output=capture_output).stdout

def azure_login():
    """ run az login command """
    return cmd_return_output('az login')

def azure_logout():
    """ run az logout command """
    return cmd_return_output('az logout')

def azure_account_set(subscription_id):
    """ Set the current subscription to use to subscription_id """
    return cmd_return_output(f'az account set --subscription {subscription_id}')

def list_logged_in_subscriptions():
    """ return the output form listing subscriptions with az cli """
    return cmd_return_output('az account list -o table')

def deploy_main_bicep_file(location, path_to_file, path_to_parameters):
    """ return the output from deploying the main bicep file """
    cmd_return_output(
        f'az deployment sub create --location {location} --template-file {path_to_file} --parameters {path_to_parameters}',
        capture_output=False
    )