""" Helper functions for getting login table table """

import re

from enum import IntEnum
from shell_command_helpers import *


class SubscriptionListIndexes(IntEnum):
    """ Enumerate indexes of sub info list """
    SUB_NAME = 0
    SUB_ID = 1
    STATE = 2
    IS_DEFAULT = 3


def newlines_to_space(string):
    """ Replace all newline characters in string with a space character """
    return string.replace('\n', ' ')


def remove_table_headings(table_row_list, num_headings):
    """
    Remove the headings from the list of table rows
    """
    return table_row_list[num_headings:]


def join_sub_name(subscription):
    """ if a subscription name has white space replace it with a dash """
    subscription = subscription.split('AzureCloud')
    subscription[0] = '-'.join(subscription[0].split())

    subscription = ' '.join(subscription).split()
    return subscription


def reduce_internal_whitespace(string_list):
    """ Reduce the internal whitespace of each string in stringlist to one space """
    return [re.sub(r'\s+', ' ', string) for string in string_list]


def get_subscription_dict(subscription):
    """ return a tuple (sub_name, info_dict) """
    sub_info = {
        'subscription_id': subscription[SubscriptionListIndexes.SUB_ID],
        'state': subscription[SubscriptionListIndexes.STATE]
    }
    return (subscription[SubscriptionListIndexes.SUB_NAME], sub_info)


def subscription_list_to_dict(subscription_list):
    """ Return list of subscription strings in dict form """
    subscriptions = {}
    for subscription in subscription_list:
        subscription = join_sub_name(subscription)
        name, info_dict = get_subscription_dict(subscription)
        subscriptions[name] = info_dict

    return subscriptions


def get_azure_subscriptions_logged_in():
    """ return a list of accounts that are logged into az cli """
    num_table_headings = 2

    account_table_rows = cmd_return_output(
        'az account list -o table').rstrip().split('\n')
    subscriptions = remove_table_headings(
        account_table_rows, num_table_headings)
    return subscription_list_to_dict(reduce_internal_whitespace(subscriptions))
