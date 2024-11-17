# Running IPP on a single domain with Immich

Because everything related to IPP happens within the `/share` path,
you can serve Immich and IPP on the same domain by configuring your reverse
proxy to send all `/share/*` requests to IPP.

## Caddy

Here's an example of how to do this with Caddy:

```
https://your-domain.com {
    # Immich Public Proxy paths
    @public path /share /share/*
    handle @public {
        # Your IPP server and port
        reverse_proxy your_server:3000
    }
    
    # All other paths, require basic auth and send to Immich
    handle {
        basicauth {
            user password_hash
        }
        # Your Immich server and port
        reverse_proxy your_server:2283
    }
}
```
