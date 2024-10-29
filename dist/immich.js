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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1taWNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2ltbWljaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBaUU7QUFDakUsMERBQXlCO0FBRXpCLE1BQU0sTUFBTTtJQUNWOzs7T0FHRztJQUNHLE9BQU8sQ0FBRSxRQUFnQjs7WUFDN0IsTUFBTSxHQUFHLEdBQUcsTUFBTSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsTUFBTSxHQUFHLFFBQVEsRUFBRTtnQkFDbEUsT0FBTyxFQUFFO29CQUNQLFdBQVcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sSUFBSSxFQUFFO2lCQUN2QzthQUNGLENBQUMsQ0FBQTtZQUNGLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztnQkFDdkIsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFBO2dCQUN6RCxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDO29CQUM3QyxPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtnQkFDbkIsQ0FBQztxQkFBTSxDQUFDO29CQUNOLE9BQU8sR0FBRyxDQUFBO2dCQUNaLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztLQUFBO0lBRUQ7Ozs7O09BS0c7SUFDRyxhQUFhLENBQUUsR0FBVzs7WUFDOUIsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFBLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsS0FBSSxFQUFFLENBQWlCLENBQUE7WUFDdkUsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUE7WUFDekMsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDVCwwQ0FBMEM7Z0JBQzFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQTtnQkFDbkQsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUEsZUFBSyxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFBLGVBQUssR0FBRSxFQUFFLENBQUM7b0JBQ3RELHdCQUF3QjtnQkFDMUIsQ0FBQztxQkFBTSxDQUFDO29CQUNOLE9BQU8sSUFBSSxDQUFBO2dCQUNiLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztLQUFBO0lBRUQ7Ozs7T0FJRztJQUNHLGNBQWMsQ0FBRSxLQUFZLEVBQUUsSUFBZ0I7O1lBQ2xELFFBQVEsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNuQixLQUFLLGlCQUFTLENBQUMsS0FBSztvQkFDbEIsSUFBSSxHQUFHLElBQUksS0FBSyxpQkFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsaUJBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGlCQUFTLENBQUMsUUFBUSxDQUFBO29CQUM5RSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUE7Z0JBQzdFLEtBQUssaUJBQVMsQ0FBQyxLQUFLO29CQUNsQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxDQUFBO1lBQ3RGLENBQUM7UUFDSCxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNHLGNBQWMsQ0FBRSxLQUFZOztZQUNoQyxNQUFNLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDcEQsT0FBTyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUNoRCxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNILFFBQVEsQ0FBRSxHQUFXLEVBQUUsRUFBVSxFQUFFLElBQWdCO1FBQ2pELE9BQU8sVUFBVSxHQUFHLElBQUksRUFBRSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQzlELENBQUM7SUFFRDs7T0FFRztJQUNILFFBQVEsQ0FBRSxHQUFXLEVBQUUsRUFBVTtRQUMvQixPQUFPLFVBQVUsR0FBRyxJQUFJLEVBQUUsRUFBRSxDQUFBO0lBQzlCLENBQUM7SUFFRDs7T0FFRztJQUNILElBQUksQ0FBRSxFQUFVO1FBQ2QsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFBO0lBQ3JGLENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUssQ0FBRSxHQUFXO1FBQ2hCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDaEMsQ0FBQztDQUNGO0FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQTtBQUUzQixrQkFBZSxNQUFNLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBc3NldCwgQXNzZXRUeXBlLCBJbWFnZVNpemUsIFNoYXJlZExpbmsgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IGRheWpzIGZyb20gJ2RheWpzJ1xuXG5jbGFzcyBJbW1pY2gge1xuICAvKipcbiAgICogTWFrZSBhIHJlcXVlc3QgdG8gSW1taWNoIEFQSS4gV2UncmUgbm90IHVzaW5nIHRoZSBTREsgdG8gbGltaXRcbiAgICogdGhlIHBvc3NpYmxlIGF0dGFjayBzdXJmYWNlIG9mIHRoaXMgYXBwLlxuICAgKi9cbiAgYXN5bmMgcmVxdWVzdCAoZW5kcG9pbnQ6IHN0cmluZykge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHByb2Nlc3MuZW52LklNTUlDSF9VUkwgKyAnL2FwaScgKyBlbmRwb2ludCwge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICAneC1hcGkta2V5JzogcHJvY2Vzcy5lbnYuQVBJX0tFWSB8fCAnJ1xuICAgICAgfVxuICAgIH0pXG4gICAgaWYgKHJlcy5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgY29uc3QgY29udGVudFR5cGUgPSByZXMuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpIHx8ICcnXG4gICAgICBpZiAoY29udGVudFR5cGUuaW5jbHVkZXMoJ2FwcGxpY2F0aW9uL2pzb24nKSkge1xuICAgICAgICByZXR1cm4gcmVzLmpzb24oKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBRdWVyeSBJbW1pY2ggZm9yIHRoZSBTaGFyZWRMaW5rIG1ldGFkYXRhIGZvciBhIGdpdmVuIGtleS5cbiAgICogVGhlIGtleSBpcyB3aGF0IGlzIHJldHVybmVkIGluIHRoZSBVUkwgd2hlbiB5b3UgY3JlYXRlIGEgc2hhcmUgaW4gSW1taWNoLlxuICAgKiBJbW1pY2ggZG9lc24ndCBoYXZlIGEgbWV0aG9kIHRvIHF1ZXJ5IGJ5IGtleSwgc28gdGhpcyBtZXRob2QgZ2V0cyBhbGxcbiAgICoga25vd24gc2hhcmVkIGxpbmtzLCBhbmQgcmV0dXJucyB0aGUgbGluayB3aGljaCBtYXRjaGVzIHRoZSBwcm92aWRlZCBrZXkuXG4gICAqL1xuICBhc3luYyBnZXRTaGFyZUJ5S2V5IChrZXk6IHN0cmluZykge1xuICAgIGNvbnN0IHJlcyA9IChhd2FpdCB0aGlzLnJlcXVlc3QoJy9zaGFyZWQtbGlua3MnKSB8fCBbXSkgYXMgU2hhcmVkTGlua1tdXG4gICAgY29uc3QgbGluayA9IHJlcy5maW5kKHggPT4geC5rZXkgPT09IGtleSlcbiAgICBpZiAobGluaykge1xuICAgICAgLy8gRmlsdGVyIGFzc2V0cyB0byBleGNsdWRlIHRyYXNoZWQgYXNzZXRzXG4gICAgICBsaW5rLmFzc2V0cyA9IGxpbmsuYXNzZXRzLmZpbHRlcih4ID0+ICF4LmlzVHJhc2hlZClcbiAgICAgIGlmIChsaW5rLmV4cGlyZXNBdCAmJiBkYXlqcyhsaW5rLmV4cGlyZXNBdCkgPCBkYXlqcygpKSB7XG4gICAgICAgIC8vIFRoaXMgbGluayBoYXMgZXhwaXJlZFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGxpbmtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3RyZWFtIGFzc2V0IGJ1ZmZlciBkYXRhIGZyb20gSW1taWNoLlxuICAgKiBGb3IgcGhvdG9zLCB5b3UgY2FuIHJlcXVlc3QgJ3RodW1ibmFpbCcgb3IgJ29yaWdpbmFsJyBzaXplLlxuICAgKiBGb3IgdmlkZW9zLCBpdCBpcyBJbW1pY2gncyBzdHJlYW1pbmcgcXVhbGl0eSwgbm90IHRoZSBvcmlnaW5hbCBxdWFsaXR5LlxuICAgKi9cbiAgYXN5bmMgZ2V0QXNzZXRCdWZmZXIgKGFzc2V0OiBBc3NldCwgc2l6ZT86IEltYWdlU2l6ZSkge1xuICAgIHN3aXRjaCAoYXNzZXQudHlwZSkge1xuICAgICAgY2FzZSBBc3NldFR5cGUuaW1hZ2U6XG4gICAgICAgIHNpemUgPSBzaXplID09PSBJbWFnZVNpemUudGh1bWJuYWlsID8gSW1hZ2VTaXplLnRodW1ibmFpbCA6IEltYWdlU2l6ZS5vcmlnaW5hbFxuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KCcvYXNzZXRzLycgKyBlbmNvZGVVUklDb21wb25lbnQoYXNzZXQuaWQpICsgJy8nICsgc2l6ZSlcbiAgICAgIGNhc2UgQXNzZXRUeXBlLnZpZGVvOlxuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KCcvYXNzZXRzLycgKyBlbmNvZGVVUklDb21wb25lbnQoYXNzZXQuaWQpICsgJy92aWRlby9wbGF5YmFjaycpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY29udGVudC10eXBlIG9mIGFuIEltbWljaCBhc3NldFxuICAgKi9cbiAgYXN5bmMgZ2V0Q29udGVudFR5cGUgKGFzc2V0OiBBc3NldCkge1xuICAgIGNvbnN0IGFzc2V0QnVmZmVyID0gYXdhaXQgdGhpcy5nZXRBc3NldEJ1ZmZlcihhc3NldClcbiAgICByZXR1cm4gYXNzZXRCdWZmZXIuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBpbWFnZSBkYXRhIFVSTCBmb3IgYSBwaG90b1xuICAgKi9cbiAgcGhvdG9VcmwgKGtleTogc3RyaW5nLCBpZDogc3RyaW5nLCBzaXplPzogSW1hZ2VTaXplKSB7XG4gICAgcmV0dXJuIGAvcGhvdG8vJHtrZXl9LyR7aWR9YCArIChzaXplID8gYD9zaXplPSR7c2l6ZX1gIDogJycpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSB2aWRlbyBkYXRhIFVSTCBmb3IgYSB2aWRlb1xuICAgKi9cbiAgdmlkZW9VcmwgKGtleTogc3RyaW5nLCBpZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGAvdmlkZW8vJHtrZXl9LyR7aWR9YFxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgcHJvdmlkZWQgSUQgbWF0Y2hlcyB0aGUgSW1taWNoIElEIGZvcm1hdFxuICAgKi9cbiAgaXNJZCAoaWQ6IHN0cmluZykge1xuICAgIHJldHVybiAhIWlkLm1hdGNoKC9eWzAtOWEtZl17OH0tWzAtOWEtZl17NH0tWzAtOWEtZl17NH0tWzAtOWEtZl17NH0tWzAtOWEtZl17MTJ9JC8pXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYSBwcm92aWRlZCBrZXkgbWF0Y2hlcyB0aGUgSW1taWNoIHNoYXJlZC1saW5rIGtleSBmb3JtYXRcbiAgICovXG4gIGlzS2V5IChrZXk6IHN0cmluZykge1xuICAgIHJldHVybiAhIWtleS5tYXRjaCgvXltcXHctXSskLylcbiAgfVxufVxuXG5jb25zdCBpbW1pY2ggPSBuZXcgSW1taWNoKClcblxuZXhwb3J0IGRlZmF1bHQgaW1taWNoXG4iXX0=