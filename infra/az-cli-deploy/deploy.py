"""
Script to deploy the main.bicep file to my RACWA Visual Studio Subscription
using the Azure CLI
"""

import subprocess

from get_login_table_helpers import *


def cmd_return_output(command):
    """ Run the command (string) and return the output (string) """
    return subprocess.run(command.split(), check=True, text=True, capture_output=True).stdout


def get_azure_subscriptions_logged_in():
    """ return a list of accounts that are logged into az cli """
    num_table_headings = 2

    account_table_rows = cmd_return_output(
        'az account list -o table').rstrip().split('\n')
    subscriptions = remove_table_headings(
        account_table_rows, num_table_headings)
    return subscription_list_to_dict(reduce_internal_whitespace(subscriptions))


def main():
    """ Deploys main.bicep to RACWA VS Sub assuming Azure CLI is already logged in """

    racwa_sub_name = 'Visual-Studio-Professional-Subscription'

    subscriptions = get_azure_subscriptions_logged_in()
    racwa_sub_logged_in = racwa_sub_name in subscriptions

    if not racwa_sub_logged_in:
        subscriptions = get_azure_subscriptions_logged_in()

    else: print("sub found")
    racwa_sub_enabled = subscriptions[racwa_sub_name]["state"].lower() == 'enabled'
    if not racwa_sub_enabled:
        # enable the subscription
        subscriptions = get_azure_subscriptions_logged_in()

    else: print("sub enabled")

    # deploy bicep


if __name__ == "__main__":
    main()
