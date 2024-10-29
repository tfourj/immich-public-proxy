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
     * For photos, you can request 'thumbnail' or 'original' size.
     * For videos, it is Immich's streaming quality, not the original quality.
     */
    getAssetBuffer(asset, size) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            switch (asset.type) {
                case types_1.AssetType.image:
                    size = size === types_1.ImageSize.thumbnail ? types_1.ImageSize.thumbnail : types_1.ImageSize.original;
                    return this.request('/assets/' + asset.id + '/' + size);
                case types_1.AssetType.video:
                    return this.request('/assets/' + asset.id + '/video/playback');
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
        return `${process.env.SERVER_URL}/photo/${key}/${id}` + (size ? `?size=${size}` : '');
    }
    /**
     * Return the video data URL for a video
     */
    videoUrl(key, id) {
        return `${process.env.SERVER_URL}/video/${key}/${id}`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1taWNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2ltbWljaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBaUU7QUFDakUsMERBQXlCO0FBRXpCLE1BQU0sTUFBTTtJQUNWOzs7T0FHRztJQUNHLE9BQU8sQ0FBRSxRQUFnQjs7WUFDN0IsTUFBTSxHQUFHLEdBQUcsTUFBTSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsTUFBTSxHQUFHLFFBQVEsRUFBRTtnQkFDbEUsT0FBTyxFQUFFO29CQUNQLFdBQVcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sSUFBSSxFQUFFO2lCQUN2QzthQUNGLENBQUMsQ0FBQTtZQUNGLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztnQkFDdkIsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFBO2dCQUN6RCxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDO29CQUM3QyxPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtnQkFDbkIsQ0FBQztxQkFBTSxDQUFDO29CQUNOLE9BQU8sR0FBRyxDQUFBO2dCQUNaLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztLQUFBO0lBRUQ7Ozs7O09BS0c7SUFDRyxhQUFhLENBQUUsR0FBVzs7WUFDOUIsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFBLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsS0FBSSxFQUFFLENBQWlCLENBQUE7WUFDdkUsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUE7WUFDekMsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDVCwwQ0FBMEM7Z0JBQzFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQTtnQkFDbkQsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUEsZUFBSyxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFBLGVBQUssR0FBRSxFQUFFLENBQUM7b0JBQ3RELHdCQUF3QjtnQkFDMUIsQ0FBQztxQkFBTSxDQUFDO29CQUNOLE9BQU8sSUFBSSxDQUFBO2dCQUNiLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztLQUFBO0lBRUQ7Ozs7T0FJRztJQUNHLGNBQWMsQ0FBRSxLQUFZLEVBQUUsSUFBZ0I7O1lBQ2xELFFBQVEsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNuQixLQUFLLGlCQUFTLENBQUMsS0FBSztvQkFDbEIsSUFBSSxHQUFHLElBQUksS0FBSyxpQkFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsaUJBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGlCQUFTLENBQUMsUUFBUSxDQUFBO29CQUM5RSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFBO2dCQUN6RCxLQUFLLGlCQUFTLENBQUMsS0FBSztvQkFDbEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLGlCQUFpQixDQUFDLENBQUE7WUFDbEUsQ0FBQztRQUNILENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ0csY0FBYyxDQUFFLEtBQVk7O1lBQ2hDLE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNwRCxPQUFPLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQ2hELENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ0gsUUFBUSxDQUFFLEdBQVcsRUFBRSxFQUFVLEVBQUUsSUFBZ0I7UUFDakQsT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxVQUFVLEdBQUcsSUFBSSxFQUFFLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDdkYsQ0FBQztJQUVEOztPQUVHO0lBQ0gsUUFBUSxDQUFFLEdBQVcsRUFBRSxFQUFVO1FBQy9CLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsVUFBVSxHQUFHLElBQUksRUFBRSxFQUFFLENBQUE7SUFDdkQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBSSxDQUFFLEVBQVU7UUFDZCxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGdFQUFnRSxDQUFDLENBQUE7SUFDckYsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSyxDQUFFLEdBQVc7UUFDaEIsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUNoQyxDQUFDO0NBQ0Y7QUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFBO0FBRTNCLGtCQUFlLE1BQU0sQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFzc2V0LCBBc3NldFR5cGUsIEltYWdlU2l6ZSwgU2hhcmVkTGluayB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgZGF5anMgZnJvbSAnZGF5anMnXG5cbmNsYXNzIEltbWljaCB7XG4gIC8qKlxuICAgKiBNYWtlIGEgcmVxdWVzdCB0byBJbW1pY2ggQVBJLiBXZSdyZSBub3QgdXNpbmcgdGhlIFNESyB0byBsaW1pdFxuICAgKiB0aGUgcG9zc2libGUgYXR0YWNrIHN1cmZhY2Ugb2YgdGhpcyBhcHAuXG4gICAqL1xuICBhc3luYyByZXF1ZXN0IChlbmRwb2ludDogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2gocHJvY2Vzcy5lbnYuSU1NSUNIX1VSTCArICcvYXBpJyArIGVuZHBvaW50LCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICd4LWFwaS1rZXknOiBwcm9jZXNzLmVudi5BUElfS0VZIHx8ICcnXG4gICAgICB9XG4gICAgfSlcbiAgICBpZiAocmVzLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICBjb25zdCBjb250ZW50VHlwZSA9IHJlcy5oZWFkZXJzLmdldCgnQ29udGVudC1UeXBlJykgfHwgJydcbiAgICAgIGlmIChjb250ZW50VHlwZS5pbmNsdWRlcygnYXBwbGljYXRpb24vanNvbicpKSB7XG4gICAgICAgIHJldHVybiByZXMuanNvbigpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVzXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFF1ZXJ5IEltbWljaCBmb3IgdGhlIFNoYXJlZExpbmsgbWV0YWRhdGEgZm9yIGEgZ2l2ZW4ga2V5LlxuICAgKiBUaGUga2V5IGlzIHdoYXQgaXMgcmV0dXJuZWQgaW4gdGhlIFVSTCB3aGVuIHlvdSBjcmVhdGUgYSBzaGFyZSBpbiBJbW1pY2guXG4gICAqIEltbWljaCBkb2Vzbid0IGhhdmUgYSBtZXRob2QgdG8gcXVlcnkgYnkga2V5LCBzbyB0aGlzIG1ldGhvZCBnZXRzIGFsbFxuICAgKiBrbm93biBzaGFyZWQgbGlua3MsIGFuZCByZXR1cm5zIHRoZSBsaW5rIHdoaWNoIG1hdGNoZXMgdGhlIHByb3ZpZGVkIGtleS5cbiAgICovXG4gIGFzeW5jIGdldFNoYXJlQnlLZXkgKGtleTogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVzID0gKGF3YWl0IHRoaXMucmVxdWVzdCgnL3NoYXJlZC1saW5rcycpIHx8IFtdKSBhcyBTaGFyZWRMaW5rW11cbiAgICBjb25zdCBsaW5rID0gcmVzLmZpbmQoeCA9PiB4LmtleSA9PT0ga2V5KVxuICAgIGlmIChsaW5rKSB7XG4gICAgICAvLyBGaWx0ZXIgYXNzZXRzIHRvIGV4Y2x1ZGUgdHJhc2hlZCBhc3NldHNcbiAgICAgIGxpbmsuYXNzZXRzID0gbGluay5hc3NldHMuZmlsdGVyKHggPT4gIXguaXNUcmFzaGVkKVxuICAgICAgaWYgKGxpbmsuZXhwaXJlc0F0ICYmIGRheWpzKGxpbmsuZXhwaXJlc0F0KSA8IGRheWpzKCkpIHtcbiAgICAgICAgLy8gVGhpcyBsaW5rIGhhcyBleHBpcmVkXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbGlua1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdHJlYW0gYXNzZXQgYnVmZmVyIGRhdGEgZnJvbSBJbW1pY2guXG4gICAqIEZvciBwaG90b3MsIHlvdSBjYW4gcmVxdWVzdCAndGh1bWJuYWlsJyBvciAnb3JpZ2luYWwnIHNpemUuXG4gICAqIEZvciB2aWRlb3MsIGl0IGlzIEltbWljaCdzIHN0cmVhbWluZyBxdWFsaXR5LCBub3QgdGhlIG9yaWdpbmFsIHF1YWxpdHkuXG4gICAqL1xuICBhc3luYyBnZXRBc3NldEJ1ZmZlciAoYXNzZXQ6IEFzc2V0LCBzaXplPzogSW1hZ2VTaXplKSB7XG4gICAgc3dpdGNoIChhc3NldC50eXBlKSB7XG4gICAgICBjYXNlIEFzc2V0VHlwZS5pbWFnZTpcbiAgICAgICAgc2l6ZSA9IHNpemUgPT09IEltYWdlU2l6ZS50aHVtYm5haWwgPyBJbWFnZVNpemUudGh1bWJuYWlsIDogSW1hZ2VTaXplLm9yaWdpbmFsXG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QoJy9hc3NldHMvJyArIGFzc2V0LmlkICsgJy8nICsgc2l6ZSlcbiAgICAgIGNhc2UgQXNzZXRUeXBlLnZpZGVvOlxuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KCcvYXNzZXRzLycgKyBhc3NldC5pZCArICcvdmlkZW8vcGxheWJhY2snKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGNvbnRlbnQtdHlwZSBvZiBhbiBJbW1pY2ggYXNzZXRcbiAgICovXG4gIGFzeW5jIGdldENvbnRlbnRUeXBlIChhc3NldDogQXNzZXQpIHtcbiAgICBjb25zdCBhc3NldEJ1ZmZlciA9IGF3YWl0IHRoaXMuZ2V0QXNzZXRCdWZmZXIoYXNzZXQpXG4gICAgcmV0dXJuIGFzc2V0QnVmZmVyLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgaW1hZ2UgZGF0YSBVUkwgZm9yIGEgcGhvdG9cbiAgICovXG4gIHBob3RvVXJsIChrZXk6IHN0cmluZywgaWQ6IHN0cmluZywgc2l6ZT86IEltYWdlU2l6ZSkge1xuICAgIHJldHVybiBgJHtwcm9jZXNzLmVudi5TRVJWRVJfVVJMfS9waG90by8ke2tleX0vJHtpZH1gICsgKHNpemUgPyBgP3NpemU9JHtzaXplfWAgOiAnJylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHZpZGVvIGRhdGEgVVJMIGZvciBhIHZpZGVvXG4gICAqL1xuICB2aWRlb1VybCAoa2V5OiBzdHJpbmcsIGlkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYCR7cHJvY2Vzcy5lbnYuU0VSVkVSX1VSTH0vdmlkZW8vJHtrZXl9LyR7aWR9YFxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgcHJvdmlkZWQgSUQgbWF0Y2hlcyB0aGUgSW1taWNoIElEIGZvcm1hdFxuICAgKi9cbiAgaXNJZCAoaWQ6IHN0cmluZykge1xuICAgIHJldHVybiAhIWlkLm1hdGNoKC9eWzAtOWEtZl17OH0tWzAtOWEtZl17NH0tWzAtOWEtZl17NH0tWzAtOWEtZl17NH0tWzAtOWEtZl17MTJ9JC8pXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYSBwcm92aWRlZCBrZXkgbWF0Y2hlcyB0aGUgSW1taWNoIHNoYXJlZC1saW5rIGtleSBmb3JtYXRcbiAgICovXG4gIGlzS2V5IChrZXk6IHN0cmluZykge1xuICAgIHJldHVybiAhIWtleS5tYXRjaCgvXltcXHctXSskLylcbiAgfVxufVxuXG5jb25zdCBpbW1pY2ggPSBuZXcgSW1taWNoKClcblxuZXhwb3J0IGRlZmF1bHQgaW1taWNoXG4iXX0=