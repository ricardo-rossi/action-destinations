import { RequestOptions, IntegrationError } from '@segment/actions-core'

const BASE_API_URL = 'https://api.criteo.com/2022-01'

export type RequestFn = (url: string, options?: RequestOptions) => Promise<Response>

export type Operation = {
    operation_type: string,
    audience_id: string,
    user_list: string[]
}

export type ClientCredentials = {
    client_id: string,
    client_secret: string
}

const getRequestHeaders = async (
    request: RequestFn,
    credentials: ClientCredentials
): Promise<Record<string, string>> => {
    let access_token: string = await getAccessToken(request, credentials);

    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ` + access_token
    }
}

const getAccessToken = async (
    request: RequestFn,
    credentials: ClientCredentials
): Promise<string> => {
    const res = await request(`https://api.criteo.com/oauth2/token`, {
        method: 'POST',
        body: new URLSearchParams({
            client_id: credentials.client_id,
            client_secret: credentials.client_secret,
            grant_type: 'client_credentials'
        }),
        headers: {
            'Accept': 'text/plain',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    })
    let body = await res.json()

    return body.access_token
}

export const patchAudience = async (
    request: RequestFn,
    operation: Operation,
    credentials: ClientCredentials
): Promise<Response> => {

    if (operation.operation_type !== "add" && operation.operation_type !== "remove")
        throw new Error(`Incorrect operation type: ${operation.operation_type}`)
    if (isNaN(+operation.audience_id))
        throw new Error(`The Audience ID should be a number (${operation.audience_id})`)

    const endpoint = `${BASE_API_URL}/audiences/${operation.audience_id}/contactlist`
    const headers = getRequestHeaders(request, credentials);
    const payload = {
        "data": {
            "type": "ContactlistAmendment",
            "attributes": {
                "operation": operation.operation_type,
                "identifierType": "email",
                "identifiers": operation.user_list
            }
        }
    }

    return request(
        endpoint,
        {
            method: 'PATCH',
            json: payload,
            headers: headers
        }
    )

}

export const getAdvertiserAudiences = async (
    request: RequestFn,
    advertiser_id: string,
    credentials: ClientCredentials
): Promise<Array<Record<string, any>>> => {
    if (isNaN(+advertiser_id))
        throw new IntegrationError('The Advertiser ID should be a number', 'Invalid input', 400)

    const endpoint = `${BASE_API_URL}/audiences?advertiser-id=${advertiser_id}`
    const headers = getRequestHeaders(request, credentials);
    const response = await request(
        endpoint, { method: 'GET', headers: headers }
    )

    const body = await response.json()

    if (response.status !== 200)
        throw new Error(`Error while fetching the Advertiser's audiences: ${JSON.stringify(body.errors)}`)

    return body.data
}

export const getAudienceId = async (
    request: RequestFn,
    advertiser_id: string,
    audience_name: string,
    credentials: ClientCredentials
): Promise<string> => {
    if (!audience_name)
        throw new Error(`Invalid Audience Name: ${audience_name}`)

    const advertiser_audiences = await getAdvertiserAudiences(request, advertiser_id, credentials)

    advertiser_audiences.forEach(audience => {
        if (audience.attributes.name === audience_name)
            return audience.id
    });

    return await createAudience(request, advertiser_id, audience_name, credentials)
}

export const createAudience = async (
    request: RequestFn,
    advertiser_id: string,
    audience_name: string,
    credentials: ClientCredentials
): Promise<string> => {
    if (!audience_name)
        throw new Error(`Invalid Audience Name: ${audience_name}`)
    if (isNaN(+advertiser_id))
        throw new IntegrationError('The Advertiser ID should be a number', 'Invalid input', 400)

    const endpoint = `${BASE_API_URL}/audiences`
    const headers = getRequestHeaders(request, credentials);
    const payload = {
        "data": {
            "attributes": {
                "advertiserId": advertiser_id,
                "name": audience_name,
                "description": audience_name
            },
            "type": "Audience"
        }
    }

    const response = await request(
        endpoint, { method: 'POST', headers: headers, json: payload }
    )
    const body = await response.json()

    if (response.status !== 200)
        throw new Error(`Error while fetching the Advertiser's audiences: ${JSON.stringify(body.errors)}`)

    return body.data.id
}

