"""
Script to deploy the main.bicep file to my RACWA Visual Studio Subscription
using the Azure CLI
"""

from get_login_table_helpers import *
from shell_command_helpers import *


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
