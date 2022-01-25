"""
Script to deploy the main.bicep file to my RACWA Visual Studio Subscription
using the Azure CLI
"""

from configparser import RawConfigParser
from get_login_table_helpers import *
from shell_command_helpers import *


def main():
    """ Deploys main.bicep to RACWA VS Sub assuming Azure CLI is already logged in """

    racwa_sub_name = 'Visual-Studio-Professional-Subscription'

    subscriptions = get_azure_subscriptions_logged_in()
    racwa_sub_logged_in = racwa_sub_name in subscriptions
    try_again = True

    if racwa_sub_logged_in:
        print("- RACWA VisualStudio Subscription already logged in.")
    else:
        while not racwa_sub_logged_in and try_again:
            print(f"- {racwa_sub_name} not found in logged in subscriptions.")
            print("- Attempting login via browser (2FA).")

            azure_login()
            subscriptions = get_azure_subscriptions_logged_in()

            racwa_sub_logged_in = racwa_sub_name in subscriptions

            if racwa_sub_name not in subscriptions:

                valid_input = False
                while not valid_input:
                    login_again = input("- Login Unsuccessful. Try Again? (y/n): ").lower()

                    if login_again not in ['y', 'n']:
                        continue
                    elif login_again == 'n':
                        try_again = False

                    valid_input = True

                continue
                    
        if not racwa_sub_logged_in:
            return
        
        print("- Login successful.")


    racwa_sub_enabled = subscriptions[racwa_sub_name]["is_default"].lower() == 'true'
    if racwa_sub_enabled:
        print("- RACWA VisualStudio Subscription already enabled.")
    else:
        azure_account_set(subscriptions[racwa_sub_name]["subscription_id"])
        subscriptions = get_azure_subscriptions_logged_in()

        racwa_sub_enabled = subscriptions[racwa_sub_name]["is_default"].lower() == 'true'
        if not racwa_sub_enabled:
            print("- RACWA VisualStudio Subscription was not enabled.\nDeployment cancelled.\n")
            return
        else:
            print("- RACWA VisualStudio Subsciption enabled successfully.")

    # deploy bicep


if __name__ == "__main__":
    main()
