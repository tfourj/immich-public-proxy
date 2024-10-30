"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const types_1 = require("./types");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
class Immich {
    /**
     * Make a request to Immich API. We're not using the SDK to limit
     * the possible attack surface of this app.
     */
    request(endpoint) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(process.env.IMMICH_URL + '/api' + endpoint, {
                headers: {
                    'x-api-key': process.env.API_KEY || ''
                }
            });
            if (res.status === 200) {
                const contentType = res.headers.get('Content-Type') || '';
                if (contentType.includes('application/json')) {
                    return res.json();
                }
                else {
                    return res;
                }
            }
        });
    }
    /**
     * Query Immich for the SharedLink metadata for a given key.
     * The key is what is returned in the URL when you create a share in Immich.
     *
     * Immich doesn't have a method to query by key, so this method gets all
     * known shared links, and returns the link which matches the provided key.
     */
    getShareByKey(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = ((yield this.request('/shared-links')) || []);
            const link = res.find(x => x.key === key);
            if (link) {
                // Filter assets to exclude trashed assets
                link.assets = link.assets.filter(x => !x.isTrashed);
                if (link.expiresAt && (0, dayjs_1.default)(link.expiresAt) < (0, dayjs_1.default)()) {
                    // This link has expired
                }
                else {
                    return link;
                }
            }
        });
    }
    /**
     * Stream asset buffer data from Immich.
     *
     * For photos, you can request 'thumbnail' or 'original' size.
     * For videos, it is Immich's streaming quality, not the original quality.
     */
    getAssetBuffer(asset, size) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            switch (asset.type) {
                case types_1.AssetType.image:
                    size = size === types_1.ImageSize.thumbnail ? types_1.ImageSize.thumbnail : types_1.ImageSize.original;
                    return this.request('/assets/' + encodeURIComponent(asset.id) + '/' + size);
                case types_1.AssetType.video:
                    return this.request('/assets/' + encodeURIComponent(asset.id) + '/video/playback');
            }
        });
    }
    /**
     * Get the content-type of an Immich asset
     */
    getContentType(asset) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const assetBuffer = yield this.getAssetBuffer(asset);
            return assetBuffer.headers.get('Content-Type');
        });
    }
    /**
     * Return the image data URL for a photo
     */
    photoUrl(key, id, size) {
        return `/photo/${key}/${id}` + (size ? `?size=${size}` : '');
    }
    /**
     * Return the video data URL for a video
     */
    videoUrl(key, id) {
        return `/video/${key}/${id}`;
    }
    /**
     * Check if a provided ID matches the Immich ID format
     */
    isId(id) {
        return !!id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    }
    /**
     * Check if a provided key matches the Immich shared-link key format
     */
    isKey(key) {
        return !!key.match(/^[\w-]+$/);
    }
}
const immich = new Immich();
exports.default = immich;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1taWNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2ltbWljaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBaUU7QUFDakUsMERBQXlCO0FBRXpCLE1BQU0sTUFBTTtJQUNWOzs7T0FHRztJQUNHLE9BQU8sQ0FBRSxRQUFnQjs7WUFDN0IsTUFBTSxHQUFHLEdBQUcsTUFBTSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsTUFBTSxHQUFHLFFBQVEsRUFBRTtnQkFDbEUsT0FBTyxFQUFFO29CQUNQLFdBQVcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sSUFBSSxFQUFFO2lCQUN2QzthQUNGLENBQUMsQ0FBQTtZQUNGLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztnQkFDdkIsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFBO2dCQUN6RCxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDO29CQUM3QyxPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtnQkFDbkIsQ0FBQztxQkFBTSxDQUFDO29CQUNOLE9BQU8sR0FBRyxDQUFBO2dCQUNaLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztLQUFBO0lBRUQ7Ozs7OztPQU1HO0lBQ0csYUFBYSxDQUFFLEdBQVc7O1lBQzlCLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQSxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLEtBQUksRUFBRSxDQUFpQixDQUFBO1lBQ3ZFLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFBO1lBQ3pDLElBQUksSUFBSSxFQUFFLENBQUM7Z0JBQ1QsMENBQTBDO2dCQUMxQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUE7Z0JBQ25ELElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFBLGVBQUssRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBQSxlQUFLLEdBQUUsRUFBRSxDQUFDO29CQUN0RCx3QkFBd0I7Z0JBQzFCLENBQUM7cUJBQU0sQ0FBQztvQkFDTixPQUFPLElBQUksQ0FBQTtnQkFDYixDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7S0FBQTtJQUVEOzs7OztPQUtHO0lBQ0csY0FBYyxDQUFFLEtBQVksRUFBRSxJQUFnQjs7WUFDbEQsUUFBUSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ25CLEtBQUssaUJBQVMsQ0FBQyxLQUFLO29CQUNsQixJQUFJLEdBQUcsSUFBSSxLQUFLLGlCQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsaUJBQVMsQ0FBQyxRQUFRLENBQUE7b0JBQzlFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQTtnQkFDN0UsS0FBSyxpQkFBUyxDQUFDLEtBQUs7b0JBQ2xCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLENBQUE7WUFDdEYsQ0FBQztRQUNILENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ0csY0FBYyxDQUFFLEtBQVk7O1lBQ2hDLE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNwRCxPQUFPLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQ2hELENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ0gsUUFBUSxDQUFFLEdBQVcsRUFBRSxFQUFVLEVBQUUsSUFBZ0I7UUFDakQsT0FBTyxVQUFVLEdBQUcsSUFBSSxFQUFFLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDOUQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsUUFBUSxDQUFFLEdBQVcsRUFBRSxFQUFVO1FBQy9CLE9BQU8sVUFBVSxHQUFHLElBQUksRUFBRSxFQUFFLENBQUE7SUFDOUIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBSSxDQUFFLEVBQVU7UUFDZCxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGdFQUFnRSxDQUFDLENBQUE7SUFDckYsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSyxDQUFFLEdBQVc7UUFDaEIsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUNoQyxDQUFDO0NBQ0Y7QUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFBO0FBRTNCLGtCQUFlLE1BQU0sQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFzc2V0LCBBc3NldFR5cGUsIEltYWdlU2l6ZSwgU2hhcmVkTGluayB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgZGF5anMgZnJvbSAnZGF5anMnXG5cbmNsYXNzIEltbWljaCB7XG4gIC8qKlxuICAgKiBNYWtlIGEgcmVxdWVzdCB0byBJbW1pY2ggQVBJLiBXZSdyZSBub3QgdXNpbmcgdGhlIFNESyB0byBsaW1pdFxuICAgKiB0aGUgcG9zc2libGUgYXR0YWNrIHN1cmZhY2Ugb2YgdGhpcyBhcHAuXG4gICAqL1xuICBhc3luYyByZXF1ZXN0IChlbmRwb2ludDogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2gocHJvY2Vzcy5lbnYuSU1NSUNIX1VSTCArICcvYXBpJyArIGVuZHBvaW50LCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICd4LWFwaS1rZXknOiBwcm9jZXNzLmVudi5BUElfS0VZIHx8ICcnXG4gICAgICB9XG4gICAgfSlcbiAgICBpZiAocmVzLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICBjb25zdCBjb250ZW50VHlwZSA9IHJlcy5oZWFkZXJzLmdldCgnQ29udGVudC1UeXBlJykgfHwgJydcbiAgICAgIGlmIChjb250ZW50VHlwZS5pbmNsdWRlcygnYXBwbGljYXRpb24vanNvbicpKSB7XG4gICAgICAgIHJldHVybiByZXMuanNvbigpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVzXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFF1ZXJ5IEltbWljaCBmb3IgdGhlIFNoYXJlZExpbmsgbWV0YWRhdGEgZm9yIGEgZ2l2ZW4ga2V5LlxuICAgKiBUaGUga2V5IGlzIHdoYXQgaXMgcmV0dXJuZWQgaW4gdGhlIFVSTCB3aGVuIHlvdSBjcmVhdGUgYSBzaGFyZSBpbiBJbW1pY2guXG4gICAqXG4gICAqIEltbWljaCBkb2Vzbid0IGhhdmUgYSBtZXRob2QgdG8gcXVlcnkgYnkga2V5LCBzbyB0aGlzIG1ldGhvZCBnZXRzIGFsbFxuICAgKiBrbm93biBzaGFyZWQgbGlua3MsIGFuZCByZXR1cm5zIHRoZSBsaW5rIHdoaWNoIG1hdGNoZXMgdGhlIHByb3ZpZGVkIGtleS5cbiAgICovXG4gIGFzeW5jIGdldFNoYXJlQnlLZXkgKGtleTogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVzID0gKGF3YWl0IHRoaXMucmVxdWVzdCgnL3NoYXJlZC1saW5rcycpIHx8IFtdKSBhcyBTaGFyZWRMaW5rW11cbiAgICBjb25zdCBsaW5rID0gcmVzLmZpbmQoeCA9PiB4LmtleSA9PT0ga2V5KVxuICAgIGlmIChsaW5rKSB7XG4gICAgICAvLyBGaWx0ZXIgYXNzZXRzIHRvIGV4Y2x1ZGUgdHJhc2hlZCBhc3NldHNcbiAgICAgIGxpbmsuYXNzZXRzID0gbGluay5hc3NldHMuZmlsdGVyKHggPT4gIXguaXNUcmFzaGVkKVxuICAgICAgaWYgKGxpbmsuZXhwaXJlc0F0ICYmIGRheWpzKGxpbmsuZXhwaXJlc0F0KSA8IGRheWpzKCkpIHtcbiAgICAgICAgLy8gVGhpcyBsaW5rIGhhcyBleHBpcmVkXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbGlua1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdHJlYW0gYXNzZXQgYnVmZmVyIGRhdGEgZnJvbSBJbW1pY2guXG4gICAqXG4gICAqIEZvciBwaG90b3MsIHlvdSBjYW4gcmVxdWVzdCAndGh1bWJuYWlsJyBvciAnb3JpZ2luYWwnIHNpemUuXG4gICAqIEZvciB2aWRlb3MsIGl0IGlzIEltbWljaCdzIHN0cmVhbWluZyBxdWFsaXR5LCBub3QgdGhlIG9yaWdpbmFsIHF1YWxpdHkuXG4gICAqL1xuICBhc3luYyBnZXRBc3NldEJ1ZmZlciAoYXNzZXQ6IEFzc2V0LCBzaXplPzogSW1hZ2VTaXplKSB7XG4gICAgc3dpdGNoIChhc3NldC50eXBlKSB7XG4gICAgICBjYXNlIEFzc2V0VHlwZS5pbWFnZTpcbiAgICAgICAgc2l6ZSA9IHNpemUgPT09IEltYWdlU2l6ZS50aHVtYm5haWwgPyBJbWFnZVNpemUudGh1bWJuYWlsIDogSW1hZ2VTaXplLm9yaWdpbmFsXG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QoJy9hc3NldHMvJyArIGVuY29kZVVSSUNvbXBvbmVudChhc3NldC5pZCkgKyAnLycgKyBzaXplKVxuICAgICAgY2FzZSBBc3NldFR5cGUudmlkZW86XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QoJy9hc3NldHMvJyArIGVuY29kZVVSSUNvbXBvbmVudChhc3NldC5pZCkgKyAnL3ZpZGVvL3BsYXliYWNrJylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjb250ZW50LXR5cGUgb2YgYW4gSW1taWNoIGFzc2V0XG4gICAqL1xuICBhc3luYyBnZXRDb250ZW50VHlwZSAoYXNzZXQ6IEFzc2V0KSB7XG4gICAgY29uc3QgYXNzZXRCdWZmZXIgPSBhd2FpdCB0aGlzLmdldEFzc2V0QnVmZmVyKGFzc2V0KVxuICAgIHJldHVybiBhc3NldEJ1ZmZlci5oZWFkZXJzLmdldCgnQ29udGVudC1UeXBlJylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGltYWdlIGRhdGEgVVJMIGZvciBhIHBob3RvXG4gICAqL1xuICBwaG90b1VybCAoa2V5OiBzdHJpbmcsIGlkOiBzdHJpbmcsIHNpemU/OiBJbWFnZVNpemUpIHtcbiAgICByZXR1cm4gYC9waG90by8ke2tleX0vJHtpZH1gICsgKHNpemUgPyBgP3NpemU9JHtzaXplfWAgOiAnJylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHZpZGVvIGRhdGEgVVJMIGZvciBhIHZpZGVvXG4gICAqL1xuICB2aWRlb1VybCAoa2V5OiBzdHJpbmcsIGlkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYC92aWRlby8ke2tleX0vJHtpZH1gXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYSBwcm92aWRlZCBJRCBtYXRjaGVzIHRoZSBJbW1pY2ggSUQgZm9ybWF0XG4gICAqL1xuICBpc0lkIChpZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuICEhaWQubWF0Y2goL15bMC05YS1mXXs4fS1bMC05YS1mXXs0fS1bMC05YS1mXXs0fS1bMC05YS1mXXs0fS1bMC05YS1mXXsxMn0kLylcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIHByb3ZpZGVkIGtleSBtYXRjaGVzIHRoZSBJbW1pY2ggc2hhcmVkLWxpbmsga2V5IGZvcm1hdFxuICAgKi9cbiAgaXNLZXkgKGtleTogc3RyaW5nKSB7XG4gICAgcmV0dXJuICEha2V5Lm1hdGNoKC9eW1xcdy1dKyQvKVxuICB9XG59XG5cbmNvbnN0IGltbWljaCA9IG5ldyBJbW1pY2goKVxuXG5leHBvcnQgZGVmYXVsdCBpbW1pY2hcbiJdfQ==