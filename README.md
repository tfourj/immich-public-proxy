# Immich Public Proxy

<p align="center" width="100%">
<img src="public/images/immich.png" width="200" height="200">
</p>

Immich is a wonderful bit of software, but since it holds all your private photos it's best to keep it fully locked down.
This presents a problem when you want to share a photo or a gallery with someone.

**Immich Public Proxy** provides a barrier of security between the public and Immich, and _only_ allows through requests 
which you have publicly shared. When it receives a valid request, it talks to Immich locally via API and returns only
those shared images.

It exposes no ports, allows no incoming data, and has no API to exploit.

The ideal setup is to have Immich secured privately behind VPN or mTLS, and only allow public access to Immich Public Proxy.

## How to install

1. Clone the repo:

```bash
git clone https://github.com/alangrainger/immich-public-proxy.git
```

2. Create a `.env` file to configure the app.

```
IMMICH_URL=http://localhost:2283
API_KEY="Get this from your Immich Account Settings page"
SERVER_URL=https://shared.example.com
SERVER_PORT=3000
CACHE_AGE=2592000
```

- `IMMICH_URL` is the URL to access Immich in your local network. This is not your public URL.
- `SERVER_URL` will be the public URL for accessing this Immich Public Proxy app.
- `CACHE_AGE` by default, assets will be cached for 30 days. Set this to 0 to disable caching.

3. Start the docker container:

```bash
docker-compose up -d
```

4. Set the same `SERVER_URL` as your "External domain" in your Immich **Server Settings**:

<img src="public/images/server-settings.png" width="418" height="205">

Now whenever you share an image or gallery through Immich, it will automatically create the 
correct public path for you.
