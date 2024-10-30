# Immich Public Proxy

Share your Immich photos and albums in a safe way without exposing your Immich instance to the public.

<p align="center" width="100%">
<img src="public/images/immich.png" width="180" height="180">
</p>

Immich is a wonderful bit of software, but since it holds all your private photos it's best to keep it fully locked down.
This presents a problem when you want to share a photo or a gallery with someone.

**Immich Public Proxy** provides a barrier of security between the public and Immich, and _only_ allows through requests 
which you have publicly shared. When it receives a valid request, it talks to Immich locally via API and returns only
those shared images.

It exposes no ports, allows no incoming data, and has no API to exploit.

The ideal setup is to have Immich secured privately behind VPN or mTLS, and only allow public access to Immich Public Proxy.

[Live demo](https://immich-demo.note.sx/share/ffSw63qnIYMtpmg0RNvOui0Dpio7BbxsObjvH8YZaobIjIAzl5n7zTX5d6EDHdOYEvo)

## How to install

1. Clone the repo:

```bash
git clone https://github.com/alangrainger/immich-public-proxy.git
```

2. Create a `.env` file to configure the app.

```
IMMICH_URL=http://localhost:2283
API_KEY="Get this from your Immich Account Settings page"
PORT=3000
CACHE_AGE=2592000
```

- `IMMICH_URL` is the URL to access Immich in your local network. This is not your public URL.
- `API_KEY` get this from the Account Settings page of your Immich user account
- `CACHE_AGE` by default, assets will be cached for 30 days. Set this to 0 to disable caching.

3. Start the docker container:

```bash
docker-compose up -d
```

4. Set the "External domain" in your Immich **Server Settings** to be the same as the public URL for your Immich Public Proxy:

<img src="public/images/server-settings.png" width="418" height="205">

Now whenever you share an image or gallery through Immich, it will automatically create the 
correct public path for you.
