"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const types_1 = require("./types");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const index_1 = require("./index");
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
            else {
                (0, index_1.log)('Immich API status ' + res.status);
                console.log(yield res.text());
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
            var _a;
            const res = ((yield this.request('/shared-links')) || []);
            const link = res.find(x => x.key === key);
            if (link) {
                if (link.expiresAt && (0, dayjs_1.default)(link.expiresAt) < (0, dayjs_1.default)()) {
                    // This link has expired
                    (0, index_1.log)('Expired link ' + key);
                }
                else {
                    if (link.type === 'ALBUM') {
                        // Fetch the assets from the album and populate the SharedLink assets array
                        const albumId = (_a = link.album) === null || _a === void 0 ? void 0 : _a.id;
                        if (albumId) {
                            const album = (yield this.request('/albums/' + encodeURIComponent(albumId)));
                            link.assets = album.assets || [];
                        }
                    }
                    // Filter assets to exclude trashed assets
                    link.assets = link.assets.filter(x => !x.isTrashed);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1taWNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2ltbWljaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBd0U7QUFDeEUsMERBQXlCO0FBQ3pCLG1DQUE2QjtBQUU3QixNQUFNLE1BQU07SUFDVjs7O09BR0c7SUFDRyxPQUFPLENBQUUsUUFBZ0I7O1lBQzdCLE1BQU0sR0FBRyxHQUFHLE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLE1BQU0sR0FBRyxRQUFRLEVBQUU7Z0JBQ2xFLE9BQU8sRUFBRTtvQkFDUCxXQUFXLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLElBQUksRUFBRTtpQkFDdkM7YUFDRixDQUFDLENBQUE7WUFDRixJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7Z0JBQ3ZCLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtnQkFDekQsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQztvQkFDN0MsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUE7Z0JBQ25CLENBQUM7cUJBQU0sQ0FBQztvQkFDTixPQUFPLEdBQUcsQ0FBQTtnQkFDWixDQUFDO1lBQ0gsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLElBQUEsV0FBRyxFQUFDLG9CQUFvQixHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtnQkFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBO1lBQy9CLENBQUM7UUFDSCxDQUFDO0tBQUE7SUFFRDs7Ozs7O09BTUc7SUFDRyxhQUFhLENBQUUsR0FBVzs7O1lBQzlCLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQSxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsZUFB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QUssQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFBO0lBQ3JGLENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUssQ0FBRSxHQUFXO1FBQ2hCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDaEMsQ0FBQztDQUNGO0FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQTtBQUUzQixrQkFBZSxNQUFNLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBbGJ1bSwgQXNzZXQsIEFzc2V0VHlwZSwgSW1hZ2VTaXplLCBTaGFyZWRMaW5rIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCBkYXlqcyBmcm9tICdkYXlqcydcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4vaW5kZXgnXG5cbmNsYXNzIEltbWljaCB7XG4gIC8qKlxuICAgKiBNYWtlIGEgcmVxdWVzdCB0byBJbW1pY2ggQVBJLiBXZSdyZSBub3QgdXNpbmcgdGhlIFNESyB0byBsaW1pdFxuICAgKiB0aGUgcG9zc2libGUgYXR0YWNrIHN1cmZhY2Ugb2YgdGhpcyBhcHAuXG4gICAqL1xuICBhc3luYyByZXF1ZXN0IChlbmRwb2ludDogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2gocHJvY2Vzcy5lbnYuSU1NSUNIX1VSTCArICcvYXBpJyArIGVuZHBvaW50LCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICd4LWFwaS1rZXknOiBwcm9jZXNzLmVudi5BUElfS0VZIHx8ICcnXG4gICAgICB9XG4gICAgfSlcbiAgICBpZiAocmVzLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICBjb25zdCBjb250ZW50VHlwZSA9IHJlcy5oZWFkZXJzLmdldCgnQ29udGVudC1UeXBlJykgfHwgJydcbiAgICAgIGlmIChjb250ZW50VHlwZS5pbmNsdWRlcygnYXBwbGljYXRpb24vanNvbicpKSB7XG4gICAgICAgIHJldHVybiByZXMuanNvbigpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVzXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZygnSW1taWNoIEFQSSBzdGF0dXMgJyArIHJlcy5zdGF0dXMpXG4gICAgICBjb25zb2xlLmxvZyhhd2FpdCByZXMudGV4dCgpKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBRdWVyeSBJbW1pY2ggZm9yIHRoZSBTaGFyZWRMaW5rIG1ldGFkYXRhIGZvciBhIGdpdmVuIGtleS5cbiAgICogVGhlIGtleSBpcyB3aGF0IGlzIHJldHVybmVkIGluIHRoZSBVUkwgd2hlbiB5b3UgY3JlYXRlIGEgc2hhcmUgaW4gSW1taWNoLlxuICAgKlxuICAgKiBJbW1pY2ggZG9lc24ndCBoYXZlIGEgbWV0aG9kIHRvIHF1ZXJ5IGJ5IGtleSwgc28gdGhpcyBtZXRob2QgZ2V0cyBhbGxcbiAgICoga25vd24gc2hhcmVkIGxpbmtzLCBhbmQgcmV0dXJucyB0aGUgbGluayB3aGljaCBtYXRjaGVzIHRoZSBwcm92aWRlZCBrZXkuXG4gICAqL1xuICBhc3luYyBnZXRTaGFyZUJ5S2V5IChrZXk6IHN0cmluZykge1xuICAgIGNvbnN0IHJlcyA9IChhd2FpdCB0aGlzLnJlcXVlc3QoJy9zaGFyZWQtbGlua3MnKSB8fCBbXSkgYXMgU2hhcmVkTGlua1tdXG4gICAgY29uc3QgbGluayA9IHJlcy5maW5kKHggPT4geC5rZXkgPT09IGtleSlcbiAgICBpZiAobGluaykge1xuICAgICAgaWYgKGxpbmsuZXhwaXJlc0F0ICYmIGRheWpzKGxpbmsuZXhwaXJlc0F0KSA8IGRheWpzKCkpIHtcbiAgICAgICAgLy8gVGhpcyBsaW5rIGhhcyBleHBpcmVkXG4gICAgICAgIGxvZygnRXhwaXJlZCBsaW5rICcgKyBrZXkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobGluay50eXBlID09PSAnQUxCVU0nKSB7XG4gICAgICAgICAgLy8gRmV0Y2ggdGhlIGFzc2V0cyBmcm9tIHRoZSBhbGJ1bSBhbmQgcG9wdWxhdGUgdGhlIFNoYXJlZExpbmsgYXNzZXRzIGFycmF5XG4gICAgICAgICAgY29uc3QgYWxidW1JZCA9IGxpbmsuYWxidW0/LmlkXG4gICAgICAgICAgaWYgKGFsYnVtSWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGFsYnVtID0gKGF3YWl0IHRoaXMucmVxdWVzdCgnL2FsYnVtcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KGFsYnVtSWQpKSkgYXMgQWxidW1cbiAgICAgICAgICAgIGxpbmsuYXNzZXRzID0gYWxidW0uYXNzZXRzIHx8IFtdXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEZpbHRlciBhc3NldHMgdG8gZXhjbHVkZSB0cmFzaGVkIGFzc2V0c1xuICAgICAgICBsaW5rLmFzc2V0cyA9IGxpbmsuYXNzZXRzLmZpbHRlcih4ID0+ICF4LmlzVHJhc2hlZClcbiAgICAgICAgcmV0dXJuIGxpbmtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3RyZWFtIGFzc2V0IGJ1ZmZlciBkYXRhIGZyb20gSW1taWNoLlxuICAgKlxuICAgKiBGb3IgcGhvdG9zLCB5b3UgY2FuIHJlcXVlc3QgJ3RodW1ibmFpbCcgb3IgJ29yaWdpbmFsJyBzaXplLlxuICAgKiBGb3IgdmlkZW9zLCBpdCBpcyBJbW1pY2gncyBzdHJlYW1pbmcgcXVhbGl0eSwgbm90IHRoZSBvcmlnaW5hbCBxdWFsaXR5LlxuICAgKi9cbiAgYXN5bmMgZ2V0QXNzZXRCdWZmZXIgKGFzc2V0OiBBc3NldCwgc2l6ZT86IEltYWdlU2l6ZSkge1xuICAgIHN3aXRjaCAoYXNzZXQudHlwZSkge1xuICAgICAgY2FzZSBBc3NldFR5cGUuaW1hZ2U6XG4gICAgICAgIHNpemUgPSBzaXplID09PSBJbWFnZVNpemUudGh1bWJuYWlsID8gSW1hZ2VTaXplLnRodW1ibmFpbCA6IEltYWdlU2l6ZS5vcmlnaW5hbFxuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KCcvYXNzZXRzLycgKyBlbmNvZGVVUklDb21wb25lbnQoYXNzZXQuaWQpICsgJy8nICsgc2l6ZSlcbiAgICAgIGNhc2UgQXNzZXRUeXBlLnZpZGVvOlxuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KCcvYXNzZXRzLycgKyBlbmNvZGVVUklDb21wb25lbnQoYXNzZXQuaWQpICsgJy92aWRlby9wbGF5YmFjaycpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY29udGVudC10eXBlIG9mIGFuIEltbWljaCBhc3NldFxuICAgKi9cbiAgYXN5bmMgZ2V0Q29udGVudFR5cGUgKGFzc2V0OiBBc3NldCkge1xuICAgIGNvbnN0IGFzc2V0QnVmZmVyID0gYXdhaXQgdGhpcy5nZXRBc3NldEJ1ZmZlcihhc3NldClcbiAgICByZXR1cm4gYXNzZXRCdWZmZXIuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBpbWFnZSBkYXRhIFVSTCBmb3IgYSBwaG90b1xuICAgKi9cbiAgcGhvdG9VcmwgKGtleTogc3RyaW5nLCBpZDogc3RyaW5nLCBzaXplPzogSW1hZ2VTaXplKSB7XG4gICAgcmV0dXJuIGAvcGhvdG8vJHtrZXl9LyR7aWR9YCArIChzaXplID8gYD9zaXplPSR7c2l6ZX1gIDogJycpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSB2aWRlbyBkYXRhIFVSTCBmb3IgYSB2aWRlb1xuICAgKi9cbiAgdmlkZW9VcmwgKGtleTogc3RyaW5nLCBpZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGAvdmlkZW8vJHtrZXl9LyR7aWR9YFxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgcHJvdmlkZWQgSUQgbWF0Y2hlcyB0aGUgSW1taWNoIElEIGZvcm1hdFxuICAgKi9cbiAgaXNJZCAoaWQ6IHN0cmluZykge1xuICAgIHJldHVybiAhIWlkLm1hdGNoKC9eWzAtOWEtZl17OH0tWzAtOWEtZl17NH0tWzAtOWEtZl17NH0tWzAtOWEtZl17NH0tWzAtOWEtZl17MTJ9JC8pXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYSBwcm92aWRlZCBrZXkgbWF0Y2hlcyB0aGUgSW1taWNoIHNoYXJlZC1saW5rIGtleSBmb3JtYXRcbiAgICovXG4gIGlzS2V5IChrZXk6IHN0cmluZykge1xuICAgIHJldHVybiAhIWtleS5tYXRjaCgvXltcXHctXSskLylcbiAgfVxufVxuXG5jb25zdCBpbW1pY2ggPSBuZXcgSW1taWNoKClcblxuZXhwb3J0IGRlZmF1bHQgaW1taWNoXG4iXX0=