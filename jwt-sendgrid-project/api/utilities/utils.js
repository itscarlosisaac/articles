export function build_verification_link(request, token) {
    const base_url = `${request.protocol}://${
    request.hostname === 'localhost'
        ? `${request.hostname}:${3000}`
        : `${request.hostname}`
        }${request.baseUrl}`;
    return `${base_url}/verify-email?token=${token}`;
}
