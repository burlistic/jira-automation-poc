"""
Script to deploy the main.bicep file to my RACWA Visual Studio Subscription
using the Azure CLI
"""

from get_login_table_helpers import *
from shell_command_helpers import *
from set_subscription_helpers import *


class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


def main():
    """ Deploys main.bicep to RACWA VS Sub assuming Azure CLI is already logged in """

    racwa_sub_name = 'Visual-Studio-Professional-Subscription'

    # Login to Azure #########################################################
    subscriptions = get_azure_subscriptions_logged_in()
    racwa_sub_logged_in = racwa_sub_name in subscriptions
    try_again = True

    if racwa_sub_logged_in:
        print(f"{bcolors.OKGREEN}- RACWA VisualStudio Subscription already logged in.{bcolors.ENDC}")
    else:
        while not racwa_sub_logged_in and try_again:
            print(f"{bcolors.WARNING}- {racwa_sub_name} not found in logged in subscriptions.{bcolors.ENDC}")
            print(f"{bcolors.OKCYAN}- Attempting login via browser (2FA).{bcolors.ENDC}")

            azure_login()
            subscriptions = get_azure_subscriptions_logged_in()

            racwa_sub_logged_in = racwa_sub_name in subscriptions

            if racwa_sub_name not in subscriptions:

                valid_input = False
                while not valid_input:
                    login_again = input(f"{bcolors.FAIL}- Login Unsuccessful.{bcolors.ENDC} {bcolors.HEADER}Try Again? (y/n): {bcolors.ENDC}").lower()

                    if login_again not in ['y', 'n']:
                        continue
                    elif login_again == 'n':
                        try_again = False

                    valid_input = True

                continue
                    
        if not racwa_sub_logged_in:
            return
        
        print(f"{bcolors.OKGREEN}- Login successful.{bcolors.ENDC}")

    # Set default subscription ###############################################
    old_default_sub_name = get_default_sub_name(subscriptions) 
    racwa_sub_enabled = subscriptions[racwa_sub_name]["is_default"].lower() == 'true'

    if racwa_sub_enabled:
        print(f"{bcolors.OKGREEN}- RACWA VisualStudio Subscription already enabled.{bcolors.ENDC}")
    else:
        azure_account_set(subscriptions[racwa_sub_name]["subscription_id"])
        subscriptions = get_azure_subscriptions_logged_in()

        racwa_sub_enabled = subscriptions[racwa_sub_name]["is_default"].lower() == 'true'
        if not racwa_sub_enabled:
            print(f"{bcolors.FAIL}- RACWA VisualStudio Subscription was not enabled.\nDeployment cancelled.\n{bcolors.ENDC}")
            return
        else:
            print(f"{bcolors.OKGREEN}- RACWA VisualStudio Subsciption enabled successfully.{bcolors.ENDC}")

    # Deploy azure infra with Bicep files ####################################
    location = 'australiaeast' # think this is needed because its a sub level deployment
    bicep_file_path = './infra/main.bicep' # using root of repo as that's where running script from
    parameter_file_path = './infra/parameters/deploy-azure-infra-parameters-dev.json'

    print(f"- Deploying {bicep_file_path} to {racwa_sub_name}...")
    deploy_main_bicep_file(location, bicep_file_path, parameter_file_path)

    # Logout racwa account ###################################################
    azure_logout()

    if old_default_sub_name is not None and old_default_sub_name != racwa_sub_name:
        azure_account_set(subscriptions[old_default_sub_name]["subscription_id"])
        print(f"\n{bcolors.WARNING}- Subscription default reset to {old_default_sub_name}{bcolors.ENDC}")


    print(f"{bcolors.HEADER}- Subscriptions currently logged in to AZ CLI:{bcolors.ENDC}\n")
    print(list_logged_in_subscriptions())

if __name__ == "__main__":
    main()
