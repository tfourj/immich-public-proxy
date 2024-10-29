"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const types_1 = require("./types");
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
            return res === null || res === void 0 ? void 0 : res.find(x => x.key === key);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1taWNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2ltbWljaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBaUU7QUFFakUsTUFBTSxNQUFNO0lBQ1Y7OztPQUdHO0lBQ0csT0FBTyxDQUFFLFFBQWdCOztZQUM3QixNQUFNLEdBQUcsR0FBRyxNQUFNLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxNQUFNLEdBQUcsUUFBUSxFQUFFO2dCQUNsRSxPQUFPLEVBQUU7b0JBQ1AsV0FBVyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxJQUFJLEVBQUU7aUJBQ3ZDO2FBQ0YsQ0FBQyxDQUFBO1lBQ0YsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUN2QixNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUE7Z0JBQ3pELElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUM7b0JBQzdDLE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFBO2dCQUNuQixDQUFDO3FCQUFNLENBQUM7b0JBQ04sT0FBTyxHQUFHLENBQUE7Z0JBQ1osQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO0tBQUE7SUFFRDs7Ozs7T0FLRztJQUNHLGFBQWEsQ0FBRSxHQUFXOztZQUM5QixNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUEsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxLQUFJLEVBQUUsQ0FBaUIsQ0FBQTtZQUN2RSxPQUFPLEdBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFBO1FBQ3RDLENBQUM7S0FBQTtJQUVEOzs7O09BSUc7SUFDRyxjQUFjLENBQUUsS0FBWSxFQUFFLElBQWdCOztZQUNsRCxRQUFRLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDbkIsS0FBSyxpQkFBUyxDQUFDLEtBQUs7b0JBQ2xCLElBQUksR0FBRyxJQUFJLEtBQUssaUJBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGlCQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBUyxDQUFDLFFBQVEsQ0FBQTtvQkFDOUUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQTtnQkFDekQsS0FBSyxpQkFBUyxDQUFDLEtBQUs7b0JBQ2xCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLEVBQUUsR0FBRyxpQkFBaUIsQ0FBQyxDQUFBO1lBQ2xFLENBQUM7UUFDSCxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNHLGNBQWMsQ0FBRSxLQUFZOztZQUNoQyxNQUFNLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDcEQsT0FBTyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUNoRCxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNILFFBQVEsQ0FBRSxHQUFXLEVBQUUsRUFBVSxFQUFFLElBQWdCO1FBQ2pELE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsVUFBVSxHQUFHLElBQUksRUFBRSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQ3ZGLENBQUM7SUFFRDs7T0FFRztJQUNILFFBQVEsQ0FBRSxHQUFXLEVBQUUsRUFBVTtRQUMvQixPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLFVBQVUsR0FBRyxJQUFJLEVBQUUsRUFBRSxDQUFBO0lBQ3ZELENBQUM7SUFFRDs7T0FFRztJQUNILElBQUksQ0FBRSxFQUFVO1FBQ2QsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFBO0lBQ3JGLENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUssQ0FBRSxHQUFXO1FBQ2hCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDaEMsQ0FBQztDQUNGO0FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQTtBQUUzQixrQkFBZSxNQUFNLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBc3NldCwgQXNzZXRUeXBlLCBJbWFnZVNpemUsIFNoYXJlZExpbmsgfSBmcm9tICcuL3R5cGVzJ1xuXG5jbGFzcyBJbW1pY2gge1xuICAvKipcbiAgICogTWFrZSBhIHJlcXVlc3QgdG8gSW1taWNoIEFQSS4gV2UncmUgbm90IHVzaW5nIHRoZSBTREsgdG8gbGltaXRcbiAgICogdGhlIHBvc3NpYmxlIGF0dGFjayBzdXJmYWNlIG9mIHRoaXMgYXBwLlxuICAgKi9cbiAgYXN5bmMgcmVxdWVzdCAoZW5kcG9pbnQ6IHN0cmluZykge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHByb2Nlc3MuZW52LklNTUlDSF9VUkwgKyAnL2FwaScgKyBlbmRwb2ludCwge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICAneC1hcGkta2V5JzogcHJvY2Vzcy5lbnYuQVBJX0tFWSB8fCAnJ1xuICAgICAgfVxuICAgIH0pXG4gICAgaWYgKHJlcy5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgY29uc3QgY29udGVudFR5cGUgPSByZXMuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpIHx8ICcnXG4gICAgICBpZiAoY29udGVudFR5cGUuaW5jbHVkZXMoJ2FwcGxpY2F0aW9uL2pzb24nKSkge1xuICAgICAgICByZXR1cm4gcmVzLmpzb24oKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBRdWVyeSBJbW1pY2ggZm9yIHRoZSBTaGFyZWRMaW5rIG1ldGFkYXRhIGZvciBhIGdpdmVuIGtleS5cbiAgICogVGhlIGtleSBpcyB3aGF0IGlzIHJldHVybmVkIGluIHRoZSBVUkwgd2hlbiB5b3UgY3JlYXRlIGEgc2hhcmUgaW4gSW1taWNoLlxuICAgKiBJbW1pY2ggZG9lc24ndCBoYXZlIGEgbWV0aG9kIHRvIHF1ZXJ5IGJ5IGtleSwgc28gdGhpcyBtZXRob2QgZ2V0cyBhbGxcbiAgICoga25vd24gc2hhcmVkIGxpbmtzLCBhbmQgcmV0dXJucyB0aGUgbGluayB3aGljaCBtYXRjaGVzIHRoZSBwcm92aWRlZCBrZXkuXG4gICAqL1xuICBhc3luYyBnZXRTaGFyZUJ5S2V5IChrZXk6IHN0cmluZykge1xuICAgIGNvbnN0IHJlcyA9IChhd2FpdCB0aGlzLnJlcXVlc3QoJy9zaGFyZWQtbGlua3MnKSB8fCBbXSkgYXMgU2hhcmVkTGlua1tdXG4gICAgcmV0dXJuIHJlcz8uZmluZCh4ID0+IHgua2V5ID09PSBrZXkpXG4gIH1cblxuICAvKipcbiAgICogU3RyZWFtIGFzc2V0IGJ1ZmZlciBkYXRhIGZyb20gSW1taWNoLlxuICAgKiBGb3IgcGhvdG9zLCB5b3UgY2FuIHJlcXVlc3QgJ3RodW1ibmFpbCcgb3IgJ29yaWdpbmFsJyBzaXplLlxuICAgKiBGb3IgdmlkZW9zLCBpdCBpcyBJbW1pY2gncyBzdHJlYW1pbmcgcXVhbGl0eSwgbm90IHRoZSBvcmlnaW5hbCBxdWFsaXR5LlxuICAgKi9cbiAgYXN5bmMgZ2V0QXNzZXRCdWZmZXIgKGFzc2V0OiBBc3NldCwgc2l6ZT86IEltYWdlU2l6ZSkge1xuICAgIHN3aXRjaCAoYXNzZXQudHlwZSkge1xuICAgICAgY2FzZSBBc3NldFR5cGUuaW1hZ2U6XG4gICAgICAgIHNpemUgPSBzaXplID09PSBJbWFnZVNpemUudGh1bWJuYWlsID8gSW1hZ2VTaXplLnRodW1ibmFpbCA6IEltYWdlU2l6ZS5vcmlnaW5hbFxuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KCcvYXNzZXRzLycgKyBhc3NldC5pZCArICcvJyArIHNpemUpXG4gICAgICBjYXNlIEFzc2V0VHlwZS52aWRlbzpcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdCgnL2Fzc2V0cy8nICsgYXNzZXQuaWQgKyAnL3ZpZGVvL3BsYXliYWNrJylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjb250ZW50LXR5cGUgb2YgYW4gSW1taWNoIGFzc2V0XG4gICAqL1xuICBhc3luYyBnZXRDb250ZW50VHlwZSAoYXNzZXQ6IEFzc2V0KSB7XG4gICAgY29uc3QgYXNzZXRCdWZmZXIgPSBhd2FpdCB0aGlzLmdldEFzc2V0QnVmZmVyKGFzc2V0KVxuICAgIHJldHVybiBhc3NldEJ1ZmZlci5oZWFkZXJzLmdldCgnQ29udGVudC1UeXBlJylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGltYWdlIGRhdGEgVVJMIGZvciBhIHBob3RvXG4gICAqL1xuICBwaG90b1VybCAoa2V5OiBzdHJpbmcsIGlkOiBzdHJpbmcsIHNpemU/OiBJbWFnZVNpemUpIHtcbiAgICByZXR1cm4gYCR7cHJvY2Vzcy5lbnYuU0VSVkVSX1VSTH0vcGhvdG8vJHtrZXl9LyR7aWR9YCArIChzaXplID8gYD9zaXplPSR7c2l6ZX1gIDogJycpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSB2aWRlbyBkYXRhIFVSTCBmb3IgYSB2aWRlb1xuICAgKi9cbiAgdmlkZW9VcmwgKGtleTogc3RyaW5nLCBpZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGAke3Byb2Nlc3MuZW52LlNFUlZFUl9VUkx9L3ZpZGVvLyR7a2V5fS8ke2lkfWBcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIHByb3ZpZGVkIElEIG1hdGNoZXMgdGhlIEltbWljaCBJRCBmb3JtYXRcbiAgICovXG4gIGlzSWQgKGlkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gISFpZC5tYXRjaCgvXlswLTlhLWZdezh9LVswLTlhLWZdezR9LVswLTlhLWZdezR9LVswLTlhLWZdezR9LVswLTlhLWZdezEyfSQvKVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgcHJvdmlkZWQga2V5IG1hdGNoZXMgdGhlIEltbWljaCBzaGFyZWQtbGluayBrZXkgZm9ybWF0XG4gICAqL1xuICBpc0tleSAoa2V5OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gISFrZXkubWF0Y2goL15bXFx3LV0rJC8pXG4gIH1cbn1cblxuY29uc3QgaW1taWNoID0gbmV3IEltbWljaCgpXG5cbmV4cG9ydCBkZWZhdWx0IGltbWljaFxuIl19