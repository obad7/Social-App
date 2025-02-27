
// check if user is friend
export const isFriend = (user, friend) => {
    if (
        friend.friends.map(String).includes(user._id.toString()) ||
        user.friends.map(String).includes(friend._id.toString())
    )
        return true;

    return false;
}

// check if request exists
export const requestExists = (user, friend) => {
    if (
        friend.friendRequest.map(String).includes(user._id.toString()) ||
        user.friendRequest.map(String).includes(friend._id.toString())
    )
        return true;

    return false;
}