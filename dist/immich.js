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
            const res = yield fetch(process.env.IMMICH_URL + '/api' + endpoint);
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
     */
    getShareByKey(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const link = (yield this.request('/shared-links/me?key=' + encodeURIComponent(key)));
            if (link) {
                if (link.expiresAt && (0, dayjs_1.default)(link.expiresAt) < (0, dayjs_1.default)()) {
                    // This link has expired
                    (0, index_1.log)('Expired link ' + key);
                }
                else {
                    // Filter assets to exclude trashed assets
                    link.assets = link.assets.filter(asset => !asset.isTrashed);
                    link.assets.forEach(asset => { asset.key = key; });
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
                    return this.request('/assets/' + encodeURIComponent(asset.id) + '/' + size + '?key=' + encodeURIComponent(asset.key));
                case types_1.AssetType.video:
                    return this.request('/assets/' + encodeURIComponent(asset.id) + '/video/playback?key=' + encodeURIComponent(asset.key));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1taWNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2ltbWljaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBd0U7QUFDeEUsMERBQXlCO0FBQ3pCLG1DQUE2QjtBQUU3QixNQUFNLE1BQU07SUFDVjs7O09BR0c7SUFDRyxPQUFPLENBQUUsUUFBZ0I7O1lBQzdCLE1BQU0sR0FBRyxHQUFHLE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQTtZQUNuRSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7Z0JBQ3ZCLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtnQkFDekQsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQztvQkFDN0MsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUE7Z0JBQ25CLENBQUM7cUJBQU0sQ0FBQztvQkFDTixPQUFPLEdBQUcsQ0FBQTtnQkFDWixDQUFDO1lBQ0gsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLElBQUEsV0FBRyxFQUFDLG9CQUFvQixHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtnQkFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBO1lBQy9CLENBQUM7UUFDSCxDQUFDO0tBQUE7SUFFRDs7O09BR0c7SUFDRyxhQUFhLENBQUUsR0FBVzs7WUFDOUIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsdUJBQXVCLEdBQUcsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBZSxDQUFBO1lBQ2xHLElBQUksSUFBSSxFQUFFLENBQUM7Z0JBQ1QsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUEsZUFBSyxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFBLGVBQUssR0FBRSxFQUFFLENBQUM7b0JBQ3RELHdCQUF3QjtvQkFDeEIsSUFBQSxXQUFHLEVBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQyxDQUFBO2dCQUM1QixDQUFDO3FCQUFNLENBQUM7b0JBQ04sMENBQTBDO29CQUMxQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUE7b0JBQzNELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDakQsT0FBTyxJQUFJLENBQUE7Z0JBQ2IsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO0tBQUE7SUFFRDs7Ozs7T0FLRztJQUNHLGNBQWMsQ0FBRSxLQUFZLEVBQUUsSUFBZ0I7O1lBQ2xELFFBQVEsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNuQixLQUFLLGlCQUFTLENBQUMsS0FBSztvQkFDbEIsSUFBSSxHQUFHLElBQUksS0FBSyxpQkFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsaUJBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGlCQUFTLENBQUMsUUFBUSxDQUFBO29CQUM5RSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtnQkFDdkgsS0FBSyxpQkFBUyxDQUFDLEtBQUs7b0JBQ2xCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLHNCQUFzQixHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1lBQzNILENBQUM7UUFDSCxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNHLGNBQWMsQ0FBRSxLQUFZOztZQUNoQyxNQUFNLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDcEQsT0FBTyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUNoRCxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNILFFBQVEsQ0FBRSxHQUFXLEVBQUUsRUFBVSxFQUFFLElBQWdCO1FBQ2pELE9BQU8sVUFBVSxHQUFHLElBQUksRUFBRSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQzlELENBQUM7SUFFRDs7T0FFRztJQUNILFFBQVEsQ0FBRSxHQUFXLEVBQUUsRUFBVTtRQUMvQixPQUFPLFVBQVUsR0FBRyxJQUFJLEVBQUUsRUFBRSxDQUFBO0lBQzlCLENBQUM7SUFFRDs7T0FFRztJQUNILElBQUksQ0FBRSxFQUFVO1FBQ2QsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFBO0lBQ3JGLENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUssQ0FBRSxHQUFXO1FBQ2hCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDaEMsQ0FBQztDQUNGO0FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQTtBQUUzQixrQkFBZSxNQUFNLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBbGJ1bSwgQXNzZXQsIEFzc2V0VHlwZSwgSW1hZ2VTaXplLCBTaGFyZWRMaW5rIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCBkYXlqcyBmcm9tICdkYXlqcydcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4vaW5kZXgnXG5cbmNsYXNzIEltbWljaCB7XG4gIC8qKlxuICAgKiBNYWtlIGEgcmVxdWVzdCB0byBJbW1pY2ggQVBJLiBXZSdyZSBub3QgdXNpbmcgdGhlIFNESyB0byBsaW1pdFxuICAgKiB0aGUgcG9zc2libGUgYXR0YWNrIHN1cmZhY2Ugb2YgdGhpcyBhcHAuXG4gICAqL1xuICBhc3luYyByZXF1ZXN0IChlbmRwb2ludDogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2gocHJvY2Vzcy5lbnYuSU1NSUNIX1VSTCArICcvYXBpJyArIGVuZHBvaW50KVxuICAgIGlmIChyZXMuc3RhdHVzID09PSAyMDApIHtcbiAgICAgIGNvbnN0IGNvbnRlbnRUeXBlID0gcmVzLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKSB8fCAnJ1xuICAgICAgaWYgKGNvbnRlbnRUeXBlLmluY2x1ZGVzKCdhcHBsaWNhdGlvbi9qc29uJykpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5qc29uKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXNcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbG9nKCdJbW1pY2ggQVBJIHN0YXR1cyAnICsgcmVzLnN0YXR1cylcbiAgICAgIGNvbnNvbGUubG9nKGF3YWl0IHJlcy50ZXh0KCkpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFF1ZXJ5IEltbWljaCBmb3IgdGhlIFNoYXJlZExpbmsgbWV0YWRhdGEgZm9yIGEgZ2l2ZW4ga2V5LlxuICAgKiBUaGUga2V5IGlzIHdoYXQgaXMgcmV0dXJuZWQgaW4gdGhlIFVSTCB3aGVuIHlvdSBjcmVhdGUgYSBzaGFyZSBpbiBJbW1pY2guXG4gICAqL1xuICBhc3luYyBnZXRTaGFyZUJ5S2V5IChrZXk6IHN0cmluZykge1xuICAgIGNvbnN0IGxpbmsgPSAoYXdhaXQgdGhpcy5yZXF1ZXN0KCcvc2hhcmVkLWxpbmtzL21lP2tleT0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGtleSkpKSBhcyBTaGFyZWRMaW5rXG4gICAgaWYgKGxpbmspIHtcbiAgICAgIGlmIChsaW5rLmV4cGlyZXNBdCAmJiBkYXlqcyhsaW5rLmV4cGlyZXNBdCkgPCBkYXlqcygpKSB7XG4gICAgICAgIC8vIFRoaXMgbGluayBoYXMgZXhwaXJlZFxuICAgICAgICBsb2coJ0V4cGlyZWQgbGluayAnICsga2V5KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRmlsdGVyIGFzc2V0cyB0byBleGNsdWRlIHRyYXNoZWQgYXNzZXRzXG4gICAgICAgIGxpbmsuYXNzZXRzID0gbGluay5hc3NldHMuZmlsdGVyKGFzc2V0ID0+ICFhc3NldC5pc1RyYXNoZWQpXG4gICAgICAgIGxpbmsuYXNzZXRzLmZvckVhY2goYXNzZXQgPT4geyBhc3NldC5rZXkgPSBrZXkgfSlcbiAgICAgICAgcmV0dXJuIGxpbmtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3RyZWFtIGFzc2V0IGJ1ZmZlciBkYXRhIGZyb20gSW1taWNoLlxuICAgKlxuICAgKiBGb3IgcGhvdG9zLCB5b3UgY2FuIHJlcXVlc3QgJ3RodW1ibmFpbCcgb3IgJ29yaWdpbmFsJyBzaXplLlxuICAgKiBGb3IgdmlkZW9zLCBpdCBpcyBJbW1pY2gncyBzdHJlYW1pbmcgcXVhbGl0eSwgbm90IHRoZSBvcmlnaW5hbCBxdWFsaXR5LlxuICAgKi9cbiAgYXN5bmMgZ2V0QXNzZXRCdWZmZXIgKGFzc2V0OiBBc3NldCwgc2l6ZT86IEltYWdlU2l6ZSkge1xuICAgIHN3aXRjaCAoYXNzZXQudHlwZSkge1xuICAgICAgY2FzZSBBc3NldFR5cGUuaW1hZ2U6XG4gICAgICAgIHNpemUgPSBzaXplID09PSBJbWFnZVNpemUudGh1bWJuYWlsID8gSW1hZ2VTaXplLnRodW1ibmFpbCA6IEltYWdlU2l6ZS5vcmlnaW5hbFxuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KCcvYXNzZXRzLycgKyBlbmNvZGVVUklDb21wb25lbnQoYXNzZXQuaWQpICsgJy8nICsgc2l6ZSArICc/a2V5PScgKyBlbmNvZGVVUklDb21wb25lbnQoYXNzZXQua2V5KSlcbiAgICAgIGNhc2UgQXNzZXRUeXBlLnZpZGVvOlxuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KCcvYXNzZXRzLycgKyBlbmNvZGVVUklDb21wb25lbnQoYXNzZXQuaWQpICsgJy92aWRlby9wbGF5YmFjaz9rZXk9JyArIGVuY29kZVVSSUNvbXBvbmVudChhc3NldC5rZXkpKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGNvbnRlbnQtdHlwZSBvZiBhbiBJbW1pY2ggYXNzZXRcbiAgICovXG4gIGFzeW5jIGdldENvbnRlbnRUeXBlIChhc3NldDogQXNzZXQpIHtcbiAgICBjb25zdCBhc3NldEJ1ZmZlciA9IGF3YWl0IHRoaXMuZ2V0QXNzZXRCdWZmZXIoYXNzZXQpXG4gICAgcmV0dXJuIGFzc2V0QnVmZmVyLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgaW1hZ2UgZGF0YSBVUkwgZm9yIGEgcGhvdG9cbiAgICovXG4gIHBob3RvVXJsIChrZXk6IHN0cmluZywgaWQ6IHN0cmluZywgc2l6ZT86IEltYWdlU2l6ZSkge1xuICAgIHJldHVybiBgL3Bob3RvLyR7a2V5fS8ke2lkfWAgKyAoc2l6ZSA/IGA/c2l6ZT0ke3NpemV9YCA6ICcnKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdmlkZW8gZGF0YSBVUkwgZm9yIGEgdmlkZW9cbiAgICovXG4gIHZpZGVvVXJsIChrZXk6IHN0cmluZywgaWQ6IHN0cmluZykge1xuICAgIHJldHVybiBgL3ZpZGVvLyR7a2V5fS8ke2lkfWBcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIHByb3ZpZGVkIElEIG1hdGNoZXMgdGhlIEltbWljaCBJRCBmb3JtYXRcbiAgICovXG4gIGlzSWQgKGlkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gISFpZC5tYXRjaCgvXlswLTlhLWZdezh9LVswLTlhLWZdezR9LVswLTlhLWZdezR9LVswLTlhLWZdezR9LVswLTlhLWZdezEyfSQvKVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgcHJvdmlkZWQga2V5IG1hdGNoZXMgdGhlIEltbWljaCBzaGFyZWQtbGluayBrZXkgZm9ybWF0XG4gICAqL1xuICBpc0tleSAoa2V5OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gISFrZXkubWF0Y2goL15bXFx3LV0rJC8pXG4gIH1cbn1cblxuY29uc3QgaW1taWNoID0gbmV3IEltbWljaCgpXG5cbmV4cG9ydCBkZWZhdWx0IGltbWljaFxuIl19