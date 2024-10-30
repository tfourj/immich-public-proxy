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
            const res = ((yield this.request('/shared-links')) || []);
            const link = res.find(x => x.key === key);
            if (link) {
                // Filter assets to exclude trashed assets
                link.assets = link.assets.filter(x => !x.isTrashed);
                if (link.expiresAt && (0, dayjs_1.default)(link.expiresAt) < (0, dayjs_1.default)()) {
                    // This link has expired
                    (0, index_1.log)('Expired link ' + key);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1taWNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2ltbWljaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBaUU7QUFDakUsMERBQXlCO0FBQ3pCLG1DQUE2QjtBQUU3QixNQUFNLE1BQU07SUFDVjs7O09BR0c7SUFDRyxPQUFPLENBQUUsUUFBZ0I7O1lBQzdCLE1BQU0sR0FBRyxHQUFHLE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLE1BQU0sR0FBRyxRQUFRLEVBQUU7Z0JBQ2xFLE9BQU8sRUFBRTtvQkFDUCxXQUFXLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLElBQUksRUFBRTtpQkFDdkM7YUFDRixDQUFDLENBQUE7WUFDRixJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7Z0JBQ3ZCLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtnQkFDekQsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQztvQkFDN0MsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUE7Z0JBQ25CLENBQUM7cUJBQU0sQ0FBQztvQkFDTixPQUFPLEdBQUcsQ0FBQTtnQkFDWixDQUFDO1lBQ0gsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLElBQUEsV0FBRyxFQUFDLG9CQUFvQixHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtnQkFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBO1lBQy9CLENBQUM7UUFDSCxDQUFDO0tBQUE7SUFFRDs7Ozs7O09BTUc7SUFDRyxhQUFhLENBQUUsR0FBVzs7WUFDOUIsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFBLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsS0FBSSxFQUFFLENBQWlCLENBQUE7WUFDdkUsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUE7WUFDekMsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDVCwwQ0FBMEM7Z0JBQzFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQTtnQkFDbkQsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUEsZUFBSyxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFBLGVBQUssR0FBRSxFQUFFLENBQUM7b0JBQ3RELHdCQUF3QjtvQkFDeEIsSUFBQSxXQUFHLEVBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQyxDQUFBO2dCQUM1QixDQUFDO3FCQUFNLENBQUM7b0JBQ04sT0FBTyxJQUFJLENBQUE7Z0JBQ2IsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO0tBQUE7SUFFRDs7Ozs7T0FLRztJQUNHLGNBQWMsQ0FBRSxLQUFZLEVBQUUsSUFBZ0I7O1lBQ2xELFFBQVEsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNuQixLQUFLLGlCQUFTLENBQUMsS0FBSztvQkFDbEIsSUFBSSxHQUFHLElBQUksS0FBSyxpQkFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsaUJBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGlCQUFTLENBQUMsUUFBUSxDQUFBO29CQUM5RSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUE7Z0JBQzdFLEtBQUssaUJBQVMsQ0FBQyxLQUFLO29CQUNsQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxDQUFBO1lBQ3RGLENBQUM7UUFDSCxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNHLGNBQWMsQ0FBRSxLQUFZOztZQUNoQyxNQUFNLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDcEQsT0FBTyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUNoRCxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNILFFBQVEsQ0FBRSxHQUFXLEVBQUUsRUFBVSxFQUFFLElBQWdCO1FBQ2pELE9BQU8sVUFBVSxHQUFHLElBQUksRUFBRSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQzlELENBQUM7SUFFRDs7T0FFRztJQUNILFFBQVEsQ0FBRSxHQUFXLEVBQUUsRUFBVTtRQUMvQixPQUFPLFVBQVUsR0FBRyxJQUFJLEVBQUUsRUFBRSxDQUFBO0lBQzlCLENBQUM7SUFFRDs7T0FFRztJQUNILElBQUksQ0FBRSxFQUFVO1FBQ2QsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFBO0lBQ3JGLENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUssQ0FBRSxHQUFXO1FBQ2hCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDaEMsQ0FBQztDQUNGO0FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQTtBQUUzQixrQkFBZSxNQUFNLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBc3NldCwgQXNzZXRUeXBlLCBJbWFnZVNpemUsIFNoYXJlZExpbmsgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IGRheWpzIGZyb20gJ2RheWpzJ1xuaW1wb3J0IHsgbG9nIH0gZnJvbSAnLi9pbmRleCdcblxuY2xhc3MgSW1taWNoIHtcbiAgLyoqXG4gICAqIE1ha2UgYSByZXF1ZXN0IHRvIEltbWljaCBBUEkuIFdlJ3JlIG5vdCB1c2luZyB0aGUgU0RLIHRvIGxpbWl0XG4gICAqIHRoZSBwb3NzaWJsZSBhdHRhY2sgc3VyZmFjZSBvZiB0aGlzIGFwcC5cbiAgICovXG4gIGFzeW5jIHJlcXVlc3QgKGVuZHBvaW50OiBzdHJpbmcpIHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChwcm9jZXNzLmVudi5JTU1JQ0hfVVJMICsgJy9hcGknICsgZW5kcG9pbnQsIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ3gtYXBpLWtleSc6IHByb2Nlc3MuZW52LkFQSV9LRVkgfHwgJydcbiAgICAgIH1cbiAgICB9KVxuICAgIGlmIChyZXMuc3RhdHVzID09PSAyMDApIHtcbiAgICAgIGNvbnN0IGNvbnRlbnRUeXBlID0gcmVzLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKSB8fCAnJ1xuICAgICAgaWYgKGNvbnRlbnRUeXBlLmluY2x1ZGVzKCdhcHBsaWNhdGlvbi9qc29uJykpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5qc29uKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXNcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbG9nKCdJbW1pY2ggQVBJIHN0YXR1cyAnICsgcmVzLnN0YXR1cylcbiAgICAgIGNvbnNvbGUubG9nKGF3YWl0IHJlcy50ZXh0KCkpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFF1ZXJ5IEltbWljaCBmb3IgdGhlIFNoYXJlZExpbmsgbWV0YWRhdGEgZm9yIGEgZ2l2ZW4ga2V5LlxuICAgKiBUaGUga2V5IGlzIHdoYXQgaXMgcmV0dXJuZWQgaW4gdGhlIFVSTCB3aGVuIHlvdSBjcmVhdGUgYSBzaGFyZSBpbiBJbW1pY2guXG4gICAqXG4gICAqIEltbWljaCBkb2Vzbid0IGhhdmUgYSBtZXRob2QgdG8gcXVlcnkgYnkga2V5LCBzbyB0aGlzIG1ldGhvZCBnZXRzIGFsbFxuICAgKiBrbm93biBzaGFyZWQgbGlua3MsIGFuZCByZXR1cm5zIHRoZSBsaW5rIHdoaWNoIG1hdGNoZXMgdGhlIHByb3ZpZGVkIGtleS5cbiAgICovXG4gIGFzeW5jIGdldFNoYXJlQnlLZXkgKGtleTogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVzID0gKGF3YWl0IHRoaXMucmVxdWVzdCgnL3NoYXJlZC1saW5rcycpIHx8IFtdKSBhcyBTaGFyZWRMaW5rW11cbiAgICBjb25zdCBsaW5rID0gcmVzLmZpbmQoeCA9PiB4LmtleSA9PT0ga2V5KVxuICAgIGlmIChsaW5rKSB7XG4gICAgICAvLyBGaWx0ZXIgYXNzZXRzIHRvIGV4Y2x1ZGUgdHJhc2hlZCBhc3NldHNcbiAgICAgIGxpbmsuYXNzZXRzID0gbGluay5hc3NldHMuZmlsdGVyKHggPT4gIXguaXNUcmFzaGVkKVxuICAgICAgaWYgKGxpbmsuZXhwaXJlc0F0ICYmIGRheWpzKGxpbmsuZXhwaXJlc0F0KSA8IGRheWpzKCkpIHtcbiAgICAgICAgLy8gVGhpcyBsaW5rIGhhcyBleHBpcmVkXG4gICAgICAgIGxvZygnRXhwaXJlZCBsaW5rICcgKyBrZXkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbGlua1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdHJlYW0gYXNzZXQgYnVmZmVyIGRhdGEgZnJvbSBJbW1pY2guXG4gICAqXG4gICAqIEZvciBwaG90b3MsIHlvdSBjYW4gcmVxdWVzdCAndGh1bWJuYWlsJyBvciAnb3JpZ2luYWwnIHNpemUuXG4gICAqIEZvciB2aWRlb3MsIGl0IGlzIEltbWljaCdzIHN0cmVhbWluZyBxdWFsaXR5LCBub3QgdGhlIG9yaWdpbmFsIHF1YWxpdHkuXG4gICAqL1xuICBhc3luYyBnZXRBc3NldEJ1ZmZlciAoYXNzZXQ6IEFzc2V0LCBzaXplPzogSW1hZ2VTaXplKSB7XG4gICAgc3dpdGNoIChhc3NldC50eXBlKSB7XG4gICAgICBjYXNlIEFzc2V0VHlwZS5pbWFnZTpcbiAgICAgICAgc2l6ZSA9IHNpemUgPT09IEltYWdlU2l6ZS50aHVtYm5haWwgPyBJbWFnZVNpemUudGh1bWJuYWlsIDogSW1hZ2VTaXplLm9yaWdpbmFsXG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QoJy9hc3NldHMvJyArIGVuY29kZVVSSUNvbXBvbmVudChhc3NldC5pZCkgKyAnLycgKyBzaXplKVxuICAgICAgY2FzZSBBc3NldFR5cGUudmlkZW86XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QoJy9hc3NldHMvJyArIGVuY29kZVVSSUNvbXBvbmVudChhc3NldC5pZCkgKyAnL3ZpZGVvL3BsYXliYWNrJylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjb250ZW50LXR5cGUgb2YgYW4gSW1taWNoIGFzc2V0XG4gICAqL1xuICBhc3luYyBnZXRDb250ZW50VHlwZSAoYXNzZXQ6IEFzc2V0KSB7XG4gICAgY29uc3QgYXNzZXRCdWZmZXIgPSBhd2FpdCB0aGlzLmdldEFzc2V0QnVmZmVyKGFzc2V0KVxuICAgIHJldHVybiBhc3NldEJ1ZmZlci5oZWFkZXJzLmdldCgnQ29udGVudC1UeXBlJylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGltYWdlIGRhdGEgVVJMIGZvciBhIHBob3RvXG4gICAqL1xuICBwaG90b1VybCAoa2V5OiBzdHJpbmcsIGlkOiBzdHJpbmcsIHNpemU/OiBJbWFnZVNpemUpIHtcbiAgICByZXR1cm4gYC9waG90by8ke2tleX0vJHtpZH1gICsgKHNpemUgPyBgP3NpemU9JHtzaXplfWAgOiAnJylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHZpZGVvIGRhdGEgVVJMIGZvciBhIHZpZGVvXG4gICAqL1xuICB2aWRlb1VybCAoa2V5OiBzdHJpbmcsIGlkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYC92aWRlby8ke2tleX0vJHtpZH1gXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYSBwcm92aWRlZCBJRCBtYXRjaGVzIHRoZSBJbW1pY2ggSUQgZm9ybWF0XG4gICAqL1xuICBpc0lkIChpZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuICEhaWQubWF0Y2goL15bMC05YS1mXXs4fS1bMC05YS1mXXs0fS1bMC05YS1mXXs0fS1bMC05YS1mXXs0fS1bMC05YS1mXXsxMn0kLylcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIHByb3ZpZGVkIGtleSBtYXRjaGVzIHRoZSBJbW1pY2ggc2hhcmVkLWxpbmsga2V5IGZvcm1hdFxuICAgKi9cbiAgaXNLZXkgKGtleTogc3RyaW5nKSB7XG4gICAgcmV0dXJuICEha2V5Lm1hdGNoKC9eW1xcdy1dKyQvKVxuICB9XG59XG5cbmNvbnN0IGltbWljaCA9IG5ldyBJbW1pY2goKVxuXG5leHBvcnQgZGVmYXVsdCBpbW1pY2hcbiJdfQ==