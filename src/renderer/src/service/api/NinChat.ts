export const pingNinChatCredentials = (credentials: { username: string; password: string }) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            caller_type: 'email',
            caller_name: credentials.username,
            caller_auth: credentials.password,
            action: 'describe_queue',
            queue_id: '8vqvq89d004us'
        })
    };

    return fetch('https://api.ninchat.com/v2/call', options)
        .then((res) => {
            if (res.status !== 200) {
                throw res;
            }
            return res;
        })
        .then((res) => res.json())
        .then((res) => {
            if (
                res['error_type'] === 'access_denied' ||
                res['error_type'] === 'identity_not_found'
            ) {
                throw { status: 403, statusText: 'access_denied' };
            }
            return res;
        });
};
