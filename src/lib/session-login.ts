export type SessionLoginResponse =
	| { accessToken: string; mfaRequired?: false }
	| { mfaRequired: true; mfaToken: string }

export function isMfaEmailRequired(
	data: SessionLoginResponse,
): data is { mfaRequired: true; mfaToken: string } {
	return (
		typeof data === 'object' &&
		data !== null &&
		'mfaRequired' in data &&
		data.mfaRequired === true &&
		typeof (data as { mfaToken?: string }).mfaToken === 'string'
	)
}
