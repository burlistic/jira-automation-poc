""" Helpers for setting the subscription used in az cli """

def get_default_sub_name(subscriptions):
    """ return the name of the sub that is_default else None """
    for subscription in subscriptions:
        sub_dict = subscriptions[subscription]
        if sub_dict["is_default"]:
            return subscription

    return None
