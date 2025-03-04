# Customising your web responses

To avoid giving information away about your server, IPP responds with a limited set of HTTP status codes:

| Code | Reason                                                                                          |
|------|-------------------------------------------------------------------------------------------------|
| 503  | Healthcheck failed: Immich is not accessible. Only on the `/healthcheck` route.                 |
| 401  | Invalid password provided for a password-protected share link.                                  |
| 404  | All other invalid requests, e.g. album doesn't exist, share link is expired, non-existing file. |

Instead of sending these codes, you can customise the response(s) using your reverse proxy. For example you could:

- Send a different response code.
- Send your own custom 404 page.
- Redirect to a new website.
- Drop the connection entirely (no response).
- And so on...

## Caddy

```
https://ipp.example.com {
    reverse_proxy 192.168.1.1:3000 {
        @404 status 404
        handle_response @404 {
            respond "This would be a custom response"
        }
    }
}
```

If you wanted to drop the connection completely without responding at all, you can use:

```
        handle_response @404 {
            abort
        }
```

## Apache

```
<VirtualHost *:80>
    ProxyErrorOverride On 404
    ErrorDocument 404 /custom_404.html
    Alias /custom_404.html /var/www/html/error-pages/404.html
</VirtualHost>
```
