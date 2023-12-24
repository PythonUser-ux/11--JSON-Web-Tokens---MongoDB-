JWTs can be considered a form of user identification that is issued after the initial user authentication takes place.
After the log in we are going to get an ACCESS TOKEN (short time) and a REFRESH TOKEN (long time)

ACCESS TOKEN:
- sent as JSON
- client stores in memory
- do NOT store in local storage or cookie (we want it to expire once the app is closed)

- issued at authorization time, middleware verify the token at each API access, when it expires a new token is issued by sending the refresh token to the API refresh endpoint.

REFRESH TOKEN
- issued at authorization time, sent as httpOnly cookie (which are not accessible through JavaScript + they will expire and force the user to log in again).

- when the user logs out, it should expire